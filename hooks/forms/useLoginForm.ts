import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { Alert } from 'react-native'

import { useAuthenticateUser } from '@/api/hooks/useAuthenticateUser'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
      email: 'zajas.piotr@gmail.com',
      password: '123123'
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authenticateUser(data)
      if (response?.data?.authenticate) {
        await AsyncStorage.setItem('isLoggedIn', 'true')

        const profileVisited = await AsyncStorage.getItem('profileVisited')
        if (profileVisited) {
          router.replace('/home')
        } else {
          router.replace('/home/profile')
        }
      }
    } catch (error) {
      console.error('Error during login:', error)
      Alert.alert('Login failed', 'Please check your credentials and try again.')
    }
  }

  return { control, handleSubmit, errors, trigger, onSubmit }
}
