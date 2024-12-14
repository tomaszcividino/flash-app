import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://api.dev-fugo.com/cms/player',
  cache: new InMemoryCache()
})

const SCREEN_COUNT_QUERY = gql`
  query Screen {
    screenCount
  }
`

export default function ConfirmationScreen() {
  const [screenCount, setScreenCount] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchScreenCount = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken')
        const teamId = await AsyncStorage.getItem('teamId')

        if (!accessToken || !teamId) {
          setError('Missing access token or team ID')
          return
        }

        // Fetch the screen count using Apollo Client
        const { data } = await client.query({
          query: SCREEN_COUNT_QUERY,
          context: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-Team-Id': teamId
            }
          }
        })

        setScreenCount(data.screenCount)
      } catch (err) {
        setError('Error fetching screen count')
        console.error('Error fetching screen count:', err)
      }
    }

    fetchScreenCount()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmation</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {screenCount !== null ? (
        <Text style={styles.screenCountText}>Screen Count: {screenCount}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  screenCountText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20
  }
})
