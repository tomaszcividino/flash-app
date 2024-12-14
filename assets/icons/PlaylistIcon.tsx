import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg'
export const PlaylistIcon = (props: SvgProps) => (
  <Svg width={16} height={16} viewBox="0 0 12 12" fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        fill="#495057"
        d="M1 9h5v1H1V9Zm0-3.5h7v1H1v-1ZM1 2h10v1H1V2Zm8.5 5.585V4.5H12v1h-1.5V9a1.5 1.5 0 1 1-1-1.415Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h12v12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
