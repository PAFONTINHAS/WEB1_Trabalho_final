const db = require("../models/ConnectDatabase");

class TaskRepository {
  async findAll() {
    const rows = await db.query(`
      SELECT COUNT(codTarefa) FROM tarefa GROUP BY codTarefa;

    `);
  return rows;

  }

  async findById(id) {
    const [rows] = await db.query(`
      SELECT * FROM tarefa WHERE codTarefa = ?

    `, [id]);

    return rows;

  }

  async findByEmail(email) {

  }

  async create({ name, email, phone, category_id }) {


  }

  async findTaskCountByStatus(){
    // MEXI NO SEU LADO DA CERCA PORQUE QUERIA FAZER UM TESTE PARA VER SE DAVA PARA PEGAR
    // APENAS UM AGRUPAMENTO DE UM CAMPO
    // PARA SIMULAR ALGO COMO: 10 TAREFAS PENDENTES
    // AÍ A GENTE PUXA DO BANCO DE DADOS DEPENDENDO DO STATUS DA TAREFA
    // E DEU BOA WOOOHOOOO!
    const rows = await db.query(`
      SELECT statusTarefa, COUNT(*) AS total FROM tarefa GROUP BY statusTarefa

    `);

    return rows;


  }

  update() {

  }

  async delete(id) {

  }
}

module.exports = new TaskRepository();
