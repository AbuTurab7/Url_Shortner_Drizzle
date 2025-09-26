import z from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(3, { message: "Name must be at least 3 characters long." })
  .max(100, { message: "Name must be no more than 100 characters." });

export const loginValidation = z.object({
  email: z
    .email({ message: "Please enter a valid email address." })
    .trim()
    .max(100, { message: "Email must be no more than 100 characters." }),

  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(20, { message: "Password must be no more than 20 characters." }),
});

export const registrationValidation = loginValidation.extend({
  name: nameSchema,
});

export const verifyEmailValidation = z.object({
  token: z.string().trim().length(8),
  email: z.email().trim(),
});

export const verifyUserValidation = z.object({
  name: nameSchema,
});

export const passwordVerification = z
  .object({
    currentPassword: z.string().trim(),

    newPassword: z
      .string()
      .trim()
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(20, { message: "Password must be no more than 20 characters." }),

    confirmPassword: z
      .string()
      .trim()
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(20, { message: "Password must be no more than 20 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password does not match",
  });
