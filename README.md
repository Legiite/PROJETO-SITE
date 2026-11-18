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
- Galeria com categorias, animações de entrada e visualização ampliada de artes; clique em uma arte para trocar a imagem, editar título/categoria ou excluir.
- Botão `+` na galeria para adicionar várias imagens e atalho no editor.
- Clique no avatar para escolher a foto de perfil.
- Twitch, Instagram, TikTok, Discord e E-mail mostram ícone, nome do serviço e usuário/endereço embaixo.
- Editor local para nome, usuário, especialidade, descrição, redes, cores, fonte, número de colunas e cantos dos cartões.
- Seletor do destino do botão de orçamento (E-mail, Discord, Twitch, Instagram ou TikTok), com o canal e endereço exibidos abaixo do botão.
- Upload de imagens e vídeos MP4/WebM na galeria; os vídeos abrem com controles no modal.
- Música opcional com botão manual de reprodução. Não há reprodução automática.
- Perfil base e obras de demonstração centralizados em `src/Data.js`.
- Texto e preferências ficam em `localStorage`; fotos, artes, vídeos e música ficam em IndexedDB no navegador atual.

## Limitações

Esta é uma demonstração estática. Login, banco de dados, publicação de alterações do editor e armazenamento compartilhado ainda não estão conectados. Personalizações e arquivos enviados ficam apenas neste navegador e não são sincronizados com outros dispositivos nem com visitantes do site publicado. Os links `ghoststudio` são exemplos; informe seus endereços reais no editor. Foto de perfil: até 5 MB. Imagens da galeria: até 25 MB cada; vídeos MP4/WebM: até 100 MB; música: até 30 MB.

Veja [TESTING.md](TESTING.md), [SECURITY.md](SECURITY.md) e [ROADMAP.md](ROADMAP.md).

