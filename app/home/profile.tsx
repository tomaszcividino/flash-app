import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaView, StyleSheet } from 'react-native'

import { ProfileFormData } from '@/hooks/forms/useProfileForm'
import { ProfileForm } from '@/screens/main/profile/components/ProfileForm'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const {
    control,
    trigger,
    formState: { errors },
    getValues
  } = useForm<ProfileFormData>()

  useEffect(() => {
    const checkProfileStatus = async () => {
      const profileVisited = await AsyncStorage.getItem('profileVisited')
      if (profileVisited === 'true') {
        router.replace('/home')
      } else {
        setIsLoading(false)
      }
    }
    checkProfileStatus()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ProfileForm control={control} errors={errors} trigger={trigger} getValues={getValues} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ProfileScreen
