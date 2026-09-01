---
description: Melhora o visual do frontend do DMS aplicando Tailwind CSS 3, preservando estrutura e comportamento dos componentes.
name: melhorar-visual-tailwind
agent: ui-designer
---

# Melhorar visual com Tailwind CSS

Melhore o visual da aplicação `frontend` utilizando Tailwind CSS 3, substituindo os
estilos inline atuais (`App.jsx`, `components/DocumentList.jsx`,
`components/UploadComponent.jsx`, `components/DownloadButton.jsx`) por classes
utilitárias do Tailwind.

Requisitos:

1. Configure o Tailwind CSS 3 no projeto `frontend` (dependências, `tailwind.config.js`,
   `postcss.config.js` e diretivas `@tailwind` no CSS global importado em `main.jsx`).
2. Migre os estilos inline dos componentes para classes Tailwind, mantendo a mesma
   hierarquia de componentes, props e comportamento (upload, listagem e download).
3. Melhore a experiência visual: espaçamento consistente, tipografia legível, estados
   de carregamento/erro claros, botões com estados de hover/disabled visíveis e layout
   responsivo para telas pequenas.
4. Não altere o backend nem os contratos dos endpoints (`/upload`, `/documents`,
   `/documents/:id/download`).
5. Ao final, rode `npm run build` em `frontend` para confirmar que não há erros.
