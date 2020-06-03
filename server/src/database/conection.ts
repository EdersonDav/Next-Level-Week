import knex from 'knex';
import path from 'path'
const connection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite')
  }, useNullAsDefault: true,
});

export default connection;

/*
Para criar o nosso banco vamos ter a tabela point e a tabela items
point: é a tabela onde será armezanda as informações daquele ponto de coleta
items: é onde é armazenado as informações do tipo de item
O relacionamento entre essas tabelas é N-N pois um ponto pode coletar muitos itens e um item pode ser coletado por muitos pontos
devido esse ralacionamento será necessario uma tabela pivot a point_item que guardara as informaçoes de ponto e item
point{
  image, name, email, whatsapp, latitude, longitude, city, uf
}
item{
  image, title
}
point_item{
  point_id, item_id
}
*/

//Migrations = Historico do banco de dados

