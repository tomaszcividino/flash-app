import { apolloClient } from '@/api/apollo/apolloClient'
import { useMutateData } from '@/api/hooks/useMutateData'
import { DELETE_PLAYER_MUTATION, UPDATE_PLAYER_MUTATION } from '@/api/mutations/playerMutations'
import { WifiIcon } from '@/assets/icons/WifiIcon'
import { CustomText } from '@/components/typography/CustomText'
import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

const Settings = () => {
  const client = apolloClient('https://api.dev-fugo.com/cms/player')

  const { name: initialName, playerId } = useLocalSearchParams()
  const [screenName, setScreenName] = useState<string>(initialName || '')
  const [screenOrientation, setScreenOrientation] = useState<number>(0)
  const [isDirty, setIsDirty] = useState(false) // Track if any changes were made

  const { mutate: deletePlayerMutation } = useMutateData({
    client,
    key: 'allScreens',
    mutation: DELETE_PLAYER_MUTATION
  })

  const { mutate: updatePlayerMutation } = useMutateData({
    client,
    key: 'updatePlayer',
    mutation: UPDATE_PLAYER_MUTATION
  })

  const handleDeletePlayer = async () => {
    try {
      await deletePlayerMutation({ playerId })
    } catch (error) {
      console.error('Error deleting player:', error)
    }
  }

  const handleSaveChanges = async () => {
    if (!screenName || screenName === initialName) {
      console.log('No changes to save.')
      return
    }

    try {
      // Call the mutation to update the player's name
      await updatePlayerMutation({
        playerId,
        newName: screenName,
        settings: {
          screenOrientation: 180
        }
      })
      console.log('Player name updated successfully')
    } catch (error) {
      console.error('Error updating player:', error)
    }
  }

  // Set dirty flag if any state changes occur

  const buttonData = [
    { text: 'Remove screen', onPress: handleDeletePlayer, filled: false, disabled: false },
    { text: 'Save Changes', onPress: handleSaveChanges, filled: true, disabled: false }
  ]

  const orientations = [0, 90, 180, 270]

  return (
    <AuthenticationWrapper screenName="Screen Settings" buttonData={buttonData}>
      <View style={styles.container}>
        <CustomText style={styles.title}>Screen Settings</CustomText>

        <CustomText style={styles.label}>Screen Name</CustomText>
        <TextInput
          style={styles.input}
          placeholder="Enter screen name"
          value={screenName}
          onChangeText={setScreenName}
        />

        <CustomText style={styles.label}>Change Orientation</CustomText>
        <View style={styles.orientationContainer}>
          {orientations.map((orientation) => (
            <TouchableOpacity
              key={orientation}
              style={[styles.orientationButton, screenOrientation === orientation && styles.selectedButton]}
              onPress={() => setScreenOrientation(orientation)}
            >
              <WifiIcon color={screenOrientation === orientation ? 'blue' : 'grey'} />
              <CustomText style={styles.orientationText}>{orientation}</CustomText>
            </TouchableOpacity>
          ))}
        </View>

        <CustomText style={styles.label}>Wifi Settings</CustomText>
      </View>
    </AuthenticationWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
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
  },
  orientationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  orientationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EEF0F2',
    borderRadius: 12,
    paddingVertical: 16,
    width: '22%'
  },
  selectedButton: {
    borderColor: 'blue',
    backgroundColor: '#EAF4FF'
  },
  orientationText: {
    color: '#495057',
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 4
  }
})

export default Settings
