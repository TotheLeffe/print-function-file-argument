import {continueRender, delayRender, staticFile} from 'remotion';

const WEIGHTS = ['400', '500', '600', '700', '800'] as const;

// Chargement manuel des graisses d'Inter (fichiers locaux). Un garde-fou de
// 15 s évite qu'un onglet de rendu reste bloqué sur un delayRender de police
// — les fichiers étant servis localement, le chargement réel prend quelques ms.
if (typeof document !== 'undefined') {
  const handle = delayRender('Loading Inter fonts');

  const loadAll = Promise.all(
    WEIGHTS.map(async (weight) => {
      const font = new FontFace(
        'Inter',
        `url('${staticFile(`fonts/inter-latin-${weight}-normal.woff2`)}') format('woff2')`,
        {weight}
      );
      await font.load();
      (document.fonts as unknown as {add: (f: FontFace) => void}).add(font);
    })
  );

  const safety = new Promise<void>((resolve) => {
    setTimeout(resolve, 15000);
  });

  Promise.race([loadAll, safety])
    .catch(() => undefined)
    .then(() => continueRender(handle));
}
