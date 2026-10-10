# UniResolve

Plataforma de gestão de ocorrências do campus, feita para o Centro Universitário Jorge Amado (Campus Paralela, Salvador). Alunos registram problemas, a equipe atende e todo mundo acompanha o andamento em tempo real.

Projeto de Design Thinking, desenvolvido como peça de portfólio frontend.

## O que o projeto faz

- **Três visões** (Aluno, Equipe e Admin), alternáveis na barra lateral. Cada uma enxerga e pode fazer coisas diferentes.
- **Registro em 3 etapas** (problema, detalhes, revisão) com validação por etapa, foto opcional e protocolo gerado automaticamente.
- **Dashboard dinâmico** com contadores clicáveis, gráfico por status, ranking de categorias, tempo médio de resolução, alerta de ocorrências críticas, busca, filtros e ordenação.
- **Detalhe da ocorrência** com timeline que evolui a cada mudança, comentários e painel de gestão de status (Equipe e Admin).
- **Estado compartilhado e persistente**: tudo que você faz em uma visão aparece nas outras e sobrevive ao recarregar a página (`localStorage`).
- **Privacidade**: dados de matrícula e curso só aparecem para a equipe e para o próprio autor.
- **Personalização**: cor de destaque trocável no perfil e identidade da instituição centralizada em um único arquivo.

## Tecnologias

React 18, Vite, Tailwind CSS, Framer Motion, React Router e Lucide.

## Como rodar

```bash
npm install
npm run dev
```

Build de produção: `npm run build`.

## Personalizando

Nome do app, campus, endereço e textos fixos ficam em `src/config/brand.js`. As cores de destaque disponíveis estão em `src/accents.css`, e a lista que aparece no perfil também está em `brand.js`.

Os dados de exemplo ficam em `src/data/occurrences.js`. No perfil existe o botão "Restaurar dados de exemplo" para voltar ao estado inicial.

## Estrutura

```
src/
  config/      identidade e papéis
  store/       estado global (ocorrências, papel atual, configurações)
  lib/         formatação de datas e redução de imagens
  pages/       Landing, Dashboard, Nova ocorrência, Detalhe, Perfil
  components/  layout e elementos de interface
  data/        dados de exemplo
```
