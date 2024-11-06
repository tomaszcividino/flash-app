import { useForm } from 'react-hook-form'

export interface ProfileFormData {
  firstName: string
  lastName: string
  companyName: string
  industry: string
  howDidYouFindUs: string
}

export const useProfileForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      industry: '',
      howDidYouFindUs: ''
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    console.log('Profile Data Submitted:', data)
  }

  return { control, handleSubmit, errors, trigger, onSubmit }
}
