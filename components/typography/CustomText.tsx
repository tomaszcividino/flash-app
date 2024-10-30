import { Text as DefaultText, TextProps } from 'react-native'
interface CustomTextProps extends TextProps {
  weight?: 'bold'
}

export const CustomText = ({ style, weight = 'bold', ...props }: CustomTextProps) => {
  const getFontFamily = () => {
    switch (weight) {
      case 'bold':
        return 'ManropeBold'
      default:
        return 'PoppinsSemi'
    }
  }

  return <DefaultText {...props} style={[{ fontFamily: getFontFamily() }, style]} />
}
