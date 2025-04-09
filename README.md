# Behavior Stream API

Este projeto é uma API desenvolvida para psicólogos gerenciarem os exercícios de casa de seus pacientes. A API permite o registro de terapeutas e pacientes, e possibilita que os terapeutas designem atividades para os pacientes, bem como visualizem elas.

## Tecnologias Utilizadas

- **Django**: Framework web utilizado para o desenvolvimento do backend.
- **Django Rest Framework**: Extensão do Django para a criação de APIs RESTful.
- **Poetry**: Gerenciador de dependências e ambientes virtuais para Python.
- **Docker**: Utilizado para containerizar a aplicação e facilitar o desenvolvimento e a implantação.

## Estrutura do Projeto

- **core**: Contém a lógica principal do aplicativo, incluindo modelos de usuário e relacionamentos.
- **activities**: Gerencia diferentes tipos de atividades, como o registro de pensamentos diários.
- **config**: Configurações do projeto Django.
- **db.sqlite3**: Banco de dados SQLite utilizado para desenvolvimento.
- **Dockerfile**: Arquivo de configuração para criar a imagem Docker do projeto.
- **docker-compose.yml**: Arquivo de configuração para orquestrar contêineres Docker.

## Configuração do Ambiente

### Pré-requisitos

- **Docker**: Certifique-se de que o Docker está instalado e em execução.
- **Poetry**: Instale o Poetry para gerenciar as dependências do projeto.

### Instruções de Instalação

1. **Clone o Repositório**:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd behavior_stream_api
   ```

2. **Instale as Dependências**:

   ```bash
   poetry install
   ```

3. **Inicie o Docker**:

   ```bash
   docker-compose up --build
   ```

4. **Acesse a API**:

   A API estará disponível em `http://localhost:8000/api/`.

## Endpoints Principais

- **/api/users/**: Gerenciamento de usuários (terapeutas e pacientes).
- **/api/relationships/**: Gerenciamento de relacionamentos entre terapeutas e pacientes.
- **/api/activities/journaling/**: Gerenciamento de atividades de registro de pensamentos diários.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
