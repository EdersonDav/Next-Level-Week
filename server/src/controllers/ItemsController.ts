import { Request, Response } from 'express';
import knex from '../database/conection';

class ItemsController {
  async index(resquest: Request, response: Response) {
    //Sempre que for utilizar uma query do banco de dados é preciso utilizar o await para ele aguardar ter os resultados da query
    const items = await knex('items').select('*');

    //como as informações do banco não estão vindo da forma que a gente quer 
    //precisamos fazer a serialização que transforma os dados por um formato mais acessisvel 
    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        //item_url: `http://localhost:3333/uploads/${item.image}`
        item_url: `http://192.168.15.3:3333/uploads/${item.image}`
      }
    })

    response.json(serializedItems);

  }
}
export default ItemsController;