const db = require("../models/ConnectDatabase");
var query;

class MemberRepository {
  async findAll() {
    query = await db.query(`
      SELECT
      funcionario.nomeFunc, equipe.nomeEquipe
      FROM membros
      INNER JOIN funcionario ON funcionario.codFunc = membros.codFunc
      INNER JOIN equipe ON equipe.codEquipe = membros.codEquipe
      ORDER BY equipe.nomeEquipe
    `);
    return query;

  }

  async findByTeam(id) {
    query = await db.query(`
      SELECT
      funcionario.nomeFunc, equipe.nomeEquipe
      FROM membros
      INNER JOIN funcionario ON funcionario.codFunc = membros.codFunc
      INNER JOIN equipe ON equipe.codEquipe = membros.codEquipe
      WHERE equipe.codEquipe = ?;
    `, [id]);

    return query;

  }
  async findByEmployee(id) {
    query = await db.query(`
      SELECT * FROM funcionario WHERE id = ?
    `, [id]);

    return query;

  }



  async create({ codFunc, codEquipe}) {
    query = await db.query(`
      INSERT INTO membros (codFunc, codEquipe)
      VALUES('${codFunc}','${codEquipe}')
    `);

    // Retorna o ID do novo contato inserido e os dados inseridos
    const insertedId = query.insertId;
    return {
      id: insertedId,
      nomeFunc,
      emailFunc,
      cargo,
      codPermissao,
    };
  }

  update() {

  }

  async delete(id) {
    query = await db.query(`
      DELETE FROM membros WHERE id = ?
    `, [id])

      return query
  }

}

module.exports = new MemberRepository();
