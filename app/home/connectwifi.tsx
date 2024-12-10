import { CustomText } from '@/components/typography/CustomText'
import React, { useState } from 'react'
import { Button, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native'
import base64 from 'react-native-base64'
import { Device } from 'react-native-ble-plx'

export default function ConnectToWifi() {
  const [password, setPassword] = useState('YhgqgkqGKsdR5PR83G')
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)

  console.log(connectedDevice, 'connected from addScreen')

  const sendWiFiCredentials = async () => {
    if (!connectedDevice) {
      console.warn('No connected device found')
      return
    }

    const serviceUUID = 'aabbccdd-1234-5678-9101-112233445566'
    const ssidCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445568'
    const notificationCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445569'

    const ssid = selectedNetwork || 'CGA2121_QV5rJnx'
    const credentials = JSON.stringify({ ssid, password })
    const encodedCredentials = base64.encode(credentials)

    try {
      // Enable notifications for receiving response from the device
      await connectedDevice.monitorCharacteristicForService(
        serviceUUID,
        notificationCharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.warn('Error enabling notifications:', error)
          } else {
            const msg = base64.decode(characteristic?.value || '')
            console.log('Notification received:', msg)
            if (msg.includes('Connected to')) {
              console.log('Device connected with message:', msg)
            }
          }
        }
      )

      // Write the Wi-Fi credentials to the device
      await connectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        ssidCharacteristicUUID,
        encodedCredentials
      )
      console.log('Wi-Fi credentials submitted successfully.')
    } catch (error) {
      console.error('Error sending Wi-Fi credentials:', error)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    await sendWiFiCredentials()
    setLoading(false)
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
            <Button title={loading ? 'Submitting...' : 'Submit'} onPress={handleSubmit} disabled={loading} />
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
