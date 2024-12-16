import { WifiIcon } from '@/assets/icons/WifiIcon'
import { palette } from '@/constants/palette'
import { Pressable, StyleSheet, View } from 'react-native'
import { CustomText } from '../typography/CustomText'

const orientations = [0, 90, 180, 270]

export const OrientationButtons = ({
  selectedOrientation,
  onSelect,
  customIcons
}: {
  selectedOrientation: number
  onSelect: (orientation: number) => void
  customIcons?: React.ReactNode[]
}) => (
  <View style={styles.container}>
    <CustomText style={styles.label}>Change Orientation</CustomText>
    <View style={styles.orientationContainer}>
      {orientations.map((orientation, index) => (
        <Pressable
          key={orientation}
          style={[styles.orientationButton, selectedOrientation === orientation && styles.selectedButton]}
          onPress={() => onSelect(orientation)}
          accessibilityLabel={`Select orientation ${orientation}`}
          accessibilityHint={`Change orientation to ${orientation} degrees`}
        >
          {customIcons ? (
            customIcons[index]
          ) : (
            <WifiIcon
              color={selectedOrientation === orientation ? palette.colors.purple.medium : palette.colors.grey.dark}
            />
          )}
          <CustomText style={[styles.orientationText, selectedOrientation === orientation && styles.selectedText]}>
            {orientation}°
          </CustomText>
        </Pressable>
      ))}
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: palette.colors.grey.dark
  },
  orientationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  orientationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22%',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    borderColor: palette.colors.grey.light
  },
  selectedButton: {
    backgroundColor: palette.colors.white,
    borderColor: palette.colors.purple.medium
  },
  orientationText: {
    textAlign: 'center',
    fontSize: 15,
    marginLeft: 4,
    color: palette.colors.grey.dark
  },
  selectedText: {
    color: palette.colors.purple.medium
  }
})
