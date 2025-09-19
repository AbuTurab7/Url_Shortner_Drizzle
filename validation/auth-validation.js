import z, { email } from "zod";

export const loginValidation = z.object({
    email: z.email({ message: "Please enter a valid email address." })
    .trim()
    .max(100, { message: "Email must be no more than 100 characters." }),

    password: z.string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(20, { message: "Password must be no more than 20 characters." }),
});

export const registrationValidation = loginValidation.extend({
    name: z.string()
    .trim()
    .min(3 , { message: "Name must be at least 3 characters long." })
    .max(100, { message: "Name must be no more than 100 characters." }),
});

export const verifyEmailValidation = z.object({
    token: z.string().trim().length(8),
    email: z.email().trim(),
});