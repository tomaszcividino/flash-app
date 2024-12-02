import { SafeAreaView, StyleSheet, View } from 'react-native'

import { palette } from '@/constants/palette'
import { WelcomeButtons } from '@/screens/onboarding/welcome/components/WelcomeButtons'
import { ScreenNameHeader } from '../headers/screen/ScreenNameHeader'
interface ButtonData {
  text: string
  filled: boolean
  onPress: () => void
  disabled: boolean
  icon?: JSX.Element
}
interface AuthenticationWrapperProps {
  infoVisible?: boolean
  screenName: string
  buttonData?: ButtonData[]
  children: React.ReactNode
  footer?: boolean
  disabled?: boolean
}

export const AuthenticationWrapper = ({
  screenName = '',
  buttonData = [],
  children,
  footer = false
}: AuthenticationWrapperProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenNameHeader text={screenName} />
      <View style={styles.contentContainer}>{children}</View>
      <View style={styles.buttonContainer}>
        <WelcomeButtons buttons={buttonData} footer={footer} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: palette.colors.white
  },
  contentContainer: {
    flex: 1
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20
  }
})
