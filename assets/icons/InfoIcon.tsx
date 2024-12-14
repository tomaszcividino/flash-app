import { palette } from '@/constants/palette'
import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg'

export const InfoIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        fill={palette.colors.purple.medium}
        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm-1-11v6h2v-6h-2Zm0-4v2h2V7h-2Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={palette.colors.white} d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
