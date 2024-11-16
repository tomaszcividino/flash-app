import Svg, { Path, SvgProps } from 'react-native-svg'

export const PersonIcon = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <Path
      fill="#7B838A"
      d="M11.335 14.667H.668v-1.334A3.334 3.334 0 0 1 4.001 10h4a3.333 3.333 0 0 1 3.334 3.333v1.334ZM6 8.667a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
    />
  </Svg>
)
