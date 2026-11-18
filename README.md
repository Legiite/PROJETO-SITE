# Ghostfolio

Portfólio demonstrativo para artistas digitais, feito com React e Vite a partir do template aberto [Portfolio Template for Artists](https://github.com/rakshixh/Portfolio-Template-For-Artists). A implementação mantém o visual Ghost Studio e adapta a estrutura de perfil e galeria do projeto de referência. Os créditos e a licença MIT original estão em [THIRD-PARTY-LICENSES.md](THIRD-PARTY-LICENSES.md).

## Executar localmente

Instale o [Node.js 22 ou superior](https://nodejs.org/) e, no PowerShell, execute uma vez:

```powershell
npm install
npm run dev
```

Abra http://localhost:4190. O servidor fica disponível apenas no próprio computador. Use `Ctrl+C` para encerrá-lo.

Para gerar os arquivos estáticos de publicação:

```powershell
npm run build
```

Os arquivos prontos ficam em `dist/`. No Cloudflare Pages, configure o comando de build `npm run build`, o diretório de saída `dist` e mantenha o repositório privado.

## Funcionalidades da demonstração

- Página Ghost Studio adaptada à estrutura de perfil e galeria do template de referência.
- Galeria com categorias, artes que sobem suavemente ao aparecer e flutuam levemente ao passar o mouse, GIFs animados e visualização ampliada; clique numa arte para editar título/categoria, trocar a mídia ou excluir.
- Botão `+` na galeria para adicionar várias imagens e atalho no editor.
- Clique no avatar para escolher a foto de perfil.
- Twitch, Instagram, TikTok, Discord e E-mail mostram ícone, nome do serviço e usuário/endereço embaixo.
- O avatar e os ícones de cada rede podem receber imagem personalizada; o mesmo lápis aparece ao passar o mouse.
- Imagem ou GIF animado como fundo, com prévia, remoção e limite local de 20 MB.
- A demonstração já abre com um GIF roxo no fundo e um fantasma animado na categoria Animações; ambos podem ser trocados no editor. Os dois exemplos são carregados do GIPHY.
- Em telas grandes, o perfil e a galeria usam uma escala compacta com quatro artes por fileira para mostrar o portfólio quase todo sem rolagem longa.
- No celular, fontes e cartões de contato se adaptam à largura, com identificadores maiores e cartões que podem quebrar em duas linhas.
- Em tablets e janelas estreitas, avatar, títulos, cartões sociais e endereços usam tamanhos ampliados para leitura.
- A música começa pausada e mutada; o visitante ativa o som pelo botão “Ouvir música”.
- Editor local para nome, usuário, especialidade, descrição, redes, cores, fonte, número de colunas e cantos dos cartões.
- Seletor do destino do botão de orçamento (E-mail, Discord, Twitch, Instagram ou TikTok), com o canal e endereço exibidos abaixo do botão.
- O texto do botão de orçamento e a explicação do destino podem ser editados no painel.
- Painel do criador com atalhos coloridos para editar o site inteiro, música e trabalhos; lápis grande aparece no centro da arte ao passar o mouse.
- Prévia visual do site como visitante, que oculta os controles de edição durante a apresentação.
- Tutorial rápido disponível dentro do painel de edição; ele não aparece na página nem na prévia de visitante.
- Upload de imagens e vídeos MP4/WebM na galeria; os vídeos abrem com controles no modal.
- Música opcional com botão manual de reprodução. Não há reprodução automática.
- Perfil base e obras de demonstração centralizados em `src/Data.js`.
- Texto e preferências ficam em `localStorage`; fotos, artes, vídeos e música ficam em IndexedDB no navegador atual.

## Limitações

Esta é uma demonstração estática. Login individual, banco de dados, publicação de alterações do editor e armazenamento compartilhado ainda não estão conectados. A prévia de visitante só esconde os controles visualmente; ela não é um bloqueio de segurança. O código entregue ao navegador pode ser inspecionado, então chaves privadas nunca devem ser colocadas no frontend. A proteção real exige autenticação e regras de acesso no servidor. Personalizações e arquivos enviados ficam apenas neste navegador e não são sincronizados com outros dispositivos nem com visitantes do site publicado. Os links `ghoststudio` são exemplos; informe seus endereços reais no editor. Foto de perfil: até 5 MB. Imagens da galeria: até 25 MB cada; vídeos MP4/WebM: até 100 MB; música: até 30 MB.

Veja [TESTING.md](TESTING.md), [SECURITY.md](SECURITY.md) e [ROADMAP.md](ROADMAP.md).

