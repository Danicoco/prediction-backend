/** @format */

import { z } from "zod"

export const basicUserValidation = z
    .object({
        email: z
            .string()
            .email({ message: "Provide a valid email" })
            .nonempty({ message: "Enter your email" })
            .trim()
            .toLowerCase(),
        password: z.string().nonempty({ message: "Password cannot be empty" }),
    })
    .required()
    .strict()

export const createSchema = z
    .object({
        email: z
            .string({ required_error: "Enter your email" })
            .email()
            .nonempty()
            .trim()
            .toLowerCase(),
        password: z
            .string({ required_error: "Password cannot be empty" })
            .nonempty(),
        lastName: z.string({ required_error: "Enter Last Name" }).nonempty(),
        firstName: z.string({ required_error: "Enter First Name" }).nonempty(),
        phoneNumber: z
            .string({ required_error: "Enter Phone Number" })
            .nonempty(),
        gender: z
            .string({ required_error: "Enter Gender" })
            .nonempty(),
        dateOfBirth: z
            .string()
            .optional(),
    })
    .strict()

export const verifySchema = z
    .object({
        email: z.string({ required_error: "Enter email" }).nonempty(),
        otp: z.string({ required_error: "Enter verification code" }).nonempty(),
    })
    .strict()

export const loginSchema = z
    .object({
        to: z
            .string({ required_error: "Enter email or phone number" })
            .nonempty(),
        password: z.string({ required_error: "Enter password" }).nonempty(),
    })
    .strict()

export const resendCodeSchema = z
    .object({
        email: z.string({ required_error: "Enter email" }).nonempty(),
    })
    .strict()

export const changePasswordSchema = z
    .object({
        oldPassword: z.string({ required_error: "Enter current password" }).nonempty().min(8),
        password: z.string({ required_error: "Enter new password" }).nonempty().min(8),
    })
    .strict()

export const updateSchema = z
    .object({
        nin: z.string().optional(),
        dateOfBirth: z.string().optional(),
        avatar: z.string().optional(),
    })
    .strict()

export const fetchSchema = z
    .object({
        username: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        phoneNumber: z.string().optional(),
    })
    .strict()
