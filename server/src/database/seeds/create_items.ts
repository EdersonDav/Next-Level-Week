import Knex from 'knex';

export async function seed(knex: Knex) {
  // await knex('items').insert([
  //   { title: 'Lâmpadas', image: 'lampada.svg' },
  //   { title: 'Pilhas e Baterias', image: 'baterias.svg' },
  //   { title: 'Papeis e Papelão', image: 'papeis-papelao.svg' },
  //   { title: 'Resíduos Elêtronicos', image: 'eletronicos.svg' },
  //   { title: 'Resíduos Orgânicos', image: 'organicos.svg' },
  //   { title: 'Óleo de Cozinha', image: 'oleo.svg' },
  // ]);

  //Truncate
  //await knex('items').truncate();

  //Update
  await knex('items')
    .where({ id: 1 })
    .update(
      { title: 'Lâmpadas', image: 'lampadas.svg' }
      , ['id', 'title', 'image'])
}