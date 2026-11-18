# Ghostfolio

Demonstração local de portfólio para artistas digitais, em português. Interface responsiva inspirada pela referência enviada. Este MVP roda sem backend e não finge autenticação ou publicação em nuvem.

## Executar

Abra `index.html` diretamente no navegador ou inicie um servidor estático:

```powershell
./INICIAR.ps1
```

Acesse http://localhost:4173. Sem dependências externas.

## Recursos disponíveis

- Página pública demonstrativa Ghost Studio com categorias e seis artes gráficas criadas em CSS.
- Filtros por categoria, modal ampliado e navegação por teclado.
- Editor local para nome, usuário, especialidade, descrição e upload múltiplo de imagens.
- Persistência no navegador usando localStorage; limite por arquivo: 5 MB.
- Contato via e-mail e links sociais ilustrativos.

## Limitações e próximos passos

Login OAuth, Supabase, publicação e nomes de usuário públicos não estão configurados. Upload local consome a quota do navegador e não é enviado a um servidor. GIFs podem ser selecionados como imagem; vídeo não é suportado no MVP. As artes de exemplo são composições CSS, não arquivos de imagem. Revise os links de contato antes de usar em produção.

Veja [ROADMAP.md](ROADMAP.md), [SECURITY.md](SECURITY.md) e [TESTING.md](TESTING.md).

