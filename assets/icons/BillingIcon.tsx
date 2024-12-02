import Svg, { Path, SvgProps } from 'react-native-svg'

export const BillingIcon = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <Path
      fill="#7B838A"
      d="M14.665 6.667v6.666A.667.667 0 0 1 14 14h-12a.666.666 0 0 1-.667-.667V6.667h13.333Zm0-1.334H1.332V2.667A.667.667 0 0 1 1.999 2h12a.667.667 0 0 1 .666.667v2.666ZM10 10.667V12h2.666v-1.333H10Z"
    />
  </Svg>
)
