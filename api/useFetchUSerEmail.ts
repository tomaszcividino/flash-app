import { ApolloClient, gql, HttpLink, InMemoryCache, useQuery } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

const GET_ACCOUNT_EMAIL = gql`
  query Account {
    account {
      email
    }
  }
`

export const useFetchUserEmail = () => {
  const [client, setClient] = useState<ApolloClient<any> | null>(null)
  const [loadingState, setLoadingState] = useState(true)
  const fetchEmailHeaders = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken')
      const teamId = await AsyncStorage.getItem('teamId')

      if (!accessToken || !teamId) {
        throw new Error('Access token or team ID is missing')
      }

      return { accessToken, teamId }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage', error)
      throw error
    }
  }

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const { accessToken, teamId } = await fetchEmailHeaders()

        const apolloClient = new ApolloClient({
          link: new HttpLink({
            uri: 'https://api.dev-fugo.com/cms/tenant',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-Team-Id': teamId
            }
          }),
          cache: new InMemoryCache()
        })

        setClient(apolloClient)
        setLoadingState(false)
      } catch (error) {
        console.error('Failed to initialize Apollo client', error)
        setLoadingState(false)
      }
    }

    initializeClient()
  }, [])

  const { data, loading, error } = useQuery(GET_ACCOUNT_EMAIL, {
    client,
    skip: loadingState || !client
  })

  return { email: data?.account?.email, loading: loading || loadingState, error }
}
