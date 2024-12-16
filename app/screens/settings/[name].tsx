import { usePlayerMutation } from '@/api/hooks/usePlayerMutation'
import { OrientationButtons } from '@/components/buttons/OrientationButtons'
import { ScreenNameForm } from '@/components/forms/ScreenNameForm'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

const Settings = () => {
  const { name: initialName, playerId } = useLocalSearchParams()
  const [screenName, setScreenName] = useState<string>(initialName || '')
  const [screenOrientation, setScreenOrientation] = useState<number>(0)

  const { deletePlayer, updatePlayer } = usePlayerMutation()

  const handleDeletePlayer = async () => {
    try {
      await deletePlayer({ playerId })
      console.log('Player deleted successfully')
    } catch (error) {
      console.error('Error deleting player:', error)
    }
  }

  const handleSaveScreenName = async () => {
    if (!screenName || screenName === initialName) {
      console.log('No changes to save.')
      return
    }

    try {
      const result = await updatePlayer({
        playerId,
        newName: screenName,
        settings: { screenOrientation: 180 }
      })

      console.log('Player name updated successfully:', result)
    } catch (error) {
      console.error('Error updating player:', error)
    }
  }

  const buttonData = [
    { text: 'Remove screen', onPress: handleDeletePlayer, filled: false, disabled: false, error: true },
    { text: 'Save Changes', onPress: handleSaveScreenName, filled: true, disabled: false }
  ]

  return (
    <AuthenticationWrapper screenName="" buttonData={buttonData}>
      <CustomText style={styles.screenTitle}>Screen Settings</CustomText>
      <View>
        <ScreenNameForm screenName={screenName} setScreenName={setScreenName} />
        <OrientationButtons selectedOrientation={screenOrientation} onSelect={setScreenOrientation} />

        <CustomText style={styles.label}>Wifi Settings</CustomText>
      </View>
    </AuthenticationWrapper>
  )
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 30,
    marginBottom: 24,
    fontWeight: 'bold'
  },
  label: {
    fontSize: 15,
    marginBottom: 8
  },
  input: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#EEF0F2',
    borderRadius: 12,
    color: '#495057',
    fontSize: 15,
    marginBottom: 16
  }
})

export default Settings
