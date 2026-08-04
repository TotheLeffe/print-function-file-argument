import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Background, BrandTag} from '../components/Background';
import {Caption} from '../components/Caption';
import {Avatar, BankIcon, WalletIcon, WarningIcon} from '../components/icons';
import {
  CARD_SHADOW,
  CARD_SHADOW_SOFT,
  COLORS,
  easeUp,
  pop,
} from '../theme';

const PhoneMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const errorPop = pop(frame, fps, 100);
  return (
    <div
      style={{
        width: 340,
        height: 680,
        borderRadius: 48,
        background: COLORS.navy,
        padding: 12,
        boxShadow: CARD_SHADOW,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 38,
          background: COLORS.white,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            background: COLORS.green,
            padding: '30px 24px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <WalletIcon size={30} />
          <span style={{color: COLORS.white, fontWeight: 700, fontSize: 22}}>
            Mobile Money
          </span>
        </div>
        <div style={{padding: '22px 22px 0'}}>
          <div
            style={{
              background: COLORS.greenSoft,
              borderRadius: 18,
              padding: '18px 20px',
            }}
          >
            <div style={{fontSize: 15, color: COLORS.slate, fontWeight: 500}}>
              Solde disponible
            </div>
            <div
              style={{
                fontSize: 27,
                color: COLORS.navy,
                fontWeight: 800,
                marginTop: 6,
                letterSpacing: -0.5,
              }}
            >
              2 450 000 F CFA
            </div>
          </div>
          <div
            style={{
              marginTop: 20,
              background: COLORS.blue,
              borderRadius: 16,
              padding: '17px 0',
              textAlign: 'center',
              color: COLORS.white,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Payer mon fournisseur · Europe
          </div>
          <div style={{marginTop: 22}}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: COLORS.slateLight,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Transactions récentes
            </div>
            {[
              {label: 'Vente boutique', amount: '+ 180 000 F'},
              {label: 'Grossiste local', amount: '− 95 000 F'},
              {label: 'Vente boutique', amount: '+ 62 500 F'},
            ].map((tx, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '13px 4px',
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                <span
                  style={{fontSize: 17, fontWeight: 500, color: COLORS.navy}}
                >
                  {tx.label}
                </span>
                <span
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: tx.amount.startsWith('+')
                      ? COLORS.greenDark
                      : COLORS.slate,
                  }}
                >
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              background: COLORS.redSoft,
              border: `1.5px solid ${COLORS.red}`,
              borderRadius: 16,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              opacity: errorPop,
              transform: `scale(${0.85 + 0.15 * errorPop})`,
            }}
          >
            <WarningIcon size={30} />
            <span style={{color: COLORS.red, fontWeight: 700, fontSize: 16.5}}>
              Paiement international indisponible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceCard: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}> = ({title, subtitle, icon}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        background: COLORS.white,
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 22,
        padding: '18px 28px',
        boxShadow: CARD_SHADOW_SOFT,
      }}
    >
      {icon}
      <div>
        <div style={{fontWeight: 700, fontSize: 26, color: COLORS.navy}}>
          {title}
        </div>
        <div style={{fontWeight: 500, fontSize: 19, color: COLORS.slate}}>
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export const Scene1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const dashProgress = interpolate(frame, [35, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const blockedPop = pop(frame, fps, 108);
  const pathLength = 700;
  const captionSwap = frame >= 105;

  return (
    <AbsoluteFill>
      <Background />
      <BrandTag />

      {/* Téléphone du commerçant */}
      <div
        style={{
          position: 'absolute',
          left: 190,
          top: 150,
          ...easeUp(frame, fps, 6, 50),
        }}
      >
        <PhoneMockup />
      </div>

      {/* Diagramme : boutique → fournisseur, route bloquée */}
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 560,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          ...easeUp(frame, fps, 16, 40),
        }}
      >
        <Avatar size={104} skin="#8D5524" shirt={COLORS.blue} smile={0} />
        <PlaceCard
          title="Boutique Kader"
          subtitle="Abidjan · Côte d’Ivoire"
          icon={<span />}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 1370,
          top: 210,
          ...easeUp(frame, fps, 26, 40),
        }}
      >
        <PlaceCard
          title="Fournisseur"
          subtitle="Rotterdam · Europe"
          icon={
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: 16,
                background: COLORS.navy,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BankIcon size={38} />
            </div>
          }
        />
      </div>

      {/* Trajet en pointillés, interrompu */}
      <svg
        width={1920}
        height={1080}
        style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
      >
        <path
          d="M 1040 570 Q 1280 330 1500 300"
          fill="none"
          stroke={COLORS.slateLight}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray="4 22"
          strokeDashoffset={pathLength * (1 - dashProgress)}
          pathLength={pathLength}
          opacity={0.9}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 1215,
          top: 350,
          width: 84,
          height: 84,
          borderRadius: '50%',
          background: COLORS.red,
          boxShadow: '0 12px 30px rgba(229, 72, 77, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: blockedPop,
          transform: `scale(${blockedPop})`,
        }}
      >
        <svg width={38} height={38} viewBox="0 0 38 38">
          <path
            d="M10 10 28 28 M28 10 10 28"
            stroke={COLORS.white}
            strokeWidth={5.5}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Voix off */}
      {captionSwap ? (
        <Caption
          key="line2"
          text="… mais ne peuvent pas payer facilement leurs fournisseurs à l’international."
          delay={105}
        />
      ) : (
        <div
          style={{
            opacity: interpolate(frame, [96, 104], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <Caption
            key="line1"
            text="Des millions d’entreprises africaines utilisent le Mobile Money…"
            delay={12}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
