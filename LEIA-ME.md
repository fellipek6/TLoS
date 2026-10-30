# The Labyrinth of Six — site HTML

Abra `index.html` no navegador. A entrada `index.hml` também foi incluída, mas `.html` é a extensão padrão e recomendada para hospedagem.

## Organização
- `index.html`: estrutura e conteúdo principal.
- `JS/data.js`: catálogo de classes, personagens, vídeos e galeria.
- `JS/app.js`: seleção, carrossel, filtros, player, galeria e navegação.
- `CSS/style.css`: identidade visual, animação dos sprites e layouts responsivos.
- `assents/images`: imagens bitmap PNG originais e capturas.
- `assents/sprites`: folhas de sprites originais, exibidas por quadros no CSS.
- `assents/fonts`: Cinzel e sua licença.
- `assents/favicon.svg`: ícone vetorial do site.

JS significa JavaScript; não é Java. As imagens bitmap são arquivos PNG, não precisam ser convertidas em código Base64 ou em BMP. A grafia `assents` segue o pedido.

## Prévia local
O site funciona ao abrir o HTML, sem instalação. Para testar os vídeos, prefira servir a pasta por HTTP: `python -m http.server 8765` e abra `http://localhost:8765`. O YouTube requer internet, pode restringir incorporações e oferece um link direto de alternativa em cada player. Não há reprodução automática nem áudio de fundo.

## Conteúdo e publicação
O convite Discord e os cinco links YouTube são os fornecidos pelo usuário. As capas dos vídeos são imagens ilustrativas do próprio jogo; não foram extraídas dos vídeos. As apresentações preservam as principais revelações da lore.

As capturas da arena têm atributos de teste; a galeria identifica essas demonstrações. Os sprites mostram a camada de corpo/traje original; armas e escudos do jogo são camadas separadas e não estão sobrepostos nesta apresentação.

Esta entrega é um pacote local editável. O projeto do jogo tem registros de licenças pendentes para parte do legado, incluindo a arte de título; confirme as permissões das artes escolhidas antes de publicação pública. Não foram alterados os arquivos do jogo.
