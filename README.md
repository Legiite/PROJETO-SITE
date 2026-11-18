# Ghostfolio

Demonstração local de portfólio para artistas digitais, em português. Interface responsiva inspirada pela referência enviada. Este MVP roda sem backend e não finge autenticação ou publicação em nuvem.

## Executar

Com Node.js instalado, entre nesta pasta no PowerShell e execute:

```powershell
node .\SERVIDOR.js
```

Acesse http://localhost:4188. Use `Ctrl+C` para parar o servidor. Não requer dependências externas nem alteração da política de execução do PowerShell.

## Recursos disponíveis

- Página pública demonstrativa Ghost Studio com categorias e seis artes gráficas criadas em CSS.
- Filtros por categoria, modal ampliado e navegação por teclado.
- Editor local para nome, usuário, especialidade, descrição, links sociais e upload múltiplo de imagens.
- Ícones com nomes visíveis para Twitch, Instagram, TikTok, Discord e E-mail.
- Dados de demonstração centralizados em `profile.js` para facilitar a personalização pelo código.
- Persistência no navegador usando localStorage; limite por arquivo: 5 MB.
- Contato via e-mail e links sociais ilustrativos.

## Limitações e próximos passos

Login OAuth, Supabase, publicação e nomes de usuário públicos não estão configurados. O editor salva neste navegador; as alterações não são publicadas para outras pessoas. Upload local consome a quota do navegador e não é enviado a um servidor. GIFs podem ser selecionados como imagem; vídeo não é suportado no MVP. As artes de exemplo são composições CSS, não arquivos de imagem. Troque os links demonstrativos pelos perfis reais antes de publicar.

Veja [ROADMAP.md](ROADMAP.md), [SECURITY.md](SECURITY.md) e [TESTING.md](TESTING.md).
