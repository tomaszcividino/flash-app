import { palette } from '@/constants/palette'
import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg'

export const ForwardIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        fill={props.fill || palette.colors.white}
        d="m16.172 11.5-5.364-5.364 1.414-1.414L20 12.5l-7.778 7.778-1.414-1.414 5.364-5.364H4v-2h12.172Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={palette.colors.white} d="M0 .5h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
