import { GreenDotIcon } from '@/assets/icons/GreenDotIcon'
import { WifiIcon } from '@/assets/icons/WifiIcon'
import { TvImage } from '@/assets/images/tvImage'
import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { NoScreensFound } from '@/components/NoScreensFound'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import { typography } from '@/constants/typography'
import { useBluetooth } from '@/hooks/useBluetooth'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
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
    pin
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
    if (connectedDevice) {
      await sendWiFiCredentials(connectedDevice, password)
    }
    setModalVisible(false)
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

  const fetchPinAndPairDevice = async () => {
    console.log('fetchPinAndPairDevice called')

    try {
      // Step 1: Ensure the device is connected
      if (!connectedDevice) {
        throw new Error('No connected device found.')
      }

      console.log('Fetching PIN...')
      await getPin(connectedDevice) // Fetch the PIN

      // Step 2: Ensure the PIN is available
      if (!pin) {
        throw new Error('PIN is missing after fetch')
      }

      console.log('PIN fetched:', pin)

      // Step 3: Proceed with pairing once the PIN is available
      console.log('Pairing device...')
      await pairDevice()
    } catch (error) {
      console.error('Error in fetchPinAndPairDevice:', error)
    } finally {
      console.log('fetchPinAndPairDevice execution complete')
    }
  }

  const handleAccept = async () => {
    await getPin(connectedDevice)

    setCurrentScreen('connecting')
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
                  onPress: pairDevice, // Wrap it in an anonymous function
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

        {/* <View style={styles.actions}>
          <Button title="Refresh" onPress={startScan} disabled={scanning} />
          <Button
            title="Fetch PIN"
            onPress={() => connectedDevice && getPin(connectedDevice)}
            disabled={!connectedDevice}
          />
          <Button title="Pair Device" onPress={pairDevice} disabled={!connectedDevice} />
        </View> */}

        {!currentScreen && (
          <>
            {isRefreshing ? (
              <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color={palette.colors.purple.light} />
              </View>
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

        {currentScreen === 'initial' && (
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
        )}

        {currentScreen === 'connecting' && (
          <View style={{ marginTop: 32 }}>
            <CustomText>My network</CustomText>
            {ssidList.length > 0 && (
              <FlatList data={ssidList} keyExtractor={(item) => item} renderItem={renderSSID} style={styles.ssidList} />
            )}
          </View>
        )}

        {currentScreen === 'pairing' && (
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
              <CustomText
                style={{
                  padding: 12,
                  borderWidth: 2,
                  borderColor: '#EEF0F2',
                  borderRadius: 12,
                  color: '#495057',
                  fontSize: 15,
                  marginBottom: 12
                }}
              >
                {connectedDevice?.name} {connectedDevice?.id}
              </CustomText>

              <CustomText style={{ fontSize: 15, lineHeight: 20, marginBottom: 12 }}>Change orientation</CustomText>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    borderWidth: 2,
                    width: '22%',
                    paddingVertical: 16,
                    justifyContent: 'center',
                    borderRadius: 12,
                    borderColor: '#EEF0F2'
                  }}
                >
                  <WifiIcon color={'grey'} />
                  <CustomText
                    style={{
                      color: '#495057',
                      fontSize: 15,
                      textAlign: 'center'
                    }}
                  >
                    0
                  </CustomText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    borderWidth: 2,
                    width: '22%',
                    paddingVertical: 16,
                    justifyContent: 'center',
                    borderRadius: 12,
                    borderColor: '#EEF0F2'
                  }}
                >
                  <WifiIcon color={'grey'} />
                  <CustomText
                    style={{
                      color: '#495057',
                      fontSize: 15,
                      textAlign: 'center'
                    }}
                  >
                    90
                  </CustomText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    borderWidth: 2,
                    width: '22%',
                    paddingVertical: 16,
                    justifyContent: 'center',
                    borderRadius: 12,
                    borderColor: '#EEF0F2'
                  }}
                >
                  <WifiIcon color={'grey'} />
                  <CustomText
                    style={{
                      color: '#495057',
                      fontSize: 15,
                      textAlign: 'center'
                    }}
                  >
                    180
                  </CustomText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    borderWidth: 2,
                    width: '22%',
                    paddingVertical: 16,
                    justifyContent: 'center',
                    borderRadius: 12,
                    borderColor: '#EEF0F2'
                  }}
                >
                  <WifiIcon color={'grey'} />
                  <CustomText
                    style={{
                      color: '#495057',
                      fontSize: 15,
                      textAlign: 'center'
                    }}
                  >
                    270
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
        )}

        <Modal visible={modalVisible} transparent={true}>
          <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <CustomText style={{ fontSize: 30, textAlign: 'center', marginBottom: 24 }}>
                Enter password for <CustomText>{connectedDevice?.id}</CustomText>
              </CustomText>
              <CustomText style={{ fontSize: 15, lineHeight: 20 }}>Wifi password</CustomText>
              <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} />

              <PrimaryButton text="Confirm" onPress={handlePasswordSubmit} filled={true} />
              <PrimaryButton text="Go back" onPress={() => setModalVisible(false)} filled={false} />
              {/* <Button title="Submit" onPress={handlePasswordSubmit} /> */}
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
