import { CustomText } from '@/components/typography/CustomText'
import { palette } from '@/constants/palette'
import { StyleSheet, View } from 'react-native'

export const DrawerHeader = () => (
  <View style={styles.drawerHeader}>
    <CustomText style={{ color: palette.colors.white, fontSize: 20, lineHeight: 26 }}>LOGO HERE</CustomText>
  </View>
)

const styles = StyleSheet.create({
  drawerHeader: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    height: 121,
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: palette.colors.blue.dark
  }
})
