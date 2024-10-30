import { PrimaryButton } from '@/components/buttons/PrimaryButton'
import { typography } from '@/constants/typography'
import { StyleSheet, View } from 'react-native'

export const WelcomeButtons = () => (
  <View style={styles.buttonsContainer}>
    <PrimaryButton text={typography.authentication.createAccount} filled={true} />
    <PrimaryButton text={typography.authentication.signIn} filled={false} />
  </View>
)

const styles = StyleSheet.create({
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20
  }
})
