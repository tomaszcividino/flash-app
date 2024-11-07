import { ProfileFormData } from '@/hooks/forms/useProfileForm'
import { ProfileForm } from '@/screens/main/profile/components/ProfileForm'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaView, StyleSheet } from 'react-native'

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const {
    control,
    trigger,
    formState: { errors }
  } = useForm<ProfileFormData>()

  const checkProfileStatus = async () => {
    const profileVisited = await AsyncStorage.getItem('profileVisited')
    if (profileVisited === 'true') {
      router.replace('/home')
    } else {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    checkProfileStatus()
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileForm control={control} errors={errors} trigger={trigger} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default ProfileScreen
