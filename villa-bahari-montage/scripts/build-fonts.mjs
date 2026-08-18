// Génère src/fonts.generated.ts à partir des fichiers .woff2 de @fontsource.
//
// Les polices sont embarquées en data URI plutôt que servies depuis public/ :
// le chargement devient instantané et ne dépend plus du serveur de fichiers
// statiques, qui pouvait se bloquer sur les rendus longs en parallèle.
//
// Usage : node scripts/build-fonts.mjs
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const FACES = [
	['CORMORANT_400', '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2'],
	['CORMORANT_600', '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2'],
	['INTER_400', '@fontsource/inter/files/inter-latin-400-normal.woff2'],
	['INTER_500', '@fontsource/inter/files/inter-latin-500-normal.woff2'],
	['INTER_600', '@fontsource/inter/files/inter-latin-600-normal.woff2'],
];

const lines = [
	'// Fichier généré par scripts/build-fonts.mjs — ne pas modifier à la main.',
	'',
];

for (const [name, file] of FACES) {
	const bytes = readFileSync(join(root, 'node_modules', file));
	lines.push(
		`export const ${name} =`,
		`\t'data:font/woff2;base64,${bytes.toString('base64')}';`,
		'',
	);
}

writeFileSync(join(root, 'src', 'fonts.generated.ts'), lines.join('\n'));
console.log(`src/fonts.generated.ts écrit (${FACES.length} graisses).`);
