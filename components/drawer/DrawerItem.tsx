import { CustomText } from '@/components/typography/CustomText'
import { palette } from '@/constants/palette'
import { DrawerItem } from '@react-navigation/drawer'
import { StyleSheet, View } from 'react-native'

interface DrawerItemProps {
  label: string
  icon: React.ElementType<any>
  onPress: () => void
}

export const DrawerItemComponent = ({ label, icon: Icon, onPress }: DrawerItemProps) => (
  <DrawerItem
    label={() => (
      <View style={styles.drawerItemContent}>
        <Icon style={styles.drawerItemIcon} />
        <CustomText style={styles.drawerItemText}>{label}</CustomText>
      </View>
    )}
    onPress={onPress}
  />
)

const styles = StyleSheet.create({
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  drawerItemIcon: {
    marginRight: 8
  },
  drawerItemText: {
    fontSize: 15,
    color: palette.colors.grey.dark
  }
})
