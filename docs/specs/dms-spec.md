# Especificação - Document Management System

> Especificação funcional e técnica para orientar a implementação do Document
> Management System (DMS).

## 1. Objetivo

Permitir que usuários enviem, consultem e baixem documentos, mantendo os
arquivos no filesystem local da aplicação e os metadados em memória.

## 2. Escopo

### Dentro do escopo

- Upload de um documento por requisição HTTP.
- Registro de metadados do documento, incluindo o usuário proprietário.
- Listagem dos metadados de todos os documentos enviados na execução atual.
- Download de um documento a partir do seu identificador.
- Endpoint de verificação de saúde do backend.

### Fora do escopo

- Armazenamento externo, em nuvem ou por provedores de terceiros.
- Versionamento de documentos.
- Autenticação, autorização e cadastro de usuários.
- Persistência de metadados após a reinicialização do processo.
- Exclusão, atualização, busca ou categorização de documentos.

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O sistema deve receber o upload de um arquivo no endpoint `POST /upload`, usando `multipart/form-data` e o campo `file`. |
| RF-02 | O sistema deve receber o identificador do proprietário no campo textual obrigatório `owner` da requisição de upload. |
| RF-03 | O sistema deve gravar cada arquivo enviado no filesystem local da aplicação antes de retornar sucesso ao cliente. |
| RF-04 | O sistema deve gerar um identificador único para cada documento e registrar seus metadados em memória. |
| RF-05 | O sistema deve devolver os metadados públicos do documento criado após um upload bem-sucedido. |
| RF-06 | O sistema deve listar os metadados públicos dos documentos registrados por meio de `GET /documents`. |
| RF-07 | O sistema deve localizar e transmitir o conteúdo binário do arquivo por meio de `GET /documents/:id/download`. |
| RF-08 | O sistema deve retornar `400` quando o upload não contiver arquivo válido ou proprietário informado. |
| RF-09 | O sistema deve retornar `404` quando um documento solicitado para download não existir. |
| RF-10 | O sistema deve disponibilizar `GET /health` para indicar que o backend está ativo. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | Os arquivos devem ser gravados somente no filesystem local utilizando `multer` com `diskStorage`. |
| RNF-02 | O diretório padrão de armazenamento deve ser `backend/storage`; uma variável de ambiente pode sobrescrevê-lo para isolar ambientes. |
| RNF-03 | Os metadados devem ser mantidos somente em memória nesta fase e serão perdidos ao reiniciar o processo. |
| RNF-04 | O backend deve utilizar Node.js, Express e módulos CommonJS; o frontend deve utilizar React, Vite e módulos ESM. |
| RNF-05 | Configurações dependentes do ambiente, como `PORT` e o diretório de armazenamento, devem ser obtidas por variáveis de ambiente. |
| RNF-06 | O backend deve respeitar o fluxo de dependências `routes -> controllers -> services -> repositories`. |
| RNF-07 | As camadas internas não devem depender de Express, objetos HTTP ou componentes do frontend. |
| RNF-08 | Os testes do backend devem usar o runner nativo `node:test`. |
| RNF-09 | O nome original do arquivo não deve ser usado diretamente como caminho físico de armazenamento. |

## 5. Modelo de dados (metadados do documento)

### Metadados públicos

| Campo | Tipo | Descrição |
| --- | --- | --- |
| id | string | Identificador único gerado pelo backend. |
| originalName | string | Nome original do arquivo informado pelo cliente. |
| size | number | Tamanho do arquivo em bytes. |
| uploadedAt | string | Data e hora do upload no formato ISO 8601. |
| owner | string | Identificador textual do usuário proprietário. |

### Dados internos de persistência

| Campo | Tipo | Descrição |
| --- | --- | --- |
| storedName | string | Nome seguro e único atribuído ao arquivo no armazenamento local. Não é exposto pela API. |
| storagePath | string | Caminho local usado para localizar o arquivo gravado. Não é exposto pela API. |

O repositório mantém os dados internos junto aos metadados públicos em memória.
O serviço deve selecionar somente os metadados públicos nas respostas da API.

## 6. Contratos de API

### GET /health

Verifica a disponibilidade do backend.

- Entrada: nenhuma.
- Resposta de sucesso: `200 OK`.

```json
{
  "status": "ok"
}
```

### POST /upload

Cria um documento a partir de um arquivo enviado pelo cliente.

- Content-Type: `multipart/form-data`.
- Campos de entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| file | arquivo | Sim | Arquivo que será armazenado localmente. |
| owner | string | Sim | Identificador textual do proprietário do documento. |

- Resposta de sucesso: `201 Created`.

```json
{
  "id": "doc_123",
  "originalName": "relatorio.pdf",
  "size": 2048,
  "uploadedAt": "2026-09-01T12:00:00.000Z",
  "owner": "usuario-123"
}
```

- Respostas de erro:

| Status | Situação |
| --- | --- |
| `400 Bad Request` | O campo `file` está ausente, inválido ou o campo `owner` não foi informado. |
| `500 Internal Server Error` | O arquivo não pôde ser armazenado ou ocorreu uma falha inesperada. |

### GET /documents

Lista os documentos registrados na execução atual do backend.

- Entrada: nenhuma.
- Resposta de sucesso: `200 OK`.

```json
[
  {
    "id": "doc_123",
    "originalName": "relatorio.pdf",
    "size": 2048,
    "uploadedAt": "2026-09-01T12:00:00.000Z",
    "owner": "usuario-123"
  }
]
```

- A resposta deve ser uma lista vazia quando nenhum documento estiver registrado.
- Resposta de erro: `500 Internal Server Error` para falhas inesperadas.

### GET /documents/:id/download

Transmite o conteúdo binário de um documento existente.

- Parâmetro de rota:

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| id | string | Sim | Identificador único do documento. |

- Resposta de sucesso: `200 OK`, com o conteúdo binário do arquivo.
- A resposta deve definir `Content-Disposition` para download com o nome original do arquivo.

| Status | Situação |
| --- | --- |
| `404 Not Found` | Não há metadados para o identificador solicitado ou o arquivo local não foi encontrado. |
| `500 Internal Server Error` | Ocorreu uma falha inesperada durante a leitura do arquivo. |

## 7. Decisões arquiteturais

- O backend será organizado em Clean Architecture simples: `routes` definem os
  endpoints e aplicam middlewares; `controllers` tratam HTTP e validação básica;
  `services` concentram regras de negócio; `repositories` persistem metadados em
  memória e disponibilizam o acesso ao arquivo local.
- A direção de dependência é obrigatória: `routes -> controllers -> services ->
  repositories`. Serviços e repositórios não conhecem `req`, `res` ou Express.
- O middleware de upload usa `multer` com `diskStorage`; os arquivos são
  persistidos exclusivamente em `backend/storage` ou no diretório definido por
  variável de ambiente.
- Os metadados não usam banco de dados nesta fase. Um repositório em memória
  preserva a interface de persistência para permitir evolução posterior.
- O frontend usa componentes funcionais React e um serviço baseado em `fetch`.
  Em desenvolvimento, as chamadas usam o prefixo `/api`, encaminhado pelo proxy
  do Vite ao backend.
- Erros são tratados nos limites do sistema: validação de entrada e respostas
  HTTP nos controllers, e falhas de leitura e escrita de arquivos na integração
  com o filesystem.

## 8. Plano de execução

1. **Preparar o repositório de documentos**
   - Criar o repositório responsável pelos metadados em memória e pela consulta
     de documentos por identificador.
   - Definir o diretório local de armazenamento, com `backend/storage` como
     padrão e suporte a configuração por ambiente.
   - Critério de aceite: o repositório registra, lista e localiza metadados sem
     expor o caminho físico em respostas públicas.

2. **Implementar o serviço de documentos**
   - Criar regras para gerar ID, montar metadados, registrar uploads, listar
     documentos e localizar um documento para download.
   - Garantir que apenas os campos públicos sejam retornados ao controller.
   - Critério de aceite: o serviço executa as regras de negócio sem depender de
     Express ou de objetos HTTP.

3. **Implementar controllers e rotas do backend**
   - Configurar `multer` com `diskStorage` no limite de entrada e criar as rotas
     `POST /upload`, `GET /documents` e `GET /documents/:id/download`.
   - Aplicar validação HTTP, códigos de status e respostas definidos nesta spec.
   - Manter `GET /health` disponível.
   - Critério de aceite: cada endpoint atende ao contrato e respeita o fluxo
     `routes -> controllers -> services -> repositories`.

4. **Adicionar testes de backend**
   - Usar `node:test` para cobrir upload válido, upload inválido, listagem vazia
     e preenchida, download existente e documento inexistente.
   - Isolar o diretório de armazenamento em testes para não afetar arquivos
     locais de desenvolvimento.
   - Critério de aceite: a suíte valida os status, os metadados públicos e o
     conteúdo baixado dos cenários principais.

5. **Criar o serviço de comunicação do frontend**
   - Implementar funções de upload, listagem e download usando `fetch` com o
     prefixo `/api` configurado no Vite.
   - Traduzir respostas de erro da API em mensagens adequadas à interface.
   - Critério de aceite: o serviço consome todos os endpoints sem codificar a
     origem do backend fora do proxy de desenvolvimento.

6. **Implementar componentes e página do frontend**
   - Criar componentes de envio de arquivo, listagem de documentos e comando de
     download, organizados em `components/`, `pages/` e `services/`.
   - Exibir estados de carregamento, sucesso, lista vazia e falha.
   - Critério de aceite: um usuário consegue realizar upload, visualizar o
     resultado e iniciar download pela interface.

7. **Validar o fluxo integrado**
   - Executar backend e frontend em ambiente local configurado e verificar o
     fluxo completo de upload, listagem e download.
   - Confirmar que nenhum provedor externo é usado e que arquivos permanecem no
     diretório local configurado.
   - Critério de aceite: o fluxo fim a fim atende aos requisitos funcionais e
     os testes automatizados do backend permanecem aprovados.
