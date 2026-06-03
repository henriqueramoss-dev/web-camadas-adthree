# web-camadas-adthree

1. O diagrama da sua stack em produção

Segue o diagram de stack:

<img width="1672" height="941" alt="diagrama" src="https://github.com/user-attachments/assets/148b138f-15df-4c5e-a6cc-eb40628168a2" />


O diagrama mostra a arquitetura da aplicação da barbearia em produção, dividindo o projeto em camadas: usuário, front-end, API, banco de dados e GitHub.

Primeiro, o usuário acessa o sistema pelo navegador usando a URL pública do front-end, como https://barbearia-web.vercel.app. Nessa camada, movem arquivos de interface: HTML, CSS e JavaScript. O HTML monta a estrutura da página, o CSS define o layout e o JavaScript executa as ações do sistema no navegador

Depois que a tela carrega, o front-end precisa buscar ou enviar dados — clientes, serviços, barbeiros e agendamentos. Para isso, ele faz chamadas HTTP/HTTPS para a API hospedada, usando fetch ou outro método de requisição. Essas chamadas usam o formato JSON

A API, hospedada na Render, recebe essas requisições do front-end. Ela processa as regras de negócio do sistema. 

Quando a API precisa salvar, buscar, alterar ou excluir informações, ela se comunica com o banco de dados hospedado. Nesse caso, o banco estar na Aiven usando MySQL. Entre a API e o banco movem consultas feitas pelo Prisma/ORM. O banco armazena os dados principais do sistema: clientes, barbeiros, serviços e agendamentos

Depois de consultar o banco, os dados voltam para a API. Ela transforma a resposta em JSON e envia de volta para o front-end. O front-end recebe esse JSON e atualiza a interface para o usuário, mostrando as informações na tela — como tabelas, cards e formulários preenchidos

O GitHub entra na arquitetura como o local onde fica o código-fonte do projeto. Lá estão os arquivos do front-end e da API. Além de versionar o código, o GitHub pode estar conectado aos serviços de hospedagem. Assim, quando uma alteração é enviada para o repositório, o serviço de hospedagem pode fazer o deploy automaticamente, atualizando o front-end ou a API em produção


2. Front-end consumindo a API em produção

Foi usado HTML puro e o mesmo está hospedado na Vercel

O Vercel após ser conectado com o github e ter acesso ao repositório do front-end transformou automaticamente a antiga URL base da api em uma URL pública que é web-camadas-adthree.vercel.app

Segue a requisição feita:

<img width="1912" height="960" alt="image" src="https://github.com/user-attachments/assets/8622f6ad-8412-4423-8ea0-046583d3a33b" />

Segue o DevTools:

<img width="1914" height="999" alt="image" src="https://github.com/user-attachments/assets/64dd6770-1431-4163-bba7-42f23c54b878" />

3. Como o GitHub conecta tudo


No meu projeto, faz sentido manter o front-end e o back-end em repositórios separados no GitHub porque cada parte tem uma responsabilidade diferente dentro da aplicação

O front-end é responsável pela interface visual do sistema, ou seja, pelas telas que o usuário acessa no navegador. Nele ficam os arquivos HTML, CSS e JavaScript, que consomem a API por meio de requisições HTTP/HTTPS

Já o back-end é responsável pela regra de negócio, pelas rotas da API, pela autenticação e pela comunicação com o banco de dados. Nele ficam os arquivos do servidor Node.js com Express, as configurações do banco e as variáveis de ambiente necessárias para rodar a API

Separar os repositórios ajuda na organização do projeto, porque cada camada pode ser atualizada, testada e implantada de forma independente. Por exemplo, se eu alterar apenas uma tela do sistema, preciso fazer deploy somente do front-end. Se eu alterar uma rota, uma validação ou uma conexão com o banco, preciso fazer deploy somente da API. Isso evita mexer em partes que não foram alteradas e facilita a manutenção

Além disso, a separação também ajuda na hospedagem. O front-end pode ser hospedado em uma plataforma própria para sites estáticos, como a Vercel, enquanto a API pode ser hospedada em uma plataforma própria para servidores Node.js, como o Render. Cada serviço usa o repositório correspondente do GitHub para fazer o deploy

Depois que o repositório do GitHub é conectado à plataforma de hospedagem, a Vercel e o Render passam a acompanhar a branch configurada, normalmente a branch main

No caso do front-end, a Vercel fica conectada ao repositório onde estão os arquivos da interface. Quando um novo commit é enviado para o GitHub, a Vercel identifica essa alteração e inicia automaticamente um novo deploy. A própria documentação da Vercel informa que, ao importar um repositório Git, cada commit ou pull request pode disparar automaticamente uma nova implantação

No caso da API, o Render também fica conectado ao repositório do back-end. Quando ocorre um novo git push na branch configurada, o Render detecta a nova versão do código e inicia um novo processo de deploy. A documentação do Render informa que ele pode fazer deploy automaticamente a cada push realizado na branch vinculada

Quando eu faço uma alteração no projeto e executo os comandos:

git add .
git commit -m "mensagem da alteração"
git push

o código atualizado é enviado para o repositório remoto no GitHub. Como a hospedagem está conectada ao GitHub, a plataforma percebe que existe uma nova versão do projeto.

No painel da Vercel, no caso do front-end, aparece uma nova implantação em andamento. Primeiro a Vercel baixa a versão mais recente do repositório, depois verifica os arquivos do projeto e executa o processo de build ou publicação. Como meu front-end é feito com HTML, CSS e JavaScript puro, o processo é simples: a plataforma publica os arquivos estáticos e gera ou atualiza a URL pública da aplicação.

No painel do Render, no caso da API, também aparece um novo deploy em andamento. O Render baixa o código mais recente do repositório, instala as dependências do projeto com base no package.json, executa o comando de build se houver e depois roda o comando de inicialização da API, como npm start. Se tudo ocorrer corretamente, o status do serviço muda para ativo ou publicado, indicando que a nova versão da API já está em produção.

Durante esse processo, os painéis das plataformas mostram logs do deploy. Esses logs exibem etapas como download do repositório, instalação de dependências, execução de comandos, inicialização do servidor e possíveis erros. Isso ajuda a verificar se a nova versão foi publicada corretamente ou se ocorreu algum problema


4. O que é CI/CD e por que existe

CI significa Integração Contínua. Ela é uma prática em que os desenvolvedores enviam suas alterações de código para um repositório compartilhado, como o GitHub, e o sistema executa verificações automáticas para saber se o projeto continua funcionando

CI pode rodar comandos como instalação de dependências, testes automatizados, verificação de erros de código e build do projeto. Isso ajuda muito no trabalho em time, porque evita que um desenvolvedor envie uma alteração quebrada sem perceber. Em vez de descobrir o problema só depois, quando a aplicação já está em produção, a equipe consegue identificar o erro logo após o git push ou antes de aprovar um pull request

Continuous Delivery e Continuous Deployment fazem parte da etapa de CD, mas não significam a mesma coisa

Continuous Delivery, significa que o projeto é preparado automaticamente para publicação. A pipeline instala dependências, roda testes, faz o build e deixa uma versão pronta para ser colocada em produção. Porém, normalmente ainda existe uma aprovação manual antes de publicar.

Continuous Deployment, vai um passo além. Nesse caso, depois que a pipeline passa por todas as verificações, a nova versão é publicada automaticamente em produção, sem precisar de uma aprovação manual.

A diferença principal é que no Continuous Delivery a versão fica pronta para ser publicada, mas alguém ainda decide quando publicar. No Continuous Deployment, a publicação acontece automaticamente se tudo passar nos testes.

Nas três ADO eu fiz manualmente etapas que uma pipeline de CI/CD poderia automatizar. Por exemplo, ao subir o banco de dados precisei configurar o serviço hospedado, criar a conexão, ajustar a connection string e preparar as tabelas. Ao subir a API, precisei configurar a hospedagem, informar variáveis de ambiente, definir o comando de start e testar se as rotas estavam funcionando. Ao conectar o front-end, precisei apontar a URL pública da API no JavaScript e garantir que o navegador conseguisse consumir os endpoints.

Em uma pipeline de CI/CD essas etapas poderiam ser automatizadas. Quando alguém enviasse código para o GitHub, a pipeline poderia instalar as dependências, verificar se a API ainda inicia corretamente, rodar testes, validar se o build do front-end funciona e fazer o deploy automático nas plataformas de hospedagem. Isso reduziria erros manuais e deixaria o processo mais padronizado.

Um exemplo concreto de problema sem CI/CD seria um time com cinco desenvolvedores trabalhando na mesma API. Imagine que um desenvolvedor altere o nome de uma rota de /clientes para /usuarios, mas não avise o restante do time e não atualize o front-end. Outro desenvolvedor continua usando /clientes no JavaScript. Sem CI/CD e sem testes automáticos, essa alteração pode ser enviada para produção e o cadastro de clientes parar de funcionar.



