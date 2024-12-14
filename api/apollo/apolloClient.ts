import { ApolloClient, InMemoryCache } from '@apollo/client'

// Function that creates and returns a new ApolloClient instance
export const apolloClient = (uri: string): ApolloClient<any> => {
  if (!uri) {
    throw new Error('URI is required to create an Apollo Client')
  }

  return new ApolloClient({
    uri,
    cache: new InMemoryCache()
  })
}
