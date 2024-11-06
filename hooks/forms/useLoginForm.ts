import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { Alert } from 'react-native'

import { useAuthenticateUser } from '@/api/useAuthenticateUser'
export interface LoginFormData {
  email: string
  password: string
}

export const useLoginForm = () => {
  const { authenticateUser } = useAuthenticateUser()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm<LoginFormData>({
    // resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: 'test@test.com',
      password: 'test123'
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authenticateUser(data)
      if (response?.data?.authenticate) {
        const isProfileFilled = false

        if (isProfileFilled) {
          Alert.alert('Success', 'Login successful!')
          router.replace('/(main)')
        } else {
          Alert.alert('Profile Incomplete', 'Please complete your profile.')
          router.replace('/(main)/profile')
        }
      }
    } catch (error) {
      console.error('Error during login:', error)
      Alert.alert('Login failed', 'Please check your credentials and try again.')
    }
  }

  return { control, handleSubmit, errors, trigger, onSubmit }
}
