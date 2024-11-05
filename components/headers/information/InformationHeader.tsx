import { StyleSheet, View } from 'react-native'
import { LeftIcon } from './LeftIcon'
import { RightIcon } from './RightIcon'

interface InformationHeaderProps {
  leftIconType?: 'navigation' | 'drawer' | null
  rightIconType?: 'info' | 'options' | 'refresh' | 'calendar' | 'addButton' | null
}

export const InformationHeader = ({ leftIconType = null, rightIconType = null }: InformationHeaderProps) => (
  <View style={[styles.headerContainer, leftIconType ? styles.withLeftIcon : styles.noLeftIcon]}>
    {leftIconType && <LeftIcon type={leftIconType} />}
    {rightIconType && <RightIcon type={rightIconType} />}
  </View>
)

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center'
  },
  withLeftIcon: {
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  noLeftIcon: {
    justifyContent: 'flex-end',
    paddingRight: 20
  }
})
