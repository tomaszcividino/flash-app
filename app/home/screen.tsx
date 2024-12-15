import { GreenDotIcon } from '@/assets/icons/GreenDotIcon'
import { WifiIcon } from '@/assets/icons/WifiIcon'
import { TvImage } from '@/assets/images/tvImage'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import CustomActivityIndicator from '@/components/CustomActivityIndicator'
import { NoScreensFound } from '@/components/NoScreensFound'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import { typography } from '@/constants/typography'
import { useBluetooth } from '@/hooks/useBluetooth'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View
} from 'react-native'
import { Device } from 'react-native-ble-plx'

const { width: screenWidth } = Dimensions.get('window')

export default function Index() {
  const [password, setPassword] = useState('YhgqgkqGKsdR5PR83G')
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const [screenName, setScreenName] = useState<string | null>(null)
  const [selectedOrientation, setSelectedOrientation] = useState<number | null>(null)

  const {
    devices,
    scanning,
    isRefreshing,
    screenText,
    startScan,
    ssidList,
    connectedDevice,
    connectToDevice,
    sendWiFiCredentials,
    pairDevice,
    getPin,
    currentScreen,
    setCurrentScreen,
    loading,
    setLoading
  } = useBluetooth()

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestAndroidPermissions().then(startScan)
    } else {
      startScan()
    }
  }, [])

  const requestAndroidPermissions = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ]

      const granted = await PermissionsAndroid.requestMultiple(permissions)
      if (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted' &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === 'granted' &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === 'granted'
      ) {
        console.log('All permissions granted')
      } else {
        console.log('Permissions not granted')
      }
    } catch (err) {
      console.warn('Permissions error:', err)
    }
  }

  const handlePasswordSubmit = async () => {
    setLoading(true) // Show spinner
    setModalVisible(false) // Hide modal during loading
    if (connectedDevice) {
      await sendWiFiCredentials(connectedDevice, password) // Simulate sending credentials
    }
    setLoading(false) // Hide spinner after operation is complete
    // Optionally, show a success message or handle further actions
  }

  const renderDevice = ({ item }: { item: Device }) => (
    <Pressable
      onPress={() => connectToDevice(item)}
      style={({ pressed }) => [styles.deviceItem, pressed && { opacity: 0.7 }]}
    >
      <View>
        <View style={{ flexDirection: 'row', width: 250, alignItems: 'center', marginBottom: 8 }}>
          <GreenDotIcon />
          <CustomText style={{ fontSize: 20, textAlign: 'center', marginLeft: 4 }}>
            {item.name} {item.id}
          </CustomText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <WifiIcon color={palette.colors.blue.medium} />
          <CustomText style={{ fontSize: 12, color: '#007AFF', marginLeft: 4 }}>Ready to pair</CustomText>
        </View>
      </View>
    </Pressable>
  )

  const renderSSID = ({ item }: { item: string }) => (
    <Pressable
      onPress={() => {
        setSelectedNetwork(item)
        setModalVisible(true)
      }}
      style={({ pressed }) => [styles.ssidItem, pressed && { opacity: 0.7 }]}
    >
      <WifiIcon color={palette.colors.purple.medium} />
      <CustomText style={{ color: palette.colors.purple.medium, marginLeft: 8 }}>{item}</CustomText>
    </Pressable>
  )

  const handleAccept = async () => {
    getPin(connectedDevice)
    setCurrentScreen('connecting')
  }

  const handlePairDevice = () => {
    if (!screenName || !selectedOrientation) {
      alert('Please provide a screen name and orientation.')
      return
    }

    const settings = { screenOrientation: selectedOrientation }
    pairDevice({ name: screenName, settings })
  }

  const buttonData =
    currentScreen === ''
      ? [{ text: typography.pairing.refresh, onPress: startScan, filled: false, disabled: false }]
      : currentScreen === 'initial'
        ? [
            { text: 'Accept', onPress: handleAccept, filled: true, disabled: false },
            { text: 'Decline pairing', onPress: () => console.log('Decline'), filled: false, disabled: false }
          ]
        : currentScreen === 'connecting'
          ? [
              {
                text: 'Connect to this network',
                onPress: () => setModalVisible(true),
                filled: true,
                disabled: false
              },
              {
                text: 'Configure hotspot',
                onPress: () => console.log('Hotspot'),
                filled: false,
                disabled: false
              }
            ]
          : currentScreen === 'pairing'
            ? [
                {
                  text: 'Complete!',
                  onPress: handlePairDevice, // Wrap it in an anonymous function
                  filled: true,
                  disabled: false
                }
              ]
            : []

  return (
    <>
      <AuthenticationWrapper
        screenName={currentScreen ? 'Pairing your screen' : 'Add new screen'}
        buttonData={buttonData}
        disabled={scanning}
      >
        <View style={styles.centeredContainer}>
          <CustomText style={{ fontSize: 30 }}>{screenText}</CustomText>
        </View>

        {!currentScreen && (
          <>
            {loading || scanning ? (
              <CustomActivityIndicator label={scanning ? 'Scanning...' : 'Connecting...'} />
            ) : devices.length > 0 ? (
              <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={renderDevice}
                style={styles.deviceList}
              />
            ) : (
              <NoScreensFound button={false} />
            )}
          </>
        )}

        {currentScreen === 'initial' &&
          (loading ? (
            <>
              <CustomActivityIndicator label="Sending credentials..." />
            </>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <CustomText
                style={{ fontSize: 30, lineHeight: 31, letterSpacing: -1, textAlign: 'center', marginBottom: 12 }}
              >
                {connectedDevice?.id}
              </CustomText>
              <CustomText style={{ textAlign: 'center', marginBottom: 40, color: palette.colors.purple.medium }}>
                Ready to pair
              </CustomText>

              <TvImage />
            </View>
          ))}

        {currentScreen === 'connecting' &&
          (loading ? (
            <>
              <CustomActivityIndicator label="Sending credentials..." />
            </>
          ) : (
            <View style={{ marginTop: 32 }}>
              <CustomText>My network</CustomText>
              {ssidList.length > 0 && (
                <FlatList
                  data={ssidList}
                  keyExtractor={(item) => item}
                  renderItem={renderSSID}
                  style={styles.ssidList}
                />
              )}
            </View>
          ))}

        {currentScreen === 'pairing' &&
          (loading ? (
            <>
              <CustomActivityIndicator label="Pairing..." />
            </>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View style={{ height: 175, width: '100%', backgroundColor: '#7B838A', borderRadius: 8 }} />

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 24 }}>
                <GreenDotIcon />
                <CustomText style={{ fontSize: 20, marginLeft: 10 }}>
                  {connectedDevice?.name} {connectedDevice?.id}
                </CustomText>
              </View>

              <View>
                <CustomText style={{ fontSize: 15, lineHeight: 20, marginBottom: 12 }}>Screen Name</CustomText>
                <TextInput
                  style={{
                    padding: 12,
                    borderWidth: 2,
                    borderColor: '#EEF0F2',
                    borderRadius: 12,
                    color: '#495057',
                    fontSize: 15,
                    marginBottom: 12
                  }}
                  placeholder="Enter screen name"
                  value={screenName || connectedDevice?.name || ''}
                  onChangeText={setScreenName}
                />

                <CustomText style={{ fontSize: 15, lineHeight: 20, marginBottom: 12 }}>Change orientation</CustomText>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  {[0, 90, 180, 270].map((angle) => (
                    <Pressable
                      key={angle}
                      onPress={() => setSelectedOrientation(angle)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        borderWidth: 2,
                        width: '22%',
                        paddingVertical: 16,
                        justifyContent: 'center',
                        borderRadius: 12,
                        borderColor: selectedOrientation === angle ? '#007AFF' : '#EEF0F2', // Highlight selected orientation
                        backgroundColor: selectedOrientation === angle ? '#E6F0FF' : 'transparent' // Add background highlight
                      }}
                    >
                      <WifiIcon color={selectedOrientation === angle ? '#007AFF' : 'grey'} />
                      <CustomText
                        style={{
                          color: selectedOrientation === angle ? '#007AFF' : '#495057',
                          fontSize: 15,
                          textAlign: 'center'
                        }}
                      >
                        {angle}
                      </CustomText>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          ))}

        <Modal visible={modalVisible && !loading} transparent={true}>
          <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              {loading ? (
                // Show the spinner only when loading
                <CustomActivityIndicator label="Sending credentials..." />
              ) : (
                // Show the modal content when not loading
                <>
                  <CustomText style={{ fontSize: 30, textAlign: 'center', marginBottom: 24 }}>
                    Enter password for <CustomText>{connectedDevice?.id}</CustomText>
                  </CustomText>
                  <CustomText style={{ fontSize: 15, lineHeight: 20 }}>Wifi password</CustomText>
                  <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} />

                  <PrimaryButton text="Confirm" onPress={handlePasswordSubmit} filled={true} />
                  <PrimaryButton text="Go back" onPress={() => setModalVisible(false)} filled={false} />
                </>
              )}
            </View>
          </Pressable>
        </Modal>
      </AuthenticationWrapper>
    </>
  )
}

const styles = StyleSheet.create({
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  deviceList: {
    marginTop: 20
  },
  ssidList: {
    marginTop: 12
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  ssidItem: {
    padding: 16,
    borderWidth: 2,
    borderColor: palette.colors.purple.medium,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  deviceItem: {
    padding: 10,
    backgroundColor: palette.colors.purple.light,
    height: 74,
    borderRadius: 8
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: screenWidth - 40,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20
  },
  input: {
    borderColor: palette.colors.purple.light,
    borderRadius: 12,
    borderWidth: 2,
    padding: 20,
    marginTop: 10,
    marginBottom: 24
  }
})
