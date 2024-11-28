import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import { useRouter } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ConnetToWifi() {
  const router = useRouter()

  const buttonData = [
    {
      text: 'Connect to this network',
      onPress: () => console.log('accept pressed'),
      filled: true,
      disabled: false
    },
    {
      text: 'Configure hotspot',
      onPress: () => console.log('decline pressed'),
      filled: false,
      disabled: false
    }
  ]

  return (
    <AuthenticationWrapper screenName="Pairing your screen" buttonData={buttonData}>
      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <CustomText style={styles.screenTitle}>Connect to WiFi</CustomText>
        </View>

        <View style={styles.connections}></View>
      </SafeAreaView>
    </AuthenticationWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.colors.white
  },
  textContainer: {
    marginTop: 16,
    marginHorizontal: 20
  },
  screenTitle: {
    fontSize: 30,
    marginBottom: 8,
    textAlign: 'center'
  },
  pairedScreenContainer: {
    flex: 1,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center' // Centers horizontally
  },
  connections: {}
})
