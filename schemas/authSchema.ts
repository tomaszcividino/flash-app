import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').min(1, 'Password is required')
})