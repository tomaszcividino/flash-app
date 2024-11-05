import { StyleSheet, View } from 'react-native'

import { CustomText } from '@/components/typography/CustomText'
import { palette } from '@/constants/palette'
import { getWindowWidth } from '@/utils/getWindowWidth'
interface WelcomeSliderItemProps {
  titleUpper: string
  titleLower: string
}

export const WelcomeSliderItem = ({ titleUpper, titleLower }: WelcomeSliderItemProps) => (
  <View style={styles.slide}>
    <View style={styles.titleContainer}>
      <CustomText weight="bold" style={styles.slideTitle}>
        {titleUpper}
      </CustomText>
      <CustomText weight="bold" style={styles.slideTitle}>
        {titleLower}
      </CustomText>
    </View>
    <View style={styles.box} />
  </View>
)

const styles = StyleSheet.create({
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    width: getWindowWidth()
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  slideTitle: {
    fontSize: 30,
    letterSpacing: -1,
    color: palette.colors.black
  },
  box: {
    width: 312,
    height: 395,
    borderRadius: 10,
    marginTop: 24,
    backgroundColor: palette.colors.grey.dark
  }
})
