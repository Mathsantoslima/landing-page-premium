#!/usr/bin/env bash
# Gera dist/landing-page-premium.zip, o arquivo que vai para o Claude no navegador e no app.
# O Claude exige que a pasta dentro do .zip tenha o mesmo nome da skill.
#
# Para publicar uma versão nova:
#   1. atualize "version" em .claude-plugin/plugin.json e em .claude-plugin/marketplace.json
#   2. registre a mudança no CHANGELOG.md
#   3. rode ./empacotar.sh
#   4. faça commit e push, e crie a release anexando o .zip:
#      gh release create vX.Y.Z dist/landing-page-premium.zip --title "vX.Y.Z" --notes-file <arquivo>
set -euo pipefail
cd "$(dirname "$0")"
rm -rf dist
mkdir -p dist
(
  cd skills
  zip -rq ../dist/landing-page-premium.zip landing-page-premium \
    -x '*.DS_Store' -x '*/__pycache__/*' -x '*/node_modules/*' -x '*/rel-responsivo/*'
)
echo "Gerado: dist/landing-page-premium.zip"
unzip -l dist/landing-page-premium.zip | tail -1
