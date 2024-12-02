import { ProfileIcon } from '@/assets/icons/ProfileIcon'
import { CustomText } from '@/components/typography/CustomText'
import { StyleSheet, View } from 'react-native'

export const EmailSection = ({ email }: { email: string }) => (
  <View style={styles.emailSection}>
    <ProfileIcon />
    <CustomText style={{ marginLeft: 12, fontSize: 15 }}>{email || 'No Email Available'}</CustomText>
  </View>
)

const styles = StyleSheet.create({
  emailSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginLeft: 20
  }
})
