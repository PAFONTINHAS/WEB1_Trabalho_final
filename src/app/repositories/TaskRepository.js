const { query } = require("express");
const db = require("../models/ConnectDatabase");

class TaskRepository {
  //rotas padrao ok

  // quero saber quais sao todas as tarefas
  async findAll() {
    const rows = await db.query(`
      SELECT * FROM tarefa
      `);
  return rows;
  }

  // quero saber uma tarefa específica
  async findById(id) {
    const [rows] = await db.query(`
      SELECT * FROM tarefa WHERE codTarefa = ?`,
      [id]);
    return rows;
  }

  async findByMember(id) {
    const [rows] = await db.query(`
      SELECT * FROM tarefa WHERE codCriador = ?`,
      [id]);
    return rows;
  }

  // pensar em sql, criar a instancia, o dado
  async create({titulo, descricao, dataInicio, dataLimite, statusTarefa, codCriador, codEquipe}) {
    const rows = await db.query(
      ` INSERT INTO tarefa (titulo, descricao, dataInicio, dataLimite, statusTarefa, codCriador, codEquipe)
        VALUES (?, ?, ?, ?, ? , ?, ?)`,
        [titulo, descricao, dataInicio, dataLimite, statusTarefa, codCriador, codEquipe]
    )
    return rows;
  }

// atualizar o registro especifico

  async update(id, updatedFields) {
    const fields = Object.keys(updatedFields)
      .map(key => `${key} = ?`)
      .join(", "); // Cria algo como: "nomeFunc = ?, emailFunc = ?"

    const values = Object.values(updatedFields); // Valores a serem atualizados
    values.push(id); // Adiciona o ID ao final para o WHERE

    const query = `
      UPDATE tarefa
      SET ${fields}
      WHERE codTarefa = ?
    `;

    await db.query(query, values);
  }
// deletar o registro especifico
  async delete(id) {
    const rows = await db.query(`
      DELETE FROM tarefa WHERE codTarefa = ?`,
      [id]);
    return rows;
  }

  async deleteByMember(id) {
    const rows = await db.query(`
      DELETE FROM tarefa WHERE codCriador = ?`,
      [id]);
    return rows;
  }


// ROTAS ESPECIAIS
  async countAllTasks(){

    const rows = await db.query(`
      SELECT COUNT(*) AS tarefas_ativas FROM tarefa WHERE statusTarefa != "concluida"

    `);

    return rows;


  }

  async countTasksByStatus(){

    const rows = await db.query(`
      SELECT statusTarefa, COUNT(*) AS total FROM tarefa GROUP BY statusTarefa

    `);

    return rows;
  }

  async findTasksByStatus(status) {

    const rows = await db.query(`
        SELECT t.codTarefa, t.titulo, t.dataInicio, t.dataLimite, t.statusTarefa, f.nomeFunc AS funcionario, e.nomeEquipe AS equipe
        FROM tarefa t
        INNER JOIN Funcionario f ON f.codFunc = t.codCriador
        INNER JOIN Equipe e ON e.codEquipe = t.codEquipe
        WHERE t.statusTarefa = ?
        ORDER BY t.titulo;
    `, [status]);
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

  // async findTasksByTeam(id){
  //   const rows = await db.query(`
  //     SELECT t.titulo, t.dataInicio, t.dataLimite, t.statusTarefa, f.nomeFunc AS funcionario, e.nomeEquipe AS equipe
  //     FROM tarefa t
  //     INNER JOIN Funcionario f ON f.codFunc = t.codCriador
  //     INNER JOIN Equipe e ON e.codEquipe = t.codEquipe
  //     WHERE t.codEquipe = ?
  //     ORDER BY t.dataCriacao;

  //   `, [id]);

  //   return rows;
  // }


  async findTasksByTeam(id, status) {
    let query = `
      SELECT
        t.codTarefa,
        t.titulo,
        t.dataInicio,
        t.dataLimite,
        t.statusTarefa,
        f.nomeFunc AS funcionario,
        e.nomeEquipe AS equipe
      FROM tarefa t
      INNER JOIN Funcionario f ON f.codFunc = t.codCriador
      INNER JOIN Equipe e ON e.codEquipe = t.codEquipe
      WHERE t.codEquipe = ?
    `;

    const params = [id]; // Parâmetro para filtrar pelo ID da equipe

    // Adiciona o filtro de status, se fornecido
    if (status) {
      query += ` AND t.statusTarefa = ?`;
      params.push(status);
    }

    query += ` ORDER BY t.dataCriacao;`;

    const rows = await db.query(query, params);
    return rows;
  }


  async findTasksByTeamAndId(id, status, taskId) {
    let query = `
      SELECT
        t.codTarefa,
        t.titulo,
        t.dataInicio,
        t.dataLimite,
        t.statusTarefa,
        f.nomeFunc AS funcionario,
        e.nomeEquipe AS equipe
      FROM tarefa t
      INNER JOIN Funcionario f ON f.codFunc = t.codCriador
      INNER JOIN Equipe e ON e.codEquipe = t.codEquipe
      WHERE t.codEquipe = ?
    `;

    const params = [id]; // Parâmetro para filtrar pelo ID da equipe

    // Se o taskId for fornecido, adiciona o filtro
    if (taskId) {
      query += ` AND t.codTarefa = ?`;
      params.push(taskId);
    }

    // Se o status for fornecido, adiciona o filtro
    if (status) {
      query += ` AND t.statusTarefa = ?`;
      params.push(status);
    }

    query += ` ORDER BY t.dataCriacao;`;

    const rows = await db.query(query, params);
    return rows;
  }

}



module.exports = new TaskRepository();
