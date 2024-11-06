import { useProfileForm } from '@/hooks/forms/useProfileForm'
import { ProfileForm } from '@/screens/main/profile/components/ProfileForm'
import React from 'react'
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

export default function Profile() {
  const { control, handleSubmit, errors, trigger, onSubmit } = useProfileForm()

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ProfileForm control={control} errors={errors} trigger={trigger} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
