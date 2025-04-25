# Behavior Stream - Gestão de Atividades para Psicólogos

Este projeto é uma aplicação completa para psicólogos gerenciarem as atividades de seus pacientes. A aplicação permite o registro de terapeutas e pacientes, e possibilita que os terapeutas designem atividades para os pacientes, bem como visualizem seus progressos.

## Estrutura do Projeto

Este repositório está organizado em duas partes principais:

- **[backend](./backend/)**: Contém a API Django REST Framework para o gerenciamento de atividades.
- **[frontend](./frontend/)**: Contém a aplicação React/TypeScript para interface do usuário.

## Tecnologias Utilizadas

### Backend
- **Django**: Framework web utilizado para o desenvolvimento do backend.
- **Django Rest Framework**: Extensão do Django para a criação de APIs RESTful.
- **Poetry**: Gerenciador de dependências e ambientes virtuais para Python.
- **PostgreSQL**: Banco de dados relacional para produção.

### Frontend
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Vite**: Ferramenta de build e desenvolvimento rápida.
- **Axios**: Cliente HTTP para comunicação com a API.

### Infraestrutura
- **Docker**: Utilizado para containerizar a aplicação e facilitar o desenvolvimento e a implantação.
- **Nginx**: Servidor web para rotear requisições entre frontend e backend.

## Configuração do Ambiente

### Pré-requisitos

- **Docker**: Certifique-se de que o Docker está instalado e em execução.
- **Docker Compose**: Para orquestrar os contêineres.

### Instruções de Instalação

1. **Clone o Repositório**:

   ```bash
   git clone https://github.com/psifabiohenrique/behavior_stream_api.git
   cd behavior_stream_api
   ```

2. **Configure o arquivo .env**:

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```
   DJANGO_SECRET_KEY=sua_chave_secreta
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ENGINE=django.db.backends.postgresql
   DB_NAME=behavior_stream
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=db
   DB_PORT=5432
   ```

3. **Inicie os contêineres Docker**:

   ```bash
   docker-compose up --build
   ```

4. **Acesse a aplicação**:

   - Frontend: `http://localhost/`
   - API Backend: `http://localhost/api/`
   - Painel Admin Django: `http://localhost/admin/`

## Desenvolvimento

### Backend

Para mais informações sobre o desenvolvimento do backend, consulte o [README do backend](./backend/README.md).

### Frontend

Para mais informações sobre o desenvolvimento do frontend, consulte o [README do frontend](./frontend/README.md).

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](./backend/LICENSE) para mais detalhes. 