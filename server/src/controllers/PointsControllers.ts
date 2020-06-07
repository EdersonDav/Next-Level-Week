import { Request, Response } from 'express';
import knex from '../database/conection';

class PointsControllers {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items).split(',').map(item => Number(item.trim()));

    const points = await knex('points')
      .join('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('points_items.items_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

    const serializedPoints = points.map(point => {
      return {
        ...point,
        //item_url: `http://localhost:3333/uploads/${item.image}`
        item_url: `http://---/uploads/${point.image}`
      }
    })

    return response.json(serializedPoints);

  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' });
    };
    const serializedPoint = {
      ...point,
      //item_url: `http://localhost:3333/uploads/${item.image}`
      item_url: `http://---/uploads/${point.image}`

    }

    const items = await knex('items')
      .join('points_items', 'items.id', '=', 'points_items.items_id')
      .where('points_items.point_id', id).select('items.title');

    return response.json({ point: serializedPoint, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body;

    //como está sendo feito 2 inserts e um depende do outro, vamos utilizar a transaction
    const trx = await knex.transaction();
    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };
    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];

    const pointItems = items
      .split(',')
      .map((item: String) => Number(item.trim()))
      .map((items_id: number) => {
        return {
          items_id,
          point_id
        };
      })

    await trx('points_items').insert(pointItems);
    await trx.commit()
    return response.json({
      id: point_id,
      // os ... quer dizer para retornar todos os items da variavel point
      ...point,
    });
  }
}
export default PointsControllers;