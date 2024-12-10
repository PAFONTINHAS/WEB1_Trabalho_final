const db = require("../models/ConnectDatabase");

class TeamRepository {
  async findAll() {
    const rows = await db.query(`
      SELECT codEquipe AS id, nomeEquipe AS equipe FROM equipe
      `);
  return rows;

  }

  async findById(id) {
      const [rows] = await db.query(`
        SELECT codEquipe AS id, nomeEquipe AS equipe, descricao FROM equipe WHERE codEquipe = ?
        `, [id]);
    return rows;
  }

  async findByEmail(email) {

  }

  async create({ name, email, phone, category_id }) {


  }

  update() {

  }

  async delete(id) {

  }
}

module.exports = new TeamRepository();
