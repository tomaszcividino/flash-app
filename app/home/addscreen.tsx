import { CustomText } from '@/components/typography/CustomText'
import { useBluetooth } from '@/hooks/useBluetooth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Device } from 'react-native-ble-plx'

export default function ConnectToWifi() {
  const [password, setPassword] = useState('YhgqgkqGKsdR5PR83G')
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)

  const { sendWiFiCredentials } = useBluetooth()

  useEffect(() => {
    const getConnectedDevice = async () => {
      try {
        // Retrieve the connected device from AsyncStorage
        const deviceData = await AsyncStorage.getItem('connectedDevice')
        if (deviceData) {
          const device = JSON.parse(deviceData)
          setConnectedDevice(device) // Set the device in the state
        } else {
          console.warn('No connected device found in AsyncStorage')
        }
      } catch (error) {
        console.error('Error retrieving device from AsyncStorage:', error)
      }
    }

    getConnectedDevice()
  }, [])

  const handlePasswordSubmit = async () => {
    if (connectedDevice) {
      await sendWiFiCredentials(connectedDevice, password)
    }
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <CustomText style={{ fontSize: 30 }}>Enter Wi-Fi Credentials</CustomText>

      <Pressable style={styles.ssidItem} onPress={() => setModalVisible(true)}>
        <CustomText>{selectedNetwork || 'Select Wi-Fi'}</CustomText>
      </Pressable>

      <Modal visible={modalVisible} transparent={true}>
        <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <CustomText style={{ fontSize: 18 }}>Enter Wi-Fi password</CustomText>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            <Button title={loading ? 'Submitting...' : 'Submit'} onPress={handlePasswordSubmit} disabled={loading} />
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ssidItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginTop: 10
  }
})
