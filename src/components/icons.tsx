import React from 'react';
import {COLORS} from '../theme';

type IconProps = {size?: number; color?: string};

export const WalletIcon: React.FC<IconProps> = ({
  size = 48,
  color = COLORS.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect
      x="6"
      y="12"
      width="36"
      height="26"
      rx="6"
      stroke={color}
      strokeWidth="3.5"
    />
    <path
      d="M10 12.5 30 7a4 4 0 0 1 5 3.9v1.6"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <rect x="30" y="21" width="12" height="9" rx="3.5" fill={color} />
  </svg>
);

export const GlobeIcon: React.FC<IconProps> = ({
  size = 48,
  color = COLORS.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="17" stroke={color} strokeWidth="3.5" />
    <ellipse cx="24" cy="24" rx="8" ry="17" stroke={color} strokeWidth="3" />
    <path d="M8 18h32M8 30h32" stroke={color} strokeWidth="3" />
  </svg>
);

export const BankIcon: React.FC<IconProps> = ({
  size = 48,
  color = COLORS.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M6 18 24 8l18 10"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 22v14M19.5 22v14M28.5 22v14M37 22v14"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path d="M7 40h34" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({
  size = 32,
  color = COLORS.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M7 17.5 13 23.5 25 9.5"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const WarningIcon: React.FC<IconProps> = ({
  size = 30,
  color = COLORS.red,
}) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <path
      d="M15 4 28 26H2L15 4Z"
      stroke={color}
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
    <path d="M15 12v6" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="15" cy="21.6" r="1.7" fill={color} />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({
  size = 28,
  color = COLORS.slate,
}) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="5" y="12" width="18" height="12" rx="3" stroke={color} strokeWidth="2.6" />
    <path d="M9 12V9a5 5 0 0 1 10 0v3" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="14" cy="18" r="1.8" fill={color} />
  </svg>
);

export const GraduationIcon: React.FC<IconProps> = ({
  size = 48,
  color = COLORS.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M4 19 24 9l20 10-20 10L4 19Z" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
    <path d="M13 24v9c0 2.8 5 5 11 5s11-2.2 11-5v-9" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    <path d="M44 19v10" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
  </svg>
);

export const LaptopIcon: React.FC<IconProps> = ({
  size = 48,
  color = COLORS.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="9" y="10" width="30" height="20" rx="3" stroke={color} strokeWidth="3.2" />
    <path d="M5 36h38l-3-6H8l-3 6Z" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
  </svg>
);

export const InvoiceIcon: React.FC<IconProps> = ({
  size = 48,
  color = COLORS.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M12 6h18l8 8v28H12V6Z" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
    <path d="M30 6v8h8" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
    <path d="M18 24h12M18 31h12" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Avatar minimaliste façon illustration flat : tête + épaules, sourire animable.
export const Avatar: React.FC<{
  size?: number;
  skin: string;
  shirt: string;
  smile: number; // 0 = neutre, 1 = grand sourire
}> = ({size = 120, skin, shirt, smile}) => {
  const arc = 6 * smile;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill={COLORS.blueSoft} />
      <clipPath id={`avatar-clip-${shirt.replace('#', '')}`}>
        <circle cx="50" cy="50" r="50" />
      </clipPath>
      <g clipPath={`url(#avatar-clip-${shirt.replace('#', '')})`}>
        <path
          d="M18 100c0-18 14-30 32-30s32 12 32 30v6H18v-6Z"
          fill={shirt}
        />
        <circle cx="50" cy="42" r="19" fill={skin} />
        <circle cx="43" cy="40" r="2.4" fill={COLORS.navy} />
        <circle cx="57" cy="40" r="2.4" fill={COLORS.navy} />
        <path
          d={`M43 50 Q50 ${50 + arc} 57 50`}
          stroke={COLORS.navy}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};
