import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import base64 from 'react-native-base64'
import { BleManager } from 'react-native-ble-plx'

// Initialize BleManager
const bleManager = new BleManager()

// GraphQL Mutation to pair player
const PAIR_PLAYER_MUTATION = gql`
  mutation PairPlayer(
    $tenantId: String!
    $pin: String!
    $name: String!
    $address: String
    $colour: String!
    $groupId: String
    $settings: JSON!
    $shared: [String!]!
  ) {
    pairPlayer(
      tenantId: $tenantId
      pin: $pin
      name: $name
      address: $address
      colour: $colour
      groupId: $groupId
      settings: $settings
      shared: $shared
    ) {
      playerId
      name
      registrationStatus
    }
  }
`

// GraphQL Query to fetch tenantId
const GET_TENANT_ID_QUERY = gql`
  query Tenant {
    tenant {
      tenantId
    }
  }
`

// Apollo Client Configuration
const client = new ApolloClient({
  uri: 'https://api.dev-fugo.com/cms/player', // Replace with your GraphQL endpoint
  cache: new InMemoryCache()
})

export default function PairScreen() {
  const [pin, setPin] = useState(null) // State to store the retrieved PIN
  const [tenantId, setTenantId] = useState(null) // State to store the tenantId
  const [error, setError] = useState(null) // State to store errors

  useEffect(() => {
    const getPinAndTenantId = async () => {
      try {
        // Fetch the tenantId
        console.log('Fetching tenantId...')
        const { data } = await client.query({
          query: GET_TENANT_ID_QUERY
        })

        if (data && data.tenant && data.tenant.tenantId) {
          setTenantId(data.tenant.tenantId)
          console.log('Fetched tenantId:', data.tenant.tenantId)
        } else {
          setError('Failed to fetch tenantId.')
          console.error('Failed to fetch tenantId.')
        }

        // Fetch the PIN from the BLE device
        const deviceId = 'D8:3A:DD:CB:B4:FE' // Example device ID, replace with actual ID
        console.log('Connecting to device:', deviceId)

        // Step 1: Connect to the device
        const device = await bleManager.connectToDevice(deviceId)
        console.log('Successfully connected to device:', device.id)

        // Step 2: Discover all services and characteristics
        await device.discoverAllServicesAndCharacteristics()
        console.log('Discovered all services and characteristics')

        // Step 3: Get the service and characteristic
        const serviceUUID = 'aabbccdd-1234-5678-9101-112233445566' // Replace with the actual service UUID
        const pinCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445570' // Replace with the actual characteristic UUID

        // Step 4: Retrieve the characteristic from the service
        const characteristic = await device.readCharacteristicForService(serviceUUID, pinCharacteristicUUID)
        console.log('Got PIN characteristic:', characteristic)

        // Step 5: Decode and retrieve the PIN
        const decodedPin = base64.decode(characteristic.value)
        console.log('PIN Value received:', decodedPin)

        // Update state with the retrieved PIN
        setPin(decodedPin)
      } catch (error) {
        console.error('Error fetching PIN or tenantId:', error)
        setError('Failed to fetch PIN or tenantId.')
      }
    }

    getPinAndTenantId()

    // Cleanup: disconnect the device when the component is unmounted
    return () => {
      bleManager.destroy()
    }
  }, [])

  // Handle Complete button press
  const handleComplete = async () => {
    if (!pin) {
      console.error('PIN is missing')
      setError('PIN is missing. Try again.')
      return
    }

    if (!tenantId) {
      console.error('tenantId is missing')
      setError('tenantId is missing. Please try again.')
      return
    }

    // Get the access token and team ID from AsyncStorage
    console.log('Fetching access token and team ID...')
    const accessToken = await AsyncStorage.getItem('accessToken')
    const teamId = await AsyncStorage.getItem('teamId')

    console.log('Access Token:', accessToken)
    console.log('Team ID:', teamId)

    if (!accessToken || !teamId) {
      setError('Missing access token or team ID')
      console.error('Missing access token or team ID')
      return
    }

    // Prepare the necessary data to pair the player
    const name = 'D8:3A:DD:CB:B4:FE' // Example player name
    const address = 'Some Address' // Optional address
    const colour = 'Blue' // Example colour
    const groupId = 'group-id' // Example group ID
    const settings = {} // Example settings object
    const shared = [] // Example shared array

    try {
      console.log('Calling GraphQL mutation...')
      // Perform the GraphQL mutation to pair the player
      const { data } = await client.mutate({
        mutation: PAIR_PLAYER_MUTATION,
        variables: {
          tenantId,
          pin,
          name,
          address,
          colour,
          groupId,
          settings,
          shared
        },
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Team-Id': teamId
          }
        }
      })

      console.log('Pairing Successful:', data.pairPlayer)
      setError(null) // Clear any previous errors
    } catch (error) {
      console.error('Error pairing player:', error)
      setError('Error pairing player. Check the console for more details.')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pairing Screen</Text>

      {pin ? <Text style={styles.pinText}>PIN: {pin}</Text> : <Text style={styles.pinText}>Fetching PIN...</Text>}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.buttonText}>Complete</Text>
      </TouchableOpacity>
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
  pinText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green'
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20
  },
  completeButton: {
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  }
})
