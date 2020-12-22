Criando telas.
===============================================================================
Criando CustomTabBar e ImageArea.
===============================================================================
Criando lista de comidas.
===============================================================================
Personalizando lista de comidas.
===============================================================================
Troca de ícone da lista de comidas.
===============================================================================
Update na personalização da lista de comidas e nos botões.
===============================================================================
Criando Tela de informações do lanche.
===============================================================================
Criando e personalizando lista de bebidas.
===============================================================================
Personalizando tela de informações do lanche.
===============================================================================
Adicionando ações a tela de informações do lanche.
===============================================================================
Transmitindo dados entre telas e, adicionando ícones na Home.
===============================================================================
Ajustando tamanhos para diferentes dispositivos e, adicionando ações a tela de pedidos.
===============================================================================
Substituindo tela Home - Parte 1
===============================================================================
Substituindo tela Home - Parte 2
===============================================================================
Rolagem para o topo, e personalizando tela de informações da entrega.
===============================================================================
Pré-finalização da tela Info. entrega, trocando a personalização do cabeçalho da lista de bebidas, criando modal de formas de pagamento e adicionando ações, trocando o Alert de exlusão de item da tela Request por um modal, adicionando rolagem automática na lista de bebidas, e finalizando a estilização da tela InfoSnack adicionando opções de acompanhamento.
===============================================================================
Reservando locais das imagens, mudando height de StuffArea para auto, adicionando itens em foodList e a ação de adição de itens extras, resolvendo erro de tamanho de cada item da tela request, e estilizando um pouco mais a lista de requests.
===============================================================================
Finalizando ações de itens extras, ajustando SectionList de ListItemDrinks, ajustando Touchable de Potato Chips em InfoSnack, gerando código de retirada, resolvendo erro de InfoDelivery, alterando orientação da tela para retrato, adicionando transições entre telas, resolvendo erros de clique duplo, resolvendo erros de adição de itens na sacola, terminando opções de pagamento, e impedindo envio do pedido com quantidade de números do telefone insuficiente.
===============================================================================
Adicionei um scroll na tela InfoSnack. Na tela InfoDelivery adicionei um scroll, um view para o cabeçalho, troquei um pouco da estilização da area dos botões do cabeçalho, defini a largura dos botões cabeçalho com porcentagem, adicionei um rodapé para o usuário visualizar o código de retirada, inseri ações no teclado para reagir à alguns comandos do usuário, adicionei um gerador de código que é gerado ao clicar em gerar código. No componente TopArea de InfoSnack, mudei algumas coisas na estilização. Nos componentes InputArea de PlaceForm1 que é componente de InfoDelivery e InputArea de DeliveryForm1 que é componente de InfoDelivery, tive que deixar os inputs responsivos para não quebrar o layout. Deletei os arquivos SectionHeaderDrinks.js, ListItemFoods, ListItemDrinks, ImageArea e CustomTabBar. Redimensionei o view da image de PosterArea para caber em outras telas. Inseri o firebase no projeto.
===============================================================================
Aqui o projeto está chegando à pré-finalização da primeira versão do mesmo. Então para que chegem mais de duas categorias como estava somente com "Lanches" e "Bebidas", eu modifiquei a tela Home tirando os botões que estavam na horizontal e logo abaixo deles tinham os itens da categoria, e coloquei nessa parte que fica abaixo dos sildes, botões agrupados em grade de duas colunas. Criei uma tela de visualizações dos itens da categoria escolhida. Logo após de ter feito essa tela, modifiquei a tela de informações e adição do item, onde tinham complementos limitados que o cliente pediu para colocar, mas como agora o mesmo tem acesso a todo o cardápio podendo modificá-lo, é possível além de adicionar o item com o preço equivalente a quantidade, adicionar também complementos do item. Fiz uma tela de resumo, onde o usuário preenche dados como o endereço caso não tenha inserido já, opção de entrega ou retirada, formas de pagamento, e resumo do pedido já com o SubTotal, a taxa de entrega e o total do pedido.
===============================================================================
- Implementei o envio e recebimento de notificações, para que qunado o usuário ao fazer ou cancelar um pedido a notificação chegue até o app do administrador;
- Fiz uma tela para o usuário visualizar a foto do lanche;
- Toda vez que o usuário terminar de preencher os dados na tela Resume, ele será redirecionado para a tela ThankYou, onde terá uma frase de agradecimento e dois botões, um para redirecioná-lo para Home e outro para ver o pedido na tela History;
- Adicionei funções com o BackHandler do React Native para que ao pressionar o botão de voltar do Android o usuário não volte para a tela anterior. Você pode ver isso acontecendo por exemplo na tela ThankYou, onde não é desejável o retorno para a tela Resume e sim que o usuário escolha uma das opções mostradas em tela;
- Crie um componente chamado Header, para que seja usado em todas as telas que tenha um cabeçalho semelhante. Mas também para resolver o problema do modal de 'react-native-modal' não está cobrindo totalmente a tela sem que a cor da Barra de Navegação do Android mude;
- Fiz algumas funções para a formatação do preço em algumas telas;
- Na tela Resume as informações de data e hora do pedido feito já estão sendo enviadas formatadas, mas futuramente vou tirar isso porque só é preciso enviar o valor de new Date em formato String para o banco de dados, e quando o front-end receber ele fica resposável por formatar data e hora;
- Adicionei uma variável order_history que é um array no reducer requestReducer, para armazenar os pedidos feitos e os pedidos cancelados, e manter no aplicativo;
- Adicionei outra variável em requestReducer chamada dlvFee que também será mantida no aplicativo, para que quando o usuário entrar em Resume já fazer o cálculo imediatamente;
- Troquei o modo como é gerado o código do pedido, para que ele tenha menos caracteres, e contenha agora 3 letras em caixa alta e trê números;
- Implementei o pacote netinfo do react-native-community para que em alguns casos onde não tenha conexão com a internet, possa ser disparado um aviso para se conectar antes de faz determinada ação;
- Fiz uma página de carregamento que se chama Loader, ela vai basicamente cobrir a tela atual mas com um leve tom de transparência, deixando assim a tela que está por trás visível. Essa página impede que o usuário faça alterações no app enquanto ele carrega as informações por exemplo que ele digitou para se cadastrar, e também impede o mesmo de voltar para outra tela porque tem um BackHandler impedindo esta ação;
- Adicionei uma tela chamada OrderDetails para ver os detalhes de cada pedido feito, que está em History;
- A variável list_must da tela InfoSnack estava recebendo o resultado de um array percorrido pelo método map que estava retornando undefined para os valores que não coincidiam com a condição. Então para resolver isso, primeiro percorri o array usando o método filter e depois map para retornar somente os índices do array, foi a única solução que consegui encontrar;
- Finalizei a tela Information;
- Em alguns components que possuem modal, troquei o modal do react native pelo modal do pacote 'react-native-modal';
- Adicionei um botão no components BottomArea que ao clicar abre um input para o usuário digitar alguma observação sobre o pedido;
- Alterei o cálculo da função normalize e a coloquei em um arquivo chamado functions que só exporta funções;