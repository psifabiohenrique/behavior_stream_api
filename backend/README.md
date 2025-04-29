# Backend do Behavior Stream

Esta é a API desenvolvida para psicólogos gerenciarem os exercícios de casa de seus pacientes. A API permite o registro de terapeutas e pacientes, e possibilita que os terapeutas designem atividades para os pacientes, bem como visualizem elas.

## Tecnologias Utilizadas

- **Django**: Framework web utilizado para o desenvolvimento do backend.
- **Django Rest Framework**: Extensão do Django para a criação de APIs RESTful.
- **Poetry**: Gerenciador de dependências e ambientes virtuais para Python.
- **PostgreSQL**: Banco de dados relacional para produção.

## Estrutura do Projeto

  - **core**: Contém a lógica principal do aplicativo, incluindo modelos de usuário e relacionamentos.
  - **activities**: Gerencia diferentes tipos de atividades, como o registro de pensamentos diários.
  - **config**: Configurações do projeto Django.

## Desenvolvimento

### Ambiente Local

Para desenvolver localmente sem Docker:

1. Certifique-se de ter o Poetry instalado:

   ```bash
   pip install poetry
   ```

2. Instale as dependências:

   ```bash
   cd backend
   poetry install
   ```

3. Configure o arquivo .env:

   ```
   DJANGO_SECRET_KEY=sua_chave_secreta
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ENGINE=django.db.backends.sqlite3
   DB_NAME=db.sqlite3
   DB_USER=
   DB_PASSWORD=
   DB_HOST=
   DB_PORT=
   ```

4. Execute as migrações e inicie o servidor:

   ```bash
   poetry run python manage.py migrate
   poetry run python manage.py runserver
   ```

### Usando Docker

O backend já está configurado para ser executado via Docker junto com o frontend. Para mais detalhes, consulte o [README principal](../README.md).

## Endpoints Principais

- **/api/users/**: Gerenciamento de usuários (terapeutas e pacientes).
- **/api/relationships/**: Gerenciamento de relacionamentos entre terapeutas e pacientes.
- **/api/activities/journaling/**: Gerenciamento de atividades de registro de pensamentos diários.
- **/api/token/**: Obtenção de tokens JWT.
- **/api/token/refresh/**: Atualização de tokens JWT.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
