import z from 'zod';

export const userSchema = z.object({
    userName : z.string(),
    password : z.string().min(3)
})