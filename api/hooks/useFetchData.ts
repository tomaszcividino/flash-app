import { authenticationConstants } from '@/constants/constants'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
interface UseFetchDataParams {
  client: ApolloClient<NormalizedCacheObject>
  key: string
  query: any
}

export const useFetchData = ({ client, key, query }: UseFetchDataParams): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const [accessToken, teamId] = await Promise.all([
        AsyncStorage.getItem(authenticationConstants.accessToken),
        AsyncStorage.getItem(authenticationConstants.teamId)
      ])

      if (!accessToken) throw new Error(authenticationConstants.errors.missingToken)
      if (!teamId) throw new Error(authenticationConstants.errors.missingTeamId)

      await client.cache.reset()

      const { data } = await client.query({
        query,
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Team-Id': teamId
          }
        },
        fetchPolicy: 'no-cache'
      })

      return data
    },
    staleTime: 5 * 60 * 1000,
    retry: 3
  })
}
