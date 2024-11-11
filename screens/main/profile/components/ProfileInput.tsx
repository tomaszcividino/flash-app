import { Controller } from 'react-hook-form'
import { StyleSheet, Text, TextInput } from 'react-native'

import { palette } from '@/constants/palette'

interface FormInputProps {
  control: any
  name: string
  label: string
  placeholder: string
  rules: any
  errors: any
  trigger: (name?: string | string[]) => Promise<boolean>
}

export const FormInput = ({ control, name, label, placeholder, rules, errors, trigger }: FormInputProps) => {
  const borderColor = errors[name] ? palette.colors.red : palette.colors.grey.medium

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, { borderColor }]}
            placeholder={placeholder}
            placeholderTextColor={palette.colors.grey.medium}
            onBlur={() => {
              onBlur()
              trigger(name)
            }}
            onChangeText={(text) => {
              onChange(text)
              trigger(name)
            }}
            value={value}
          />
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
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
