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


  async countAllTasks(){
    // MEXI NO SEU LADO DA CERCA PORQUE QUERIA FAZER UM TESTE PARA VER SE DAVA PARA PEGAR
    // APENAS UM AGRUPAMENTO DE UM CAMPO
    // PARA SIMULAR ALGO COMO: 10 TAREFAS PENDENTES
    // AÍ A GENTE PUXA DO BANCO DE DADOS DEPENDENDO DO STATUS DA TAREFA
    // E DEU BOA WOOOHOOOO!
    const rows = await db.query(`
      SELECT COUNT(*) AS tarefas_ativas FROM tarefa

    `);

    return rows;


  }

  async findByEmail(email) {

  }

  async create({ name, email, phone, category_id }) {


  }

  async findTaskCountByStatus(){

    const rows = await db.query(`
      SELECT statusTarefa, COUNT(*) AS total FROM tarefa GROUP BY statusTarefa

    `);

    return rows;


  }
  async findLatestTasks(){

    const rows = await db.query(`
      SELECT t.titulo, t.dataInicio, t.dataLimite, t.statusTarefa, f.nomeFunc AS funcionario, e.nomeEquipe AS equipe
      FROM tarefa t
      INNER JOIN Funcionario f ON f.codFunc = t.codCriador
      INNER JOIN Equipe e ON e.codEquipe = t.codEquipe
      HAVING t.statusTarefa = "pendente"
      ORDER BY t.dataCriacao  DESC Limit 5 ;

    `);

    return rows;


  }


  update() {

  }

  async delete(id) {

  }
}

module.exports = new TaskRepository();
