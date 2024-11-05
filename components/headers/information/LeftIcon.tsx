import { BackIcon } from '@/assets/icons/BackIcon'
import { DrawerIcon } from '@/assets/icons/DrawerIcon'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet } from 'react-native'

interface LeftIconProps {
  type: 'navigation' | 'drawer' | null
}

export const LeftIcon = ({ type }: LeftIconProps) => {
  const router = useRouter()

  const navigateToPreviousScreen = () => {
    if (type === 'navigation') {
      router.back()
    }
  }

  return (
    <Pressable onPress={navigateToPreviousScreen} style={({ pressed }) => [pressed && styles.pressed]}>
      {type === 'navigation' ? <BackIcon /> : <DrawerIcon />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6
  }
})
