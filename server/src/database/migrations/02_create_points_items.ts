import Knex from 'knex'

export async function up(knex: Knex) {
  //Criar 
  return knex.schema.createTable('points_items', table => {
    table.increments('id').primary();
    //Criando a chave estrangeira
    table.integer('point_id').notNullable().references('id').inTable('points');
    table.integer('items_id').notNullable().references('id').inTable('items');
  });
}

export async function down(knex: Knex) {
  //Deletar
  return knex.schema.dropTable('points_items');
}
