import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import { useEffect, useState } from 'react'

const usePermissionsModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const checkFirstVisit = async () => {
    const profileVisited = await AsyncStorage.getItem('profileVisited')
    if (!profileVisited) {
      setIsModalVisible(true)
    }
  }

  useEffect(() => {
    checkFirstVisit()
  }, [])

  const handleNetworkPermission = async (response: boolean) => {
    if (response) {
      await AsyncStorage.setItem('profileVisited', 'true')
    }
    setCurrentStep(1)
  }

  const handleNotificationsPermission = async (response: boolean) => {
    if (response) {
      try {
        const permissionResponse = await Notifications.requestPermissionsAsync()
        if (permissionResponse.status !== 'granted') {
          console.log('Notifications permission denied.')
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error)
      }
    }
    setIsModalVisible(false)
  }

  return {
    isModalVisible,
    currentStep,
    setIsModalVisible,
    handleNetworkPermission,
    handleNotificationsPermission
  }
}

export default usePermissionsModal
