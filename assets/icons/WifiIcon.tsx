import Svg, { Path, SvgProps } from 'react-native-svg'

// The WifiIcon component will now accept a `selected` prop to adjust the color
export const WifiIcon = ({ selected, ...props }: SvgProps & { selected?: boolean }) => {
  // Set the icon color based on whether it is selected
  const iconColor = selected ? '#7048E8' : '#7B838A' // Purple when selected, grey when not selected

  return (
    <Svg width={15} height={12} fill="none" {...props}>
      <Path
        fill={iconColor} // Apply dynamic color here
        d="M.457 2.665A11.95 11.95 0 0 1 7.997 0c2.857 0 5.48.998 7.54 2.665L14.28 4.22A9.958 9.958 0 0 0 7.997 2a9.96 9.96 0 0 0-6.283 2.22L.457 2.665Zm2.094 2.593a8.63 8.63 0 0 1 5.446-1.925c2.063 0 3.957.721 5.446 1.924l-1.257 1.556a6.639 6.639 0 0 0-4.189-1.48 6.644 6.644 0 0 0-4.19 1.48L2.552 5.257v.001Zm2.095 2.593a5.311 5.311 0 0 1 3.351-1.184c1.27 0 2.435.443 3.351 1.184l-1.256 1.556a3.32 3.32 0 0 0-2.095-.74 3.32 3.32 0 0 0-2.095.74L4.646 7.85Zm2.094 2.594a1.994 1.994 0 0 1 2.513 0l-1.256 1.555-1.257-1.556Z"
      />
    </Svg>
  )
}