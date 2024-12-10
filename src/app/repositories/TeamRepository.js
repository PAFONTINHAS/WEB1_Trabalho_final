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

  async create({ descricao, nomeEquipe }) {
    const rows = await db.query(
      `INSERT INTO equipe (descricao, nomeEquipe)
      VALUES (?,?)`, 
      [descricao, nomeEquipe]
    )
  }

  async update(id) {
    const fields = Object.keys(updatedFields)
      .map(key => `${key} = ?`)
      .join(", "); // Cria algo como: "nomeFunc = ?, emailFunc = ?"

    const values = Object.values(updatedFields); // Valores a serem atualizados
    values.push(id); // Adiciona o ID ao final para o WHERE

    const query = `
      UPDATE equipe
      SET ${fields}
      WHERE codFunc = ?;
    `;

    await db.query(query, values);

  }

  async delete(id) {
    const [rows] = await db.query(`
      DELETE FROM equipe WHERE codEquipe = ?`, 
      [id]);
    return rows;
  }
}

module.exports = new TeamRepository();
