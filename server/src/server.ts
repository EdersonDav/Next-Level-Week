import express from 'express';

const app = express();

//Essa função será estartada quando o usuario entrar na rota /users
//O parametro request é utilizado para obter dados da nossa requisição
//O response devolve uma resposta para o navegador
app.get('/users', (resquest, response) => {
  console.log('Listagem de Usuarios');

  //O response.send vai retornar uma resposta para a página
  //response.send('Hello World');

  //Em API o nosso back vai retornar um JSON para o front 
  response.json([
    'Ederson',
    'Rafaela',
    'Alana',
    'Rafaela'
  ]);

});

//O listen mostra em qualporta será aberta a aplicação, no caso localhost:3333
app.listen(3333);