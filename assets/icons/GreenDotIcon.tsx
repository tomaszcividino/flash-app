import Svg, { Circle, SvgProps } from 'react-native-svg'

export const GreenDotIcon = (props: SvgProps) => (
  <Svg width={props.width || 16} height={props.height || 16} fill="none" {...props}>
    <Circle cx={8} cy={8} r={8} fill="#29CC6A" />
  </Svg>
)
