import { palette } from '@/constants/palette'
import Svg, { Path, SvgProps } from 'react-native-svg'

export const DrawerIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path fill={palette.colors.purple.medium} d="M3 4h18v2H3V4Zm0 7h18v2H3v-2Zm0 7h18v2H3v-2Z" />
  </Svg>
)
