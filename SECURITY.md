# SECURITY

Esta versão é uma demonstração estática local. Não implementa autenticação, API, servidor de uploads ou isolamento entre usuários. Não armazene informações privadas nela.

Os arquivos adicionados ficam como data URLs no localStorage deste navegador. O limite de 5 MB é uma proteção de experiência no cliente, não uma validação de segurança. Links externos de redes são exemplos. Não existem segredos ou chamadas a serviços externos no frontend.

Para produção: validar MIME e conteúdo no servidor, limitar dimensões/tamanho/requisições, servir uploads isolados, codificar conteúdo, aplicar CSP e proteção CSRF quando houver sessões, usar OAuth oficial, RLS no banco, URLs assinadas e política de retenção/exclusão. Solicitar revisão de segurança antes de disponibilizar uploads públicos.
