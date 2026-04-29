import Svg, { Circle, Path } from 'react-native-svg';

import { Colors } from '../colors';

export function Palm({ size = 60, flip = false }: { size?: number; flip?: boolean }) {
  const h = size * 1.5;
  return (
    <Svg width={size} height={h} viewBox="0 0 60 90" style={{ transform: [{ scaleX: flip ? -1 : 1 }] }}>
      <Path d="M28 90 Q32 70 30 50 Q28 35 32 20" stroke="#C9956A" strokeWidth={6} strokeLinecap="round" fill="none" />
      <Path d="M32 22 Q10 10 2 20" stroke={Colors.mint} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      <Path d="M32 22 Q50 5 58 12" stroke={Colors.mint} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      <Path d="M32 22 Q20 2 28 -2" stroke={Colors.mint} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      <Path d="M32 22 Q46 15 52 24" stroke="#4CB86A" strokeWidth={3} strokeLinecap="round" fill="none" />
      <Path d="M32 22 Q18 18 12 28" stroke="#4CB86A" strokeWidth={3} strokeLinecap="round" fill="none" />
      <Circle cx="30" cy="28" r="4" fill="#C9956A" />
      <Circle cx="35" cy="25" r="3.5" fill="#C9956A" />
    </Svg>
  );
}
