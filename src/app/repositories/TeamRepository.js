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

  async create({ nomeEquipe, descricao}) {
    const rows = await db.query(
      `INSERT INTO equipe (nomeEquipe, descricao )
      VALUES ("${nomeEquipe}", "${descricao}")` );
      // Retorna o ID do novo contato inserido e os dados inseridos
    const insertedId = rows.insertId;
    return {
      id: insertedId,
      nomeEquipe,
      descricao
    };
  }

  async update(id,updatedFields) {
    const fields = Object.keys(updatedFields)
      .map(key => `${key} = ?`)
      .join(", "); // Cria algo como: "nomeFunc = ?, emailFunc = ?"

    const values = Object.values(updatedFields); // Valores a serem atualizados
    values.push(id); // Adiciona o ID ao final para o WHERE

    const query = `
      UPDATE equipe
      SET ${fields}
      WHERE codEquipe = ?;
    `;

    await db.query(query, values);

  }

  async delete(id) {
    const rows = await db.query(`
      DELETE FROM equipe WHERE codEquipe = ?`, 
      [id]);
      return rows
  }
}

module.exports = new TeamRepository();
