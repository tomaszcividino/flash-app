import { WifiIcon } from '@/assets/icons/WifiIcon'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import NetInfo from '@react-native-community/netinfo'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import base64 from 'react-native-base64'
import { BleManager } from 'react-native-ble-plx'
import { SafeAreaView } from 'react-native-safe-area-context'
import WifiManager from 'react-native-wifi-reborn'

const bleManager = new BleManager()

export default function ConnectToWifi() {
  const router = useRouter()
  const [currentConnection, setCurrentConnection] = useState(null)
  const [availableConnections, setAvailableConnections] = useState([])
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [password, setPassword] = useState('YhgqgkqGKsdR5PR83G')
  const [modalVisible, setModalVisible] = useState(false)
  const [connectedDevice, setConnectedDevice] = useState(null)

  const buttonData = [
    {
      text: 'Connect to this network',
      onPress: async () => {
        if (!selectedNetwork) {
          console.error('No network selected.')
          return
        }
        setModalVisible(true) // Show password modal
      },
      filled: true,
      disabled: false
    },
    {
      text: 'Configure hotspot',
      onPress: () => console.log('configure hotspot'),
      filled: false,
      disabled: false
    }
  ]

  useEffect(() => {
    const fetchCurrentConnection = async () => {
      const state = await NetInfo.fetch()
      if (state.type === 'wifi' && state.isConnected) {
        setCurrentConnection(state.details.ssid || 'Unknown SSID')
      } else {
        setCurrentConnection('No Wi-Fi connection')
      }
    }
    fetchCurrentConnection()
  }, [])

  useEffect(() => {
    const scanWifiNetworks = async () => {
      try {
        const wifiList = await WifiManager.loadWifiList()
        setAvailableConnections(wifiList)
      } catch (error) {
        console.error('Error scanning Wi-Fi networks:', error)
      }
    }
    scanWifiNetworks()
  }, [])

  const connectToDevice = async (device) => {
    try {
      console.log(`Connecting to device: ${device.id}`)
      const deviceConnection = await bleManager.connectToDevice(device.id)
      setConnectedDevice(deviceConnection)
      console.log('Successfully connected to device:', deviceConnection.id)

      await deviceConnection.discoverAllServicesAndCharacteristics()
      console.log('Discovered all services and characteristics')

      sendWiFiCredentials(deviceConnection)
      router.push('/home/addscreen') // Navigate after successful connection
    } catch (e) {
      console.error('Failed to connect to device:', e)
    }
  }

  const sendWiFiCredentials = async (deviceConnection) => {
    try {
      const serviceUUID = 'aabbccdd-1234-5678-9101-112233445566'
      const ssidCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445568'
      const notificationCharacteristicUUID = 'aabbccdd-1234-5678-9101-112233445569'

      console.log(selectedNetwork)

      const ssid = selectedNetwork?.SSID
      const credentials = JSON.stringify({ ssid, password })
      const encodedCredentials = base64.encode(credentials)

      console.log('Encoded Wi-Fi Credentials:', encodedCredentials)

      await deviceConnection.monitorCharacteristicForService(
        serviceUUID,
        notificationCharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.warn('Error enabling notifications:', error)
          } else {
            const msg = base64.decode(characteristic?.value || '')
            console.log('Notification received:', msg)
          }
        }
      )

      await deviceConnection.writeCharacteristicWithResponseForService(
        serviceUUID,
        ssidCharacteristicUUID,
        encodedCredentials
      )
      console.log('Wi-Fi credentials submitted successfully.')
    } catch (error) {
      console.error('Error sending Wi-Fi credentials:', error)
    }
  }

  const connectToSelectedNetwork = async () => {
    if (!selectedNetwork || !password) {
      console.error('Network or password missing')
      return
    }

    try {
      setModalVisible(false)
      setPassword('')

      // Mock BLE Device Selection (replace with actual BLE scan and selection logic)
      const device = { id: 'D8:3A:DD:CB:B4:FE' } // Replace with the real device ID
      await connectToDevice(device)
    } catch (error) {
      console.error('Error connecting to Wi-Fi:', error)
    }
  }

  const filteredConnections = availableConnections.filter(
    (network) => network?.SSID !== currentConnection && currentConnection !== 'No Wi-Fi connection'
  )

  return (
    <AuthenticationWrapper screenName="Pairing your screen" buttonData={buttonData}>
      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <CustomText style={styles.screenTitle}>Connect to WiFi</CustomText>

          <CustomText style={{ textAlign: 'left', marginBottom: 12 }}>My network</CustomText>

          <TouchableOpacity
            onPress={() => {
              if (currentConnection !== 'No Wi-Fi connection') {
                setSelectedNetwork({ SSID: currentConnection })
              }
            }}
            style={[
              styles.networkView,
              { borderColor: selectedNetwork?.SSID === currentConnection ? palette.colors.purple.light : '#EEF0F2' }
            ]}
          >
            <WifiIcon selected={selectedNetwork?.SSID === currentConnection} style={{ marginLeft: 5 }} />
            <CustomText
              style={{
                textAlign: 'left',
                color: selectedNetwork?.SSID === currentConnection ? palette.colors.purple.light : '#7B838A',
                marginLeft: 5
              }}
            >
              {currentConnection || 'No Wi-Fi connection'}
            </CustomText>
          </TouchableOpacity>
        </View>

        <CustomText style={{ textAlign: 'left', marginTop: 32, marginBottom: 12 }}>Other networks</CustomText>

        <View style={styles.connections}>
          <FlatList
            data={filteredConnections}
            keyExtractor={(item) => item.BSSID}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedNetwork(item)
                }}
                style={[
                  styles.networkView,
                  {
                    marginBottom: 12,
                    borderColor: selectedNetwork?.BSSID === item.BSSID ? palette.colors.purple.light : '#EEF0F2'
                  }
                ]}
              >
                <WifiIcon
                  selected={selectedNetwork?.BSSID === item.BSSID}
                  style={{ color: selectedNetwork?.BSSID === item.BSSID ? palette.colors.purple.light : '#7B838A' }}
                />
                <CustomText
                  style={{
                    textAlign: 'left',
                    color: selectedNetwork?.BSSID === item.BSSID ? palette.colors.purple.light : '#7B838A',
                    marginLeft: 5
                  }}
                >
                  {item.SSID || 'Unnamed Network'}
                </CustomText>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 250 }}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Connect to {selectedNetwork?.SSID || 'Selected Network'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Wi-Fi password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={connectToSelectedNetwork}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.abortButton]}
                  onPress={() => {
                    setModalVisible(false)
                    setPassword('')
                  }}
                >
                  <Text style={styles.buttonText}>Abort</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </AuthenticationWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.colors.white
  },
  textContainer: {},
  screenTitle: {
    fontSize: 30,
    marginBottom: 8,
    textAlign: 'center'
  },
  connections: {
    flex: 1
  },
  networkView: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#FFF',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 12
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5
  },
  confirmButton: {
    backgroundColor: palette.colors.purple.light
  },
  abortButton: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF'
  }
})
