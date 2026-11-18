# SECURITY

Esta versão é uma demonstração estática local. Não implementa autenticação, API, servidor de uploads ou isolamento entre usuários. Não armazene informações privadas nela.

Fotos e artes adicionadas ficam como data URLs no localStorage deste navegador. Os limites de 1 MB para avatar e 3 MB por arte são proteções de experiência no cliente, não validação de segurança. Links externos de redes são exemplos. Não existem segredos ou chamadas a serviços externos no frontend.

Para produção: validar MIME e conteúdo no servidor, limitar dimensões/tamanho/requisições, servir uploads isolados, codificar conteúdo, aplicar CSP e proteção CSRF quando houver sessões, usar OAuth oficial, RLS no banco, URLs assinadas e política de retenção/exclusão. Solicitar revisão de segurança antes de disponibilizar uploads públicos.
