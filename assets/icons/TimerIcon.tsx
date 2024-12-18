import Svg, { Path, SvgProps } from 'react-native-svg'
export const TimerIcon = (props: SvgProps) => (
  <Svg width={12} height={12} viewBox="0 0 10 10" fill="none" {...props}>
    <Path
      fill="#495057"
      d="M5 10A5 5 0 1 1 5 0a5 5 0 0 1 0 10Zm0-1a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm.5-4h2v1h-3V2.5h1V5Z"
    />
  </Svg>
)
