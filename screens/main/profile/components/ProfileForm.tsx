import { Control, Controller, FieldErrors, useFormState } from 'react-hook-form'
import { Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native'

import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import { ProfileFormData } from '@/hooks/forms/useProfileForm'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

interface ProfileFormProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  trigger: (name?: keyof ProfileFormData | (keyof ProfileFormData)[]) => Promise<boolean>
}

export const ProfileForm = ({ control, errors, trigger }: ProfileFormProps) => {
  const { isValid } = useFormState({
    control
  })

  const router = useRouter()

  const firstNameBorderColor = errors.firstName ? palette.colors.red : palette.colors.grey.medium
  const lastNameBorderColor = errors.lastName ? palette.colors.red : palette.colors.grey.medium
  const companyNameBorderColor = errors.companyName ? palette.colors.red : palette.colors.grey.medium
  const industryBorderColor = errors.industry ? palette.colors.red : palette.colors.grey.medium
  const howDidYouFindUsBorderColor = errors.howDidYouFindUs ? palette.colors.red : palette.colors.grey.medium

  const handleProfileVisit = async () => {
    try {
      await AsyncStorage.setItem('profileVisited', 'true')

      router.replace('/home')
    } catch (error) {
      console.error('Error marking profile as visited:', error)
    }
  }

  const buttonData = [{ text: 'Continue', onPress: handleProfileVisit, filled: true, disabled: !isValid }]

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <AuthenticationWrapper screenName="New Account" rightIcon="info" buttonData={buttonData}>
          <CustomText style={{ textAlign: 'center', fontSize: 30, marginBottom: 32 }}>Create your profile</CustomText>

          <CustomText style={styles.label}>First Name</CustomText>
          <Controller
            control={control}
            name="firstName"
            rules={{ required: 'First name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { borderColor: firstNameBorderColor }]}
                placeholder="Enter first name"
                placeholderTextColor={palette.colors.grey.medium}
                onBlur={() => {
                  onBlur()
                  trigger('firstName')
                }}
                onChangeText={(text) => {
                  onChange(text)
                  trigger('firstName')
                }}
                value={value}
              />
            )}
          />

          <CustomText style={styles.label}>Last Name</CustomText>
          <Controller
            control={control}
            name="lastName"
            rules={{ required: 'Last name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { borderColor: lastNameBorderColor }]}
                placeholder="Enter last name"
                placeholderTextColor={palette.colors.grey.medium}
                onBlur={() => {
                  onBlur()
                  trigger('lastName')
                }}
                onChangeText={(text) => {
                  onChange(text)
                  trigger('lastName')
                }}
                value={value}
              />
            )}
          />

          <CustomText style={styles.label}>Company Name</CustomText>
          <Controller
            control={control}
            name="companyName"
            rules={{ required: 'Company name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { borderColor: companyNameBorderColor }]}
                placeholder="Enter company name"
                placeholderTextColor={palette.colors.grey.medium}
                onBlur={() => {
                  onBlur()
                  trigger('companyName')
                }}
                onChangeText={(text) => {
                  onChange(text)
                  trigger('companyName')
                }}
                value={value}
              />
            )}
          />

          <CustomText style={styles.label}>Industry</CustomText>
          <Controller
            control={control}
            name="industry"
            rules={{ required: 'Industry is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { borderColor: industryBorderColor }]}
                placeholder="Enter industry"
                placeholderTextColor={palette.colors.grey.medium}
                onBlur={() => {
                  onBlur()
                  trigger('industry')
                }}
                onChangeText={(text) => {
                  onChange(text)
                  trigger('industry')
                }}
                value={value}
              />
            )}
          />

          <CustomText style={styles.label}>How did you find us?</CustomText>
          <Controller
            control={control}
            name="howDidYouFindUs"
            rules={{ required: 'This field is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { borderColor: howDidYouFindUsBorderColor }]}
                placeholder="Enter how you found us"
                placeholderTextColor={palette.colors.grey.medium}
                onBlur={() => {
                  onBlur()
                  trigger('howDidYouFindUs')
                }}
                onChangeText={(text) => {
                  onChange(text)
                  trigger('howDidYouFindUs')
                }}
                value={value}
              />
            )}
          />
        </AuthenticationWrapper>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: palette.colors.white
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
