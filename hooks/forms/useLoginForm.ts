import { useForm } from 'react-hook-form'
import { Alert } from 'react-native'

import { useAuthenticateUser } from '@/api/useAuthenticateUser'

export interface LoginFormData {
  email: string
  password: string
}

export const useLoginForm = () => {
  const { authenticateUser } = useAuthenticateUser()

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
        Alert.alert('Success', 'Login successful!')
      }
    } catch (error) {
      console.error('Error during login:', error)
      Alert.alert('Login failed', 'Please check your credentials and try again.')
    }
  }

  return { control, handleSubmit, errors, trigger, onSubmit }
}
