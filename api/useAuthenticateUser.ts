import { gql, useMutation } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQueryClient } from '@tanstack/react-query'

interface AuthenticateInput {
  email: string
  password: string
}

interface AuthenticateResponse {
  authenticate: {
    auth: {
      accessToken: string
      refreshToken: string
    }
    teamId: string
    tenantId: string
  }
}

export const AUTHENTICATE_USER = gql`
  mutation Authenticate($email: String!, $password: String!) {
    authenticate(email: $email, password: $password) {
      auth {
        accessToken
        refreshToken
      }
      teamId
      tenantId
    }
  }
`

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

        await AsyncStorage.setItem('accessToken', accessToken)
        await AsyncStorage.setItem('refreshToken', refreshToken)

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
