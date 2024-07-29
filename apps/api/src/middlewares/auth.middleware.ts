import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { CustomRequest } from "../types/share.js";
import prisma from "../db/index.js";
config({
    path: "./.env",
});

export const verifyJwt = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const token =
                req.cookies?.accessToken ||
                req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                throw ApiError.Unauthorized();
            }

            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET!
            ) as Record<string, string>;
            let user
            if (decodedToken?._id) {
                user = await prisma.user.findUnique({
                    where: {
                        id: parseInt(decodedToken._id),
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        password: false,
                        refreshToken: false,
                    }
                })
            }
            if (!user) {
                throw ApiError.Unauthorized();
            }
            req.user = user;
            next();
        } catch (error) {
            throw ApiError.Unauthorized();
        }
    }
);