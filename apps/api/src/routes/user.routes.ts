// import zodValidate from "@repo/zod-schema/zodValidator";
import {
    getCurrentUser,
    logOutUser,
    // loginUser,
    refreshAccessToken,
    // registerUser,
    // updateAccountDetails,
} from "../controllers/user.controller.js";
import { Router } from "express";
// import {
//     loginUserZodSchema,
//     registerUserZodSchema,
// } from "@repo/zod-schema/userZodSchema";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// router.route("/register").post(zodValidate(registerUserZodSchema), registerUser);
// router.route("/login").post(zodValidate(loginUserZodSchema), loginUser);
router.route("/logout").post(verifyJwt, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJwt, getCurrentUser);
// router.route("/update-account").patch(verifyJwt, updateAccountDetails);

export default router;