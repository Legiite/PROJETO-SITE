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
5. Clique no avatar, envie uma foto menor que 1 MB e confirme que aparece no perfil.
6. Confira que cada rede mostra nome e identificador/endereço; edite esses dados no painel.
7. Use `+ Adicionar imagens` para enviar várias imagens menores que 3 MB.
8. Clique numa arte; troque a imagem, edite título/categoria e teste exclusão.
9. Informe um convite Discord e confira ativação; deixe vazio e confira desativação.
10. Confira a grade em largura de celular.

Build de produção executado durante a migração. Os cenários visuais acima ainda precisam ser verificados no navegador.
