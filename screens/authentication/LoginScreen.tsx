import { Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { typography } from '@/constants/typography'
import { useLoginForm } from '@/hooks/forms/useLoginForm'
import { LoginForm } from './components/LoginForm'
import { SocialIcons } from './components/SocialIcons'

export const LoginScreen = () => {
  const { control, handleSubmit, errors, trigger, onSubmit } = useLoginForm()

  const buttonData = [{ text: 'Login', onPress: handleSubmit(onSubmit), filled: true }]

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <AuthenticationWrapper
          rightIcon="info"
          leftIcon="navigation"
          infoVisible
          screenName="Get Started"
          footer
          buttonData={buttonData}
        >
          <View style={styles.centeredContent}>
            <CustomText style={styles.welcomeText}>{typography.authentication.welcome}</CustomText>

            <LoginForm control={control} errors={errors} trigger={trigger} />
            <SocialIcons />
          </View>
        </AuthenticationWrapper>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  centeredContent: {
    alignItems: 'center'
  },
  welcomeText: {
    fontSize: 30,
    marginBottom: 32,
    lineHeight: 31.5,
    letterSpacing: -1
  }
})
