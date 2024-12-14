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
      const accessToken = await AsyncStorage.getItem('accessToken')
      const teamId = await AsyncStorage.getItem('teamId')

      if (!accessToken || !teamId) {
        throw new Error('Missing access token or team ID')
      }

      // Manually clear the Apollo Client cache
      await client.cache.reset() // Clear the cache manually

      const { data } = await client.query({
        query,
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Team-Id': teamId
          }
        },
        fetchPolicy: 'no-cache' // Ensures that no cache is used for the specific query
      })

      return data
    },
    staleTime: 5 * 60 * 1000,
    retry: 3
  })
}
