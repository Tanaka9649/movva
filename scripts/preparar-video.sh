#!/usr/bin/env bash
# Prepara o vídeo de fundo do topo: desfocado, escurecido, sem áudio e leve.
# Uso: scripts/preparar-video.sh caminho/do/video.mp4
# Gera em public/video: topo.mp4, topo.webm e topo.jpg (capa, igual ao primeiro quadro).
# Depois preencha `topoVideo` em src/config/evento.ts.
set -euo pipefail
IN="${1:?Informe o arquivo de vídeo}"
OUT="$(dirname "$0")/../public/video"
mkdir -p "$OUT"
# 960 px de largura, 24 quadros/s, no máximo 12 s; desfoque forte e leve escurecimento
VF="scale=960:-2:flags=lanczos,fps=24,gblur=sigma=14:steps=2,eq=brightness=-0.12:saturation=0.9"
ffmpeg -y -loglevel error -i "$IN" -t 12 -an -vf "$VF" -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart "$OUT/topo.mp4"
ffmpeg -y -loglevel error -i "$IN" -t 12 -an -vf "$VF" -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 "$OUT/topo.webm"
ffmpeg -y -loglevel error -i "$IN" -frames:v 1 -vf "$VF" -q:v 5 "$OUT/topo.jpg"
ls -lh "$OUT"
