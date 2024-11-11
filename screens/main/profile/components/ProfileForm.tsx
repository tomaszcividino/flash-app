import { useFormState } from 'react-hook-form'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

import { useUpdateTenant } from '@/api/useUpdateTenant'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import { typography } from '@/constants/typography'
import { ProfileFormData } from '@/hooks/forms/useProfileForm'
import { handleDismissKeyboard } from '@/utils/handleDismissKeyboard'
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

  const handleProfileVisit = async () => {
    const data = getValues()
    const email = 'test@test.com'

    await updateTenantData(email, data)
  }

  const buttonData = [{ text: 'Continue', onPress: handleProfileVisit, filled: true, disabled: !isValid }]

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View style={styles.container}>
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
  text: {
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 32
  }
})
