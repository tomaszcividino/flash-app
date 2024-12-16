import { authenticationConstants } from '@/constants/constants'
import { AuthenticateInput, AuthenticateResponse } from '@/src/typescript/authenticationTypes'
import { useMutation } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { AUTHENTICATE_USER } from '../mutations/authMutations'

import AsyncStorage from '@react-native-async-storage/async-storage'

export const useAuthenticateUser = () => {
  const queryClient = useQueryClient()
  const [authenticate, { data, loading, error }] = useMutation<AuthenticateResponse, AuthenticateInput>(
    AUTHENTICATE_USER
  )

  const authenticateUser = async ({ email, password }: AuthenticateInput) => {
    try {
      const response = await authenticate({
        variables: { email, password }
      })

      if (response?.data?.authenticate) {
        const { accessToken, refreshToken } = response.data.authenticate.auth
        const { teamId } = response.data.authenticate

        await AsyncStorage.setItem(authenticationConstants.accessToken, accessToken)
        await AsyncStorage.setItem(authenticationConstants.refreshToken, refreshToken)
        await AsyncStorage.setItem(authenticationConstants.teamId, teamId)

        queryClient.setQueryData(['isUserLoggedIn'], true)

        return response
      } else {
        throw new Error('Authentication failed')
      }
    } catch (err) {
      console.error('Authentication error:', err)
      throw err
    }
  }

  return { authenticateUser, data, loading, error }
}
