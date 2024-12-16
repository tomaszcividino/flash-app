import { palette } from '@/constants/palette'
import { StyleSheet, TextInput } from 'react-native'
import { CustomText } from '../typography/CustomText'

interface ScreenNameInputProps {
  screenName: string
  setScreenName: React.Dispatch<React.SetStateAction<string>>
}

export const ScreenNameForm = ({ screenName, setScreenName }: ScreenNameInputProps) => (
  <>
    <CustomText style={styles.label}>Screen Name</CustomText>
    <TextInput style={styles.input} placeholder="Enter screen name" value={screenName} onChangeText={setScreenName} />
  </>
)

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: palette.colors.grey.dark
  },
  input: {
    padding: 12,
    borderWidth: 2,
    borderColor: palette.colors.grey.light,
    borderRadius: 12,
    fontSize: 15,
    marginBottom: 16,
    color: palette.colors.grey.dark
  }
})
