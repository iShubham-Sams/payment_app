import z from "zod";

export type UserRegisterFormData = z.infer<typeof registerUserZodSchema>;
export const registerUserZodSchema = z.object({
    name: z
        .string({
            required_error: "User name is required",
            invalid_type_error: "User name must be a string",
        })
        .min(8),
    email: z
        .string({
            required_error: "Email is required",
            invalid_type_error: "Please send valid email",
        })
        .email(),
    number: z.string({
        required_error: "number required",
    }).regex(/^(\[\-\s]?)?[0]?(91)?[789]\d{9}$/),
    password: z.string({
        required_error: "Password required",
    }),
});

export type LoginUser = z.infer<typeof loginUserZodSchema>
export const loginUserZodSchema = z.object({
    username: z
        .string({
            required_error: "Email or username required",
            invalid_type_error: "User name must be a string",
        })
        .min(8)
        .optional(),
    email: z
        .string({
            required_error: "Email is required",
            invalid_type_error: "Please send valid email",
        })
        .email()
        .optional(),
    password: z.string({
        required_error: "Password required",
    }),
});


export const updateAccountDetailsZodSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: "Full name must be a string",
        }).optional(),
        email: z
            .string({
                invalid_type_error: "Please send valid email",
            })
            .email().optional(),
        password: z.string().optional(),
    }),
});
