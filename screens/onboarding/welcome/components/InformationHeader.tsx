import { StyleSheet, View } from 'react-native'

import { InfoIcon } from '@/assets/icons/InfoIcon'
import { CustomText } from '@/components/typography/CustomText'
import { typography } from '@/constants/typography'

import palette from '@/constants/palette'

export const InformationHeader = () => (
  <View style={styles.headerContainer}>
    <View style={styles.iconContainer}>
      <InfoIcon />
    </View>
    <View style={styles.textContainer}>
      <CustomText weight="bold" style={styles.title}>
        {typography.onboarding.fugoFlash}
      </CustomText>
    </View>
  </View>
)

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  iconContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 56
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 15,
    marginBottom: 12,
    color: palette.colors.purple.medium
  }
})
