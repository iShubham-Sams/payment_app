import zodValidate from "@repo/zod/zodValidate";
import { registerUserZodSchema, loginUserZodSchema } from '@repo/zod/user';
import {
    registerUser,
    loginUser,
    getCurrentUser,
    logOutUser,
    refreshAccessToken,
    updateAccountDetails,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

import { Router } from "express";
const router = Router()

router.route("/register").post(zodValidate(registerUserZodSchema), registerUser);
router.route("/login").post(zodValidate(loginUserZodSchema), loginUser);
router.route("/logout").post(verifyJwt, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt, updateAccountDetails);

export default router;