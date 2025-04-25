# Frontend do Behavior Stream

Este é o frontend do projeto Behavior Stream, uma aplicação para gestão de atividades de pacientes por parte de psicólogos.

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- Axios (para comunicação com a API)
- React Router (para roteamento)

## Estrutura do Projeto

O frontend está estruturado da seguinte forma:

- `src/`: Contém o código fonte da aplicação
  - `components/`: Componentes React reutilizáveis
  - `pages/`: Páginas da aplicação
  - `services/`: Serviços para comunicação com a API
  - `hooks/`: Hooks personalizados
  - `contexts/`: Contextos da aplicação (ex: autenticação)
  - `types/`: Definições de tipos TypeScript
  - `utils/`: Funções utilitárias

## Desenvolvimento

Para executar o projeto em modo de desenvolvimento:

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev
```

## Integração com o Backend

O frontend se comunica com o backend através do Nginx, que roteia as requisições adequadamente:

- Frontend: `http://localhost/`
- API Backend: `http://localhost/api/`
- Painel Admin Django: `http://localhost/admin/`

## Construção para Produção

Para gerar os arquivos de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/` e serão servidos pelo Nginx no container Docker. 