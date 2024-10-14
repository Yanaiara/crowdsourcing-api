# API de Contribuições e Locais Acessíveis

Essa API foi feita para gerenciar **contribuições** e **locais acessíveis**. Com ela, você pode adicionar novos locais acessíveis, revisar as contribuições dos usuários e muito mais. A API usa **Node.js** e **Express** para o servidor, com os dados armazenados no **Firebase Realtime Database**. Para garantir que os dados sejam válidos, usamos a biblioteca Joi e o Swagger para documentar a API e facilitar os testes.

## Funcionalidades

### 1. Contribuições
Aqui, os usuários podem sugerir locais acessíveis. As sugestões precisam ser aprovadas antes de serem adicionadas oficialmente à lista de locais.

1. **POST /contribuicoes:** Enviar uma nova contribuição.
2. **GET /contribuicoes/pendentes:** Ver todas as contribuições pendentes de aprovação.
3. **PUT /contribuicoes/aprovar/{id}:** Aprovar uma contribuição.
4. **PUT /contribuicoes/rejeitar/{id}:** Rejeitar uma contribuição.
5. **GET /contribuicoes/{id}/status:** Ver o status de uma contribuição específica.


### 2. Locais
Aqui você gerencia os locais acessíveis. Pode adicionar, atualizar ou remover locais, seja manualmente ou a partir de uma contribuição aprovada.

1.  **POST /locais:** Adicionar um novo local. 
2.  **GET /locais:** Ver todos os locais cadastrados.
3. **PUT /locais/{id}:** Atualizar um local.
4. **DELETE /locais/{id}:** Remover um local.


### 3. Validação de Dados

Usamos Joi para garantir que os dados enviados para a API estejam no formato correto. Isso evita erros como campos vazios ou valores fora do padrão (por exemplo, a nota do local deve estar entre 0 e 5).

### 4. Documentação com Swagger
A API está documentada com Swagger, o que facilita entender os endpoints e testar tudo diretamente.

  Acesse a documentação em: http://localhost:3000/api-docs

## Como rodar a API
**1. O que você vai precisar:**
   >**Node.js** (versão 12 ou superior)

   > **Firebase** (com Realtime Database configurado)

  > **Insomnia** ou **Postman** para testar a API

**2. Como instalar e rodar:**

1. Clone o repositório:

    ```javascript
    git clone https://github.com/yanaiara/acessibilidade-api.git
    cd acessibilidade-api
    ```

2. Instale as dependências:

    ```
    npm install
    ```

3. Configure o Firebase:

    > **Crie um Realtime Database no Firebase.**

    > **Baixe o arquivo serviceAccountKey.json do Firebase e coloque na pasta raiz do projeto.**

4. Inicie o servidor:

    ```
    node server.js
    ```

## Testando com o Insomnia ou Postman
Você pode usar o Insomnia ou Postman para testar os endpoints. Aqui vai um exemplo de requisição:

### Exemplo: Adicionando um Local (POST /locais)

**URL**: http://localhost:3000/locais

**Método**: POST

**Body (JSON):**
```json

{
  "name": "Parque Acessível",
  "address": "Rua Principal, 123",
  "features": ["rampa para cadeirantes", "banheiros acessíveis"],
  "rating": 4.5
}`
```
### Exemplo: Enviando uma Contribuição (POST /contribuicoes)

**URL**: http://localhost:3000/contribuicoes
**Método**: POST
**Body (JSON):**
```json

{
  "name": "Café Acessível",
  "address": "Rua Secundária, 456",
  "features": ["menu em braille", "entrada acessível"],
  "rating": 4.0
}
```
## Estrutura do Projeto

```html
acessibilidade-api/
├── config/
│   └── firebase.js         # Configuração do Firebase
├── controllers/
│   ├── contribuicoes.js    # Lógica de contribuições
│   └── locais.js           # Lógica de locais
├── routes/
│   ├── contribuicoes.js    # Rotas de contribuições
│   └── locais.js           # Rotas de locais
├── validation/
│   ├── contribuicao.js     # Validações de contribuições
│   └── local.js            # Validações de locais
├── swagger/
│   └── swaggerConfig.js    # Configuração do Swagger
├── server.js               # Servidor principal
└── package.json            # Dependências do projeto 
```

## Melhorias Futuras
Aqui estão algumas ideias de melhorias para o futuro da API:

**1. Autenticação:**

    Adicionar autenticação com JWT ou Firebase Auth para controlar quem pode aprovar ou rejeitar contribuições.

**2. Paginação e Filtros:**

    Implementar paginação para listar locais e contribuições de forma mais eficiente, principalmente quando o número de registros aumentar.

**3. Cache:**

    Usar um cache (tipo Redis) para acelerar o retorno de dados que são consultados com frequência, como a listagem de locais.

**4. Tratamento de Erros e Logs:**

    Melhorar o tratamento de erros com um middleware global e adicionar logs para monitorar o funcionamento da API.

**5. Testes Automatizados:**

    Ampliar os testes automatizados para cobrir mais cenários, incluindo testes de integração e testes de carga.

**6. Segurança:**

    Implementar Rate Limiting para proteger a API de abusos e garantir que ela só seja usada de forma controlada.

    Garantir que as comunicações entre o cliente e a API sejam feitas via HTTPS para maior segurança.
# crowdsourcing-api
