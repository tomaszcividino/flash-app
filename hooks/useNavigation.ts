import { useRouter } from 'expo-router'

export const useNavigation = () => {
  const router = useRouter()

  const navigateToAuthentication = () => {
    router.push('/(auth)/authentication')
  }

  return { navigateToAuthentication }
}
