# PEP

## Pré-requisitos

- node
- npm

## Configuração das variávies de ambiente

- Na pasta src/environments há um arquivo para cada ambiente (test, hml e prod)
- Estes arquivos são utilizados para o build e definidos no arquivo angular.json
  no atributo configurations

## Iniciar a aplicação para desenvolvimento

```
- npm install -g @angular/cli -y
- npm install -y
- npm start
```

## Pipelines

- Cofiguração do pipeline em bitbucket-pipelines.yml

- Ao abrir PR de um branch PEP- ou RES- para dev, é executado o pipeline pull-requests com o step merge-to-test e realizado merge no branch test.

- Os brachs test, hml e master, executam o pipeline branches, realizando o deploy e enviando ao repositório docker.

- Os pipelines das branches test e hml, disponibilizam um botão para realizar o deploy.

## Processo de desenvolvimento

1.  Checkout da branch dev e iniciar um branch com o id da atividade ex: PEP-001
2.  Abrir PR da atividade PEP-001 para dev. O pipeline irá fazer merge em test.
3.  Quando o teste for aprovado, fazer merge em dev.
4.  No final da sprint terá todas as atividades em dev.
5.  Atribuir a nova versão no version/version.go.
6.  Abrir PR de dev para hml e fazer merge.
7.  Ao homologar a versão, abrir PR para master e fazer merge.
8.  Será gerado uma tag da versão.
