#!/usr/bin/env bash
# ============================================================
# Marta Sousa Terapias — gerador de imagens responsivas
#
# Cria variantes de largura reduzida (ex.: marta-hero-480.jpg)
# a partir das imagens originais em images/. Os originais são
# mantidos e usados como o maior passo do srcset.
#
# Uso:  bash tools/make-responsive-images.sh
# Requer: ImageMagick (comando `convert`)
# ============================================================
set -euo pipefail

cd "$(dirname "$0")/.."

QUALITY=80

# nome-base:largura1,largura2,...
PLAN="
logo:56,112,168
marta-hero:480
marta-sobre:480,640
marta-reiki:400,600,800
marta-altar:400,600,800
g2:400,720
principios-reiki:600,900
marta-reiki-retrato:400
marta-espaco-retrato:400
marta-dosha:480,720
g4:400,720
g5:400,720
marta-espaco:600,960
"

src_of() {
  for ext in jpg jpeg; do
    if [ -f "images/$1.$ext" ]; then echo "images/$1.$ext"; return; fi
  done
  echo ""
}

for entry in $PLAN; do
  base="${entry%%:*}"
  widths="${entry##*:}"
  src="$(src_of "$base")"

  if [ -z "$src" ]; then
    echo "AVISO: original não encontrado para '$base' — ignorado" >&2
    continue
  fi

  orig_w="$(identify -format '%w' "$src")"

  for w in ${widths//,/ }; do
    if [ "$w" -ge "$orig_w" ]; then
      echo "salta  $base-${w}.jpg (original tem ${orig_w}px)"
      continue
    fi
    out="images/${base}-${w}.jpg"
    convert "$src" -resize "${w}x>" -strip -interlace Plane -sampling-factor 4:2:0 \
            -quality "$QUALITY" "$out"
    printf 'ok     %-28s %sx%s  %s\n' "$out" \
      "$(identify -format '%w' "$out")" "$(identify -format '%h' "$out")" \
      "$(du -h "$out" | cut -f1)"
  done
done

echo
echo "Concluído. Total da pasta images/: $(du -sh images | cut -f1)"
