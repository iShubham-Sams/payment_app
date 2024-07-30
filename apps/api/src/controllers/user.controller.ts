import prisma from "@repo/db/client";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { config } from "dotenv";
import bcrypt from "bcryptjs"
config({
    path: "./.env",
});
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import HttpStatusCode from "../utils/statusCode";
import { loginUserZodSchema, registerUserZodSchema, updateAccountDetailsZodSchema } from "@repo/zod/user";
import { CustomRequest } from "../types/share.js";

const generateAccessToken = (userId: number, email: string, name: string, number: string) => {
    return jwt.sign({ _id: userId, email: email, name: name, number: number },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (userId: number) => {
    return jwt.sign({ _id: userId, },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};

const generateAccessAndRefreshToken = async (userId: number, email: string, name: string, number: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (user) {
            const accessToken = await generateAccessToken(userId, email, name, number)
            const refreshToken = await generateRefreshToken(userId)
            await prisma.user.update({
                where: { id: userId },
                data: { refreshToken },
            });;
            return { accessToken, refreshToken };
        } else {
            throw new ApiError(
                "User not found",
                HttpStatusCode.NOT_FOUND,
                "UserNotFoundError"
            );
        }
    } catch (error) {
        throw new ApiError(
            "Something went wrong while creating access and refresh token",
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "ServerError"
        );
    }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    let {
        body: { email, name, password, number },
    } = await registerUserZodSchema.parseAsync(req);
    let existedUser = await prisma.user.findUnique(({
        where: {
            email: email
        }
    }));

    if (existedUser) {
        throw new ApiError(
            "User with email or username already exists",
            HttpStatusCode.CONFLICT,
            "Conflict"
        );
    }
    password = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            name,
            number,
            password
        }
    })

    const userCreateDone = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
            refreshToken: false,
        }
    })

    if (!userCreateDone) {
        throw ApiError.ServerError("Something went wrong while registering user");
    }

    return res
        .status(HttpStatusCode.CREATED)
        .json(
            new ApiResponse(
                HttpStatusCode.OK,
                userCreateDone,
                "User register successfully"
            )
        );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const {
        body: { password, email },
    } = await loginUserZodSchema.parseAsync(req);
    if (!email) {
        throw new ApiError(
            "User name or Email required",
            HttpStatusCode.BAD_REQUEST,
            "BadRequest"
        );
    }
    const user = await prisma.user.findUnique({
        where: { email: email }
    })
    if (!user) {
        throw new ApiError(
            "User does not exist",
            HttpStatusCode.NOT_FOUND,
            "NotFound"
        );
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
        throw new ApiError(
            "Invalid user credentials",
            HttpStatusCode.BAD_REQUEST,
            "BadRequest"
        );
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user.id, user.email, user.name, user.number
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    } as { sameSite: "lax" | "none" | "strict", httpOnly: boolean, secure: boolean }
    return res
        .status(HttpStatusCode.OK)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                HttpStatusCode.OK,
                { accessToken, refreshToken },
                "User login Successfully"
            )
        );
});

const logOutUser = asyncHandler(async (req: CustomRequest, res: Response) => {
    let email = req.user.email as string
    await prisma.user.update({
        where: {
            email: email
        },
        data: {
            refreshToken: null
        }
    })
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(HttpStatusCode.OK)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(HttpStatusCode.OK, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    try {
        const incomingRefreshToken =
            req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            throw ApiError.Unauthorized();
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        ) as jwt.JwtPayload;
        const user = await prisma.user.findUnique({
            where: { id: decodedToken?._id }
        })
        if (!user) {
            throw ApiError.Unauthorized("Invalid refresh token");
        }
        if (incomingRefreshToken !== user.refreshToken) {
            throw ApiError.Unauthorized("Refresh token expired");
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
            user.id, user.email, user.name, user.number
        );
        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(HttpStatusCode.OK)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    HttpStatusCode.OK,
                    {
                        accessToken,
                        refreshToken,
                    },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw ApiError.Unauthorized();
    }
});

const getCurrentUser = asyncHandler(
    async (req: CustomRequest, res: Response) => {
        return res
            .status(HttpStatusCode.OK)
            .json(
                new ApiResponse(
                    HttpStatusCode.OK,
                    req.user,
                    "Current user fetch successfully"
                )
            );
    }
);

const updateAccountDetails = asyncHandler(
    async (req: CustomRequest, res: Response) => {

        const {
            body: { email, name, password },
        } = await updateAccountDetailsZodSchema.parseAsync(req);

        const updatedUser = await prisma.user.update({
            where: {
                id: req.user._id
            },
            data: {
                email,
                name,
                password
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: false,
                refreshToken: false,
            }
        })
        return res
            .status(HttpStatusCode.OK)
            .json(
                new ApiResponse(
                    HttpStatusCode.OK,
                    updatedUser,
                    "User update successfully"
                )
            );
    }
);


export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails,
};