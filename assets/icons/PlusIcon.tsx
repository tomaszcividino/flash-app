import { palette } from '@/constants/palette'
import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg'

export const PlusIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#a)">
      <G clipPath="url(#b)">
        <Path fill={palette.colors.white} d="M7.332 7.333v-4h1.333v4h4v1.334h-4v4H7.332v-4h-4V7.333h4Z" />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={palette.colors.white} d="M0 0h16v16H0z" />
      </ClipPath>
      <ClipPath id="b">
        <Path fill={palette.colors.white} d="M0 0h16v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
