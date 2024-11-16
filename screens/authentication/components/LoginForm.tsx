import { Control, Controller, FieldErrors } from 'react-hook-form'
import { StyleSheet, TextInput, View } from 'react-native'

import { CustomText } from '@/components/typography/CustomText'
import { palette } from '@/constants/palette'
import { LoginFormData } from '@/hooks/forms/useLoginForm'
interface LoginFormProps {
  control: Control<LoginFormData>
  errors: FieldErrors<LoginFormData>
  trigger: (name?: keyof LoginFormData | (keyof LoginFormData)[]) => Promise<boolean>
}

export const LoginForm = ({ control, errors, trigger }: LoginFormProps) => {
  const emailBorderColor = errors.email ? palette.colors.red : palette.colors.grey.medium
  const passwordBorderColor = errors.password ? palette.colors.red : palette.colors.grey.medium

  return (
    <View style={styles.container}>
      <CustomText style={styles.label}>Email</CustomText>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, { borderColor: emailBorderColor }]}
            placeholder="Enter email"
            placeholderTextColor={palette.colors.grey.medium}
            onBlur={() => {
              onBlur()
              trigger('email')
            }}
            onChangeText={(text) => {
              onChange(text)
              trigger('email')
            }}
            value={'test@test.com'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      <CustomText style={styles.label}>Password</CustomText>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, { borderColor: passwordBorderColor }]}
            placeholder="Enter password"
            placeholderTextColor={palette.colors.grey.medium}
            onBlur={() => {
              onBlur()
              trigger('password')
            }}
            onChangeText={(text) => {
              onChange(text)
              trigger('password')
            }}
            value={'test123'}
            secureTextEntry
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20
  },
  label: {
    fontSize: 15,
    marginBottom: 8
  },
  input: {
    height: 48,
    borderWidth: 2,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 15
  }
})
