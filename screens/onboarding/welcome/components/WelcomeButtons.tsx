import { StyleSheet, View } from 'react-native'

import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { CustomText } from '@/components/typography/CustomText'
import { typography } from '@/constants/typography'
interface ButtonConfig {
  text: string
  filled?: boolean
  onPress: () => void
  disabled?: boolean
  icon: JSX.Element
  error?: boolean
}
interface WelcomeButtonsProps {
  buttons: ButtonConfig[]
  footer?: boolean
  disabled?: boolean
  icon?: JSX.Element
  error?: boolean
}

export const WelcomeButtons = ({ buttons, icon, footer = false, error }: WelcomeButtonsProps) => {
  return (
    <View style={styles.buttonsContainer}>
      {footer && (
        <CustomText style={{ fontSize: 12, paddingHorizontal: 20, marginBottom: 32 }}>
          {typography.authentication.information}
        </CustomText>
      )}
      {buttons.map((button, index) => (
        <PrimaryButton
          key={index}
          text={button.text}
          filled={button.filled ?? true}
          onPress={button.onPress}
          disabled={button.disabled}
          icon={button.icon}
          error={button.error}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20
  }
})
