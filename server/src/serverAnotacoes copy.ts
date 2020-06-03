import express from 'express';

const app = express();

app.use(express.json());

//Essa função será estartada quando o usuario entrar na rota /users
//O parametro request é utilizado para obter dados da nossa requisição
//O response devolve uma resposta para o navegador
//Rota é o endereço completo que estamos acessando 
//Recurso é qual entidade q estamos acessando no sistema, no caso é users

//Tipos de requisições GET POST PUT DELETE
//GET é quando vc quer pegar a informação, por exemplo o read do CRUD, no recurso users seria para listar os usuarios
//POST é quando você quer criar algo, por exemplo create do CRUD, no recurso users seria para criar um usuario
//PUT é quando vc quer atualizar algo, por exemplo o update do CRUD, no recurso users seria atualizar um usuario
//DELETE é deletar mesmo, o delete do CRUD, no recurso users seria excluir um usuario 
//O Browser só consegue acesssar uma rota do tipo GET

const users = [
  'Ederson',
  'Rafaela',
  'Alana',
  'Geralda',
  'Laerio',
  'Maria'
]
//Buscando todos os usuarios 
app.get('/users', (resquest, response) => {
  //console.log('Listagem de Usuarios');

  //O response.send vai retornar uma resposta para a página
  //response.send('Hello World');

  //Em API o nosso back vai retornar um JSON para o front 

  //Sempre bom colocar antes do response um return, pois se não for desejado que o ódigo continue dpois do response
  //sem o return ele continuara 

  //return response.json(users);

  //Geralmente o request params é um parametro obrigatorio na rota
  //Para parametros que geralmente não é obrigatorio, nós utilizamos o Query params
  //Utilizando o parse para string pois o query pode receber mais de um parametro
  const search = String(resquest.query.search);

  //Buscando o item que veio na requisição do query no meu arrei, assim será listado todos os user q correspondem ao search
  const userFilter = users.filter(user => user.includes(search));

  response.json(userFilter);

});
//Buscando só um usuario com o id, dexando o id como a posição do usuario no array
//usando :id na rota para ser reconecido como um parametro
app.get('/users/:id', (request, response) => {
  //Request params são parametros que vem na propria rota e identifica um recurso
  const id = Number(request.params.id);

  const user = users[id];

  return response.json(user);
});

//Fazendo post, criando um usuario 
app.post('/users', (resquest, response) => {
  //Para não deixar de forma estatica a criação do usuario nos podemos usar o request Body qu é um outro parametro
  //O request Body serve para criação e atualização
  //Como parametro o express não consegue usar o Body pois ele não vem pre configuado para reconhecer o JSON
  //Por isso temos que dizer para ele usar o JSOM com (nossa estancia).use(express.json());
  const data = resquest.body;
  console.log(data);
  const user = {
    nome: data.nome,
    email: data.email
  };

  return response.json(user);
})

//O listen mostra em qualporta será aberta a aplicação, no caso localhost:3333
app.listen(3333);