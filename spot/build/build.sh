#!/usr/bin/env bash
# Construit le spot publicitaire "Manuscrit : Titre Inconnu" (1080x1080, 38,7 s).
#
# Sources attendues dans $SRCDIR :
#   cover.jpg    couverture du livre
#   amazon.jpg   capture de la fiche Amazon
#   rituel.mov   sequence du rituel
#
# Dependances : ffmpeg (>= 6), python3 + pillow.
set -euo pipefail

FF=${FF:-ffmpeg}
SRCDIR=${SRCDIR:?definir SRCDIR}
WORK=${WORK:-./work}
OUT=${OUT:-./spot-manuscrit-titre-inconnu-1080x1080.mp4}
mkdir -p "$WORK/seg" "$WORK/gfx"

# --- 1. cartons fixes (couverture, fiche Amazon, carton de fin) --------------
python3 "$(dirname "$0")/make_scenes.py" --src "$SRCDIR" --out "$WORK/gfx"

ENC=(-c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -r 30)

still () { # $1=png  $2=duree  $3=zoom/frame  $4=zoom max  $5=sortie  $6=filtres additionnels
  "$FF" -hide_banner -loglevel error -loop 1 -framerate 30 -t "$2" -i "$1" -filter_complex \
    "[0:v]scale=4320:4320:flags=lanczos,\
zoompan=z='min(1.0+$3*on,$4)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1080:fps=30\
${6:+,$6},format=yuv420p[v]" -map "[v]" "${ENC[@]}" "$5" -y
}

still "$WORK/gfx/scene_cover.png"  5.0 0.00055 1.09 "$WORK/seg/seg1.mp4" "fade=t=in:st=0:d=0.9"
still "$WORK/gfx/scene_amazon.png" 5.5 0.00035 1.06 "$WORK/seg/seg3.mp4" ""
still "$WORK/gfx/scene_end.png"    6.0 0.00028 1.05 "$WORK/seg/seg4.mp4" "fade=t=out:st=5.0:d=1.0"

# --- 2. rituel : restauration d'image, sans aucune incrustation --------------
# Le master est encode en 1080x1080 mais l'image utile ne fait que 1080x864
# (bandes noires de 108 px). On recadre, on restaure, puis on remplit les
# bandes avec une copie floutee et assombrie du plan : aucune perte de
# resolution, et un cadre plus riche qu'un simple noir.
ENH="crop=1080:864:0:108,\
hqdn3d=2:1.5:5:4,\
deband=1thr=0.012:2thr=0.012:3thr=0.012:range=24:blur=1,\
scale=2160:1728:flags=lanczos,unsharp=5:5:0.55:5:5:0.0,scale=1080:864:flags=lanczos,\
curves=all='0/0.02 0.25/0.30 0.5/0.53 0.75/0.78 1/1',\
eq=contrast=1.05:saturation=1.14:gamma=1.03,\
cas=0.45"

"$FF" -hide_banner -loglevel error -ss 6.0 -to 30.5 -i "$SRCDIR/rituel.mov" -filter_complex "\
[0:v]split=2[bgsrc][fgsrc];\
[bgsrc]crop=1080:864:0:108,scale=180:144,gblur=sigma=14,scale=1350:1080:flags=bicubic,crop=1080:1080:135:0,eq=brightness=-0.18:saturation=0.5[bg];\
[fgsrc]$ENH[fg];\
[bg][fg]overlay=x=0:y=108:format=yuv444[base];\
[base]vignette=PI/4.6,noise=alls=4:allf=t+u,fade=t=in:st=0:d=0.6,format=yuv420p[v]" \
  -map "[v]" -t 24.5 "${ENC[@]}" "$WORK/seg/seg2.mp4" -y

# --- 3. piste audio ----------------------------------------------------------
# Le spot est muet : on ecrit une piste silencieuse plutot que rien du tout,
# certains lecteurs et plateformes se comportant mal sans piste audio.
D=38.7
"$FF" -hide_banner -loglevel error \
 -f lavfi -i "anullsrc=channel_layout=stereo:sample_rate=48000" \
 -t $D -c:a pcm_s16le "$WORK/silence.wav" -y

# --- 4. montage : fondus enchaines ------------------------------------------
# Les segments images doivent etre lus a 30 i/s en entree (-framerate 30),
# sinon leur duree reelle est de 25/30 de la duree demandee et les offsets
# de xfade tombent a cote.
"$FF" -hide_banner -loglevel error \
 -i "$WORK/seg/seg1.mp4" -i "$WORK/seg/seg2.mp4" -i "$WORK/seg/seg3.mp4" -i "$WORK/seg/seg4.mp4" -i "$WORK/silence.wav" \
 -filter_complex "\
[0:v][1:v]xfade=transition=fade:duration=0.8:offset=4.2[x1];\
[x1][2:v]xfade=transition=fadeblack:duration=0.8:offset=27.9[x2];\
[x2][3:v]xfade=transition=fade:duration=0.7:offset=32.7,format=yuv420p[v]" \
 -map "[v]" -map 4:a \
 -c:v libx264 -preset slow -crf 17 -profile:v high -level 4.1 -pix_fmt yuv420p -r 30 \
 -c:a aac -b:a 96k -ar 48000 -movflags +faststart "$OUT" -y

echo "Ecrit : $OUT"
