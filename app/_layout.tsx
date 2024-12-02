import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'

const queryClient = new QueryClient()

const Layout = () => {
  const [isChecked, setIsChecked] = useState(false)

  const persister = createAsyncStoragePersister({
    storage: AsyncStorage
  })

  const client = new ApolloClient({
    uri: 'https://api.dev-fugo.com/',
    cache: new InMemoryCache()
  })

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const profileVisited = await AsyncStorage.getItem('profileVisited')
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn')
      } catch (error) {
        console.error('Error checking profile visit or login status:', error)
      } finally {
        setIsChecked(true)
      }
    }

    checkStatus()
  }, [])

  if (!isChecked) {
    return null
  }

  return (
    <ApolloProvider client={client}>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <Stack screenOptions={{ headerShown: false }} />
      </PersistQueryClientProvider>
    </ApolloProvider>
  )
}

export default Layout
