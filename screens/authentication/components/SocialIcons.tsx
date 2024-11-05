import { StyleSheet, View } from 'react-native'

import { AppleIcon } from '@/assets/icons/AppleIcon'
import { FacebookIcon } from '@/assets/icons/FacebookIcon'
import { GoogleIcon } from '@/assets/icons/GoogleIcon'
import { CustomText } from '@/components/typography/CustomText'
import { typography } from '@/constants/typography'

export const SocialIcons = () => {
  const icons = [<GoogleIcon />, <AppleIcon />, <FacebookIcon />]

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <CustomText>{typography.authentication.socialSignIn}</CustomText>
      </View>
      <View style={styles.icons}>
        {icons.map((icon, index) => (
          <View key={index}>{icon}</View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 16
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  icons: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center'
  }
})
