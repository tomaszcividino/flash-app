import { CustomText } from '@/components/typography/CustomText'
import { palette } from '@/constants/palette'
import { StyleSheet, View } from 'react-native'

export const ScreenNameHeader = ({ text }: { text: string }) => {
  return (
    <View style={styles.textContainer}>
      <CustomText style={styles.text}>{text}</CustomText>
    </View>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  text: {
    textAlign: 'center',
    color: palette.colors.purple.medium,
    fontSize: 15
  }
})
