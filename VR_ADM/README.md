Primeiro Commit
===============================================================================
Terminando estilização da tela Menu, inserindo ação de adicionar categorias à lista, ação de inserção de itens à categoria, adicionando ação de autoFocus no TextInput quando o Modal da tela Menu é aberto, e inserindo categoria e itens utilizando o firebase.
===============================================================================
Aqui fiz praticamente 75% do app administrador. Adicionei um drawer, onde pode-se navegar e encontrar todas as configurações feitas para aparecer no app do usuário. Então adicionei uma tela de cardápio, onde o adiminstrador poderá adicionar, alterar e deletar produtos, tendo até a opção de inserir imagens. Logo em seguida criei uma tela chamada "Locais de produção", onde é possível visualizar todos os locais onde são produzidas as refeições, e nessa mesma tela também é possível entrar na tela de cadastro para cadastrar um novo local de produção, que é acessível após o registro na tela de login, onde o adminstrador insere o email e senha do local. Para ser visualizada ou alterada as informações do local, disponibilizei uma tela de informações do local, onde o administrador poderá ter acesso email, ao nome da cidade, bairro, endereço, telefone, taxa de entrega, etc. E por fim fiz a tela de horários de funcionamento, onde o administrador poderá configuar os dias e horários em que os estabelecimento estará funcionando.
===============================================================================
- Implementei o envio e recebimento de notificações, para que qunado o usuário ao fazer ou cancelar um pedido a notificação chegue até o app do administrador;
- Coloquei alguns contexts no meu código para servirem de contadores de notificação, enviando assim a quantidade de notificação que cada uma tem para os badges de notificação de cada tela;
- Adicionei uma página Preload que é a Splash Screen;
- Finalizei as telas Delivery e Place, que é onde ficam os pedidos para entrega e os pedidos para retirada. E fiz uma tela Canceled para os pedidos cancelados. Então assim que o cliente cancelar um pedido, será feita uma cópia deste pedido para canceled e excluído de requests que são os nós do banco de dados;
- Logo após ter finalizado as telas Delivery, Place e Canceled, adicionei as telas InfoDelivery, InfoPlace e InfoCanceled para ver informações de cada item de cada tela;
- Criei uma tela chamada Banners para o administrador editar o a foto do Banner que aprece na Home do usuário final;
- Em algumas telas você poderá ver que tem uma função chamada insertImage que vem do aqruivo functions. Ela é responsável por inserir images no Storage do Firebase, passando como parâmetro o id da cidade, o id da imagem e a imagem;
- Fiz algumas funções para a formatação do preço em algumas telas;
- Adicionei uma variável chamada bannerImg em registerReducer que é responsável por verficar se o administrador adicionou uma imagem para o Banner ao tentar cadastrar uma nova cidade;
- Coloquei um Stack Navigator para cada tela do HomeDrawer para ter um cabeçalho pré-definido em cada tela, mas futuramente irei trocar por um componente Header;
- Tive que em algumas telas verificar se existe um usuário logado antes de receber dados no useEffect. Fiz isso porque ao deslogar da conta atual ficava dando error, acusando que o problema estava nos locais onde tem algum useEffect puxando dados do firebase;
- Criei um componente chamado TabBarLabel que está sendo utilizado em navigationOptions de cada screen de HomeTab para conseguir mostrar os badges de notificação de cada uma delas;
- Criei um componente LoadingPage que fica mostrando um ActivityIndicator na tela enquanto os dados não são carregados;
- Adicionei um componente chamado Header que será usado em todas as páginas futuramente;
- Customizei o HomeDrawer através do componente CustomDrawer;
- Criei um componente chamado ButtonNoConnection que será mostrado ao entrar em tela e não tiver conexão com a internet.
- Alterei o cálculo da função normalize e a coloquei em um arquivo chamado functions que só exporta funções;