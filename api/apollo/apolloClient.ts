import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apolloClient = (uri: string): ApolloClient<any> => {
  if (!uri) {
    throw new Error('URI is required to create an Apollo Client')
  }

  return new ApolloClient({
    uri,
    cache: new InMemoryCache()
  })
}
