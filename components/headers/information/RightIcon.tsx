import { InfoIcon } from '@/assets/icons/InfoIcon'
import { StyleSheet, View } from 'react-native'

interface RightIconProps {
  type: 'info' | 'options' | 'refresh' | 'calendar' | 'addButton' | null
}

export const RightIcon = ({ type }: RightIconProps) => {
  if (!type) return null
  let icon

  switch (type) {
    case 'info':
      icon = <InfoIcon />
      break
    default:
      icon = null
  }

  return <View style={styles.iconContainer}>{icon}</View>
}

const styles = StyleSheet.create({
  iconContainer: {
    height: '100%',
    justifyContent: 'center'
  }
})
