import { useId, useMemo } from 'react';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, RadialGradient, Stop } from 'react-native-svg';

import { Colors } from '../colors';

function useSvgId(prefix: string) {
  const id = useId().replace(/:/g, '');
  return `${prefix}-${id}`;
}

export type Globe3DProps = { size?: number };

export function Globe3D({ size = 210 }: Globe3DProps) {
  const clipId = useSvgId('gc');
  const gbgId = useSvgId('gbg');
  const gsunId = useSvgId('gsun');

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;

  const dots = useMemo(
    () => [
      { x: cx - 24, y: cy - 20 },
      { x: cx + 44, y: cy - 14 },
      { x: cx + 18, y: cy + 30 },
      { x: cx - 50, y: cy + 14 },
      { x: cx + 6, y: cy - 40 },
      { x: cx + 60, y: cy - 24 },
    ],
    [cx, cy],
  );

  const dotColors = [Colors.coral, Colors.sun, Colors.mint, Colors.teal, Colors.lavender, Colors.coral];
  const lats = [-50, -25, 0, 25, 50];
  const lons = [-60, -30, 0, 30, 60];

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id={gbgId} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} rx={r} ry={r}>
          <Stop offset="0%" stopColor="#BAE8FF" />
          <Stop offset="55%" stopColor="#74C0FC" />
          <Stop offset="100%" stopColor="#4ECDC4" />
        </RadialGradient>
        <RadialGradient id={gsunId} cx={`${cx - r * 0.35}`} cy={`${cy - r * 0.25}`} rx={r * 0.9} ry={r * 0.9} gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="white" stopOpacity={0.35} />
          <Stop offset="100%" stopColor="white" stopOpacity={0} />
        </RadialGradient>
        <ClipPath id={clipId}>
          <Circle cx={cx} cy={cy} r={r} />
        </ClipPath>
      </Defs>

      <Circle cx={cx} cy={cy + 6} r={r - 4} fill="#4ECDC4" opacity={0.2} />

      <Circle cx={cx} cy={cy} r={r} fill={`url(#${gbgId})`} />

      <G clipPath={`url(#${clipId})`}>
        <Ellipse cx={cx - 18} cy={cy - 10} rx={28} ry={22} fill="#6BCB77" opacity={0.85} />
        <Ellipse cx={cx + 36} cy={cy - 18} rx={20} ry={28} fill="#6BCB77" opacity={0.8} />
        <Ellipse cx={cx + 10} cy={cy + 28} rx={36} ry={18} fill="#6BCB77" opacity={0.85} />
        <Ellipse cx={cx - 44} cy={cy + 22} rx={18} ry={14} fill="#6BCB77" opacity={0.75} />
        {lats.map((lat, i) => {
          const ey = cy + r * Math.sin((lat * Math.PI) / 180);
          const ex = r * Math.cos((lat * Math.PI) / 180);
          return (
            <Ellipse key={i} cx={cx} cy={ey} rx={ex} ry={ex * 0.28} stroke="white" strokeWidth={0.7} fill="none" opacity={0.25} />
          );
        })}
        {lons.map((lon, i) => {
          const px = cx + r * Math.sin((lon * Math.PI) / 180);
          const ex = r * Math.abs(Math.cos((lon * Math.PI) / 180)) * 0.28;
          return <Ellipse key={i} cx={px} cy={cy} rx={ex} ry={r} stroke="white" strokeWidth={0.7} fill="none" opacity={0.25} />;
        })}
      </G>

      <G clipPath={`url(#${clipId})`} fill="none">
        <Path
          d={`M${cx - 24} ${cy - 20} Q${cx + 10} ${cy - 60} ${cx + 44} ${cy - 14}`}
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Path
          d={`M${cx + 44} ${cy - 14} Q${cx + 58} ${cy + 8} ${cx + 18} ${cy + 30}`}
          stroke="white"
          strokeWidth={1.6}
          strokeLinecap="round"
          opacity={0.7}
        />
      </G>

      <G clipPath={`url(#${clipId})`}>
        {dots.map((d, i) => (
          <G key={i}>
            <Circle cx={d.x} cy={d.y} r={8} fill={dotColors[i]} opacity={0.25} />
            <Circle cx={d.x} cy={d.y} r={4} fill={dotColors[i]} />
            <Circle cx={d.x} cy={d.y - 1} r={1.5} fill="white" opacity={0.9} />
          </G>
        ))}
      </G>

      <Circle cx={cx} cy={cy} r={r} fill={`url(#${gsunId})`} />
    </Svg>
  );
}
