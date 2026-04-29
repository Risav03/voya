import Svg, { Ellipse, Line, Path, Rect } from 'react-native-svg';

import { Colors } from '../colors';

export function Balloon({ size = 70 }: { size?: number }) {
  const h = size * 1.3;
  return (
    <Svg width={size} height={h} viewBox="0 0 70 90" fill="none">
      <Ellipse cx="35" cy="35" rx="30" ry="32" fill={Colors.coral} />
      <Path d="M5 35 Q35 10 65 35" fill={Colors.sun} opacity={0.9} />
      <Path d="M5 35 Q35 60 65 35" fill={Colors.teal} opacity={0.8} />
      <Ellipse cx="35" cy="35" rx="30" ry="32" fill="none" stroke="white" strokeWidth={1.5} opacity={0.3} />
      {[-15, 0, 15].map((x) => (
        <Line key={x} x1={35 + x} y1={5} x2={35 + x} y2={65} stroke="white" strokeWidth={1} opacity={0.2} />
      ))}
      <Line x1="28" y1="67" x2="26" y2="82" stroke="#C9956A" strokeWidth={1.5} />
      <Line x1="42" y1="67" x2="44" y2="82" stroke="#C9956A" strokeWidth={1.5} />
      <Rect x="22" y="82" width="26" height="8" rx="3" fill="#C9956A" />
    </Svg>
  );
}
