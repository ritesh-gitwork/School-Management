import {z} from "zod"

export const classSchema = z.object({
    className: z.string({ required_error:"classname is required"
    }).trim().min(2, { message: "className must be at least 2 characters" }),
})