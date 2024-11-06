import { z } from 'zod'

export const ProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Industry is required'),
  foundUs: z.string().min(1, 'Please select how you found us')
})
