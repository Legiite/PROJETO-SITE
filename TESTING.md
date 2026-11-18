# TESTING

## Build automatizado

```powershell
npm install
npm run build
```

## Verificação manual

1. Rode `npm run dev` e abra `http://localhost:4190`.
2. Confira os filtros Todos, Layouts, Emotes e Logotipos.
3. Abra uma arte; teste fechar, botões anterior/próxima e setas do teclado.
4. Abra o editor, altere perfil e redes; recarregue e verifique persistência local.
5. Confira ícones e rótulos Twitch, Instagram, TikTok, Discord e E-mail.
6. Informe um convite Discord e confira ativação; deixe vazio e confira desativação.
7. Envie imagem menor que 5 MB, recarregue e confira a galeria; teste limite acima de 5 MB.
8. Confira a grade em largura de celular.

Build de produção executado durante a migração. Os cenários visuais acima ainda precisam ser verificados no navegador.
