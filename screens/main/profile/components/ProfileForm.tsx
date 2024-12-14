import { useFormState } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native'

import { useUpdateTenant } from '@/api/useUpdateTenant'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import { typography } from '@/constants/typography'
import { ProfileFormData } from '@/hooks/forms/useProfileForm'
import { handleDismissKeyboard } from '@/utils/handleDismissKeyboard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useExpoRouter } from 'expo-router/build/global-state/router-store'
import { FormInput } from './ProfileInput'

interface ProfileFormProps {
  control: any
  errors: any
  trigger: (name?: string | string[]) => Promise<boolean>
  getValues: () => ProfileFormData
}

export const ProfileForm = ({ control, errors, trigger, getValues }: ProfileFormProps) => {
  const { updateTenantData, loading, error } = useUpdateTenant()
  const { isValid } = useFormState({ control })
  const router = useExpoRouter()

  const handleProfileVisit = async () => {
    const data = getValues()
    const email = 'zajas.piotr@gmail.com'

    try {
      await updateTenantData(email, data)
      await AsyncStorage.setItem('profileVisited', 'true')

      router.replace('/home')
    } catch (err) {
      console.error('Error updating profile:', err)
    }
  }

  const buttonData = [{ text: 'Continue', onPress: handleProfileVisit, filled: true, disabled: !isValid || loading }]

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <AuthenticationWrapper screenName="New Account" rightIcon="info" buttonData={buttonData}>
            <CustomText style={styles.text}>{typography.profile.createProfile}</CustomText>

            <FormInput
              control={control}
              name="firstName"
              label="First Name"
              placeholder="First name"
              rules={{ required: 'First name is required' }}
              errors={errors}
              trigger={trigger}
            />
            <FormInput
              control={control}
              name="lastName"
              label="Last Name"
              placeholder="Last name"
              rules={{ required: 'Last name is required' }}
              errors={errors}
              trigger={trigger}
            />
            <FormInput
              control={control}
              name="companyName"
              label="Company Name"
              placeholder="Company name"
              rules={{ required: 'Company name is required' }}
              errors={errors}
              trigger={trigger}
            />
            <FormInput
              control={control}
              name="industry"
              label="Industry"
              placeholder="Industry"
              rules={{ required: 'Industry is required' }}
              errors={errors}
              trigger={trigger}
            />
            <FormInput
              control={control}
              name="howDidYouFindUs"
              label="How did you find us?"
              placeholder="Enter info here"
              rules={{ required: 'This field is required' }}
              errors={errors}
              trigger={trigger}
            />
          </AuthenticationWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.colors.white
  },
  scrollViewContainer: {
    paddingBottom: 20 // Ensure there is space at the bottom for the button
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 32
  },
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  }
})
