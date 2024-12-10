import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

import AsyncStorage from '@react-native-async-storage/async-storage'

interface UseFetchDataParams {
  client: ApolloClient<NormalizedCacheObject>
  key: string
  query: any
}

export const useFetchData = ({ client, key, query }: UseFetchDataParams): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const accessToken = await AsyncStorage.getItem('accessToken')
      const teamId = await AsyncStorage.getItem('teamId')

      if (!accessToken || !teamId) {
        throw new Error('Missing access token or team ID')
      }

      const { data } = await client.query({
        query,
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Team-Id': teamId
          }
        }
      })

      return data
    },
    staleTime: 5 * 60 * 1000,
    retry: 3
  })
}
