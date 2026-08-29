# Machiavel au Congo — Le pouvoir sans l'État

Version audio narrée de l'essai, en voix masculine française.

| | |
|---|---|
| Fichier | `machiavel-au-congo.mp3` |
| Durée | 16 min 17 s |
| Format | MP3 mono, 44,1 kHz, 96 kb/s (11,7 Mo) |
| Voix | `fr_FR-tom-medium` (Piper TTS) — masculine, français de France |
| Niveau | −16 LUFS, crête −1,1 dBFS (normalisation EBU R128) |

## Fichiers

- `machiavel-au-congo.mp3` — la narration complète.
- `texte-narration.txt` — le texte tel qu'il est lu. C'est le texte de l'essai
  adapté à l'oral : les titres de section y sont énoncés en toutes lettres à la
  place des chiffres romains, les listes à une ligne sont ponctuées pour que la
  synthèse marque les temps d'arrêt, et `C64` est écrit `C 64` pour être lu
  « cé soixante-quatre ». Les lignes préfixées `#` sont le titre et celles
  préfixées `##` les intertitres ; `synth.py` s'en sert pour doser les silences.
- `synth.py` — le script qui produit la piste WAV à partir du texte.

## Regénérer l'audio

Le modèle de voix n'est pas versionné ici (67 Mo). Pour reconstruire la piste :

```bash
pip install piper-tts imageio-ffmpeg

curl -sSL -O https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-fr_FR-tom-medium.tar.bz2
mkdir -p voices && tar xjf vits-piper-fr_FR-tom-medium.tar.bz2 -C voices

python3 synth.py   # écrit machiavel-au-congo.wav

ffmpeg -i machiavel-au-congo.wav \
  -af "highpass=f=70,loudnorm=I=-16:TP=-2.0:LRA=11,alimiter=limit=0.75:level=disabled" \
  -c:a libmp3lame -b:a 96k -ar 44100 -ac 1 \
  machiavel-au-congo.mp3
```

`synth.py` attend le modèle sous
`voices/vits-piper-fr_FR-tom-medium/fr_FR-tom-medium.onnx` et le texte sous
`texte.txt` — renommer `texte-narration.txt` en conséquence, ou ajuster les
constantes `MODEL` et `TEXT` en tête du script.

## Réglages de diction

Ils se trouvent en haut de `synth.py` et se modifient sans toucher au reste :

- `length_scale = 1.06` — débit légèrement ralenti par rapport au défaut, pour
  un ton d'essai plutôt que de lecture de dépêche.
- `PAUSE_SENTENCE = 0.38` s entre deux phrases, `PAUSE_PARAGRAPH = 0.8` s entre
  deux paragraphes, `PAUSE_BEFORE_SECTION = 1.6` s avant un intertitre. Le style
  du texte procède par phrases courtes qui tombent une à une ; ces silences sont
  ce qui restitue ce rythme à l'oral.
