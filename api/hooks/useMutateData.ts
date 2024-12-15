import { authenticationConstants } from '@/constants/constants'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
interface UseFetchDataParams {
  client: ApolloClient<NormalizedCacheObject>
  key: string
  mutation: any
}

export const useMutateData = ({ client, key, mutation }: UseFetchDataParams): UseMutationResult<any, Error> => {
  return useMutation({
    mutationKey: [key],
    mutationFn: async (variables: any) => {
      const [accessToken, teamId] = await Promise.all([
        AsyncStorage.getItem(authenticationConstants.accessToekn),
        AsyncStorage.getItem(authenticationConstants.teamId)
      ])

      if (!accessToken) throw new Error(authenticationConstants.errors.missingToken)
      if (!teamId) throw new Error(authenticationConstants.errors.missingTeamId)

      await client.cache.reset()

      const { data } = await client.mutate({
        mutation,
        variables,
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Team-Id': teamId
          }
        }
      })

      return data
    },
    onError: (error) => {
      console.error(error)
    },
    onSuccess: (data) => {
      console.log('Mutation success', data)
    },
    retry: 3
  })
}
