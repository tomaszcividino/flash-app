import AsyncStorage from '@react-native-async-storage/async-storage'

export const useAsyncStorage = () => {
  const removeItem = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item from AsyncStorage: ${key}`, error)
    }
  }

  const getItem = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value
    } catch (error) {
      console.error(`Error retrieving item from AsyncStorage: ${key}`, error)
      return null
    }
  }

  const setItem = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.error(`Error saving item to AsyncStorage: ${key}`, error)
    }
  }

  return { removeItem, getItem, setItem }
}
