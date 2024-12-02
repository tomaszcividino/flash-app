import Svg, { Path, SvgProps } from 'react-native-svg'

export const AboutIcon = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <Path
      fill="#7B838A"
      d="M6.999 13.667a6.666 6.666 0 1 1 0-13.333 6.666 6.666 0 0 1 0 13.333Zm-.667-7.334v4h1.333v-4H6.332Zm0-2.666V5h1.333V3.667H6.332Z"
    />
  </Svg>
)
