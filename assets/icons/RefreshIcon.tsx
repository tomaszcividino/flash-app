import { palette } from '@/constants/palette'
import Svg, { Path, SvgProps } from 'react-native-svg'

export const RefreshIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fill={palette.colors.purple.medium}
      d="M4.554 3.694a8.333 8.333 0 0 1 12.273 11.09L14.167 10h2.5A6.667 6.667 0 0 0 5.385 5.19l-.831-1.496Zm10.895 12.612A8.333 8.333 0 0 1 3.177 5.216L5.834 10h-2.5a6.666 6.666 0 0 0 11.283 4.81l.83 1.496Z"
    />
  </Svg>
)
