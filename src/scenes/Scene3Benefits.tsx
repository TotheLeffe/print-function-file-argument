import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background, BrandTag} from '../components/Background';
import {Avatar, CheckIcon, BankIcon, WalletIcon} from '../components/icons';
import {CARD_SHADOW, COLORS, easeUp, interpolateSmile, pop} from '../theme';

const BENEFITS = [
  'Paiement rapide',
  'Conforme',
  'Intégration API',
  'Sans changer les habitudes des utilisateurs',
];

export const Scene3Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const checkPop = pop(frame, fps, 30);
  const smile = interpolateSmile(frame, 70);

  return (
    <AbsoluteFill>
      <Background />
      <BrandTag />

      {/* Carte bancaire du fournisseur : virement reçu */}
      <div
        style={{
          position: 'absolute',
          left: 250,
          top: 240,
          width: 640,
          ...easeUp(frame, fps, 8, 46),
        }}
      >
        <div
          style={{
            background: COLORS.white,
            borderRadius: 28,
            border: `1.5px solid ${COLORS.border}`,
            boxShadow: CARD_SHADOW,
            padding: '34px 40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              color: COLORS.slate,
              fontWeight: 600,
              fontSize: 22,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: COLORS.navy,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BankIcon size={28} />
            </div>
            Compte bancaire · Fournisseur, Rotterdam
          </div>
          <div
            style={{
              marginTop: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
            }}
          >
            <div
              style={{
                width: 78,
                height: 78,
                borderRadius: '50%',
                background: COLORS.green,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 26px rgba(31, 191, 113, 0.35)',
                transform: `scale(${checkPop})`,
              }}
            >
              <CheckIcon size={42} />
            </div>
            <div>
              <div style={{fontWeight: 600, fontSize: 24, color: COLORS.slate}}>
                Virement reçu
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 52,
                  color: COLORS.navy,
                  letterSpacing: -1,
                }}
              >
                8 500,00 €
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 21,
              fontWeight: 500,
              color: COLORS.slate,
            }}
          >
            De : Boutique Kader · Abidjan — via Cambiste
          </div>
        </div>
        <div style={{position: 'absolute', right: -46, top: -52}}>
          <Avatar size={116} skin="#E8B98A" shirt={COLORS.navy} smile={smile} />
        </div>
      </div>

      {/* Confirmation côté commerçant */}
      <div
        style={{
          position: 'absolute',
          left: 1060,
          top: 300,
          width: 600,
          ...easeUp(frame, fps, 26, 46),
        }}
      >
        <div
          style={{
            background: COLORS.white,
            borderRadius: 28,
            border: `1.5px solid ${COLORS.border}`,
            boxShadow: CARD_SHADOW,
            padding: '34px 40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              color: COLORS.slate,
              fontWeight: 600,
              fontSize: 22,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: COLORS.green,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WalletIcon size={28} />
            </div>
            Portefeuille Mobile Money · Abidjan
          </div>
          <div
            style={{
              marginTop: 26,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: COLORS.greenSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckIcon size={30} color={COLORS.greenDark} />
            </div>
            <div>
              <div style={{fontWeight: 700, fontSize: 27, color: COLORS.navy}}>
                Paiement envoyé
              </div>
              <div style={{fontWeight: 500, fontSize: 21, color: COLORS.slate}}>
                Fournisseur payé en euros, directement depuis le wallet
              </div>
            </div>
          </div>
        </div>
        <div style={{position: 'absolute', right: -40, top: -52}}>
          <Avatar size={116} skin="#8D5524" shirt={COLORS.blue} smile={smile} />
        </div>
      </div>

      {/* Bénéfices clés */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 170,
          display: 'flex',
          justifyContent: 'center',
          gap: 26,
          flexWrap: 'wrap',
          padding: '0 120px',
        }}
      >
        {BENEFITS.map((benefit, i) => {
          const p = pop(frame, fps, 120 + i * 14);
          return (
            <div
              key={benefit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: COLORS.white,
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: 999,
                padding: '18px 34px',
                boxShadow: '0 10px 26px rgba(10, 37, 64, 0.08)',
                opacity: p,
                transform: `scale(${0.7 + 0.3 * p})`,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: COLORS.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckIcon size={20} />
              </div>
              <span
                style={{fontWeight: 700, fontSize: 29, color: COLORS.navy}}
              >
                {benefit}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
