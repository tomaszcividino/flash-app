import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from 'react-native-svg'

export const ProfileIcon = (props: SvgProps) => (
  <Svg width={76} height={76} fill="none" {...props}>
    <Rect width={76} height={76} fill="#EEF0F2" rx={38} />
    <G clipPath="url(#a)">
      <Path
        fill="#ACB5BD"
        d="M49.335 52.167H26.668v-2.834a7.083 7.083 0 0 1 7.083-7.083h8.5a7.084 7.084 0 0 1 7.084 7.083v2.834ZM38 39.417a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M21 21h34v34H21z" />
      </ClipPath>
    </Defs>
  </Svg>
)
