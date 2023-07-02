# :rocket: Daily Diet API :rocket:

Uma API simples para gerenciamento de dieta diária, desenvolvida em <i>Node.js</i> com o microframework Fastify. A API utiliza o query builder Knex para interagir com o banco de dados. Os testes ponta a ponta são realizados com o framework Vitest, e as validações são feitas utilizando o Zod. A API é escrita em TypeScript.


![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)

## Certifique-se de ter as seguintes tecnologias instaladas em sua máquina:

    Node.js
    npm (gerenciador de pacotes do Node.js)

## Inicialização :triangular_flag_on_post:

    Clone este repositório: git clone https://github.com/HiLucred/daily-diet-api.git

    Navegue até o diretório do projeto: cd daily-diet-api

    Instale as dependências do projeto: npm install

    Inicie o servidor de desenvolvimento: npm run dev


A API será iniciada e estará disponível em http://localhost:3333 por padrão.

## Rotas :round_pushpin:
No Insomnia, utilize a rota http://localhost:3333 e teste as rotas disponíveis na API.

Cria um novo usuário

    POST /user 
Retorna as informações do usuário criado

    GET /user/ 
Retorna um sumário das informações de um usuário.
 
    GET /user/summary
Cria uma nova refeição

    POST /meals
Retorna todas as refeições de um usuário

    GET /meals
Edita uma refeição pelo ID
  
    PUT /meals/:id
Deleta uma refeição pelo ID

    DELETE /meals/:id
Identifica uma refeição pelo ID

    GET /meals/:id

## Testes :round_pushpin:

Para executar os testes, certifique-se de ter as dependências instaladas e execute o seguinte comando:

    npm test

Tecnologias utilizadas :computer:

    Node.js
    TypeScript
    Fastify
    Knex
    Zod
    Vitest
    Dotenv