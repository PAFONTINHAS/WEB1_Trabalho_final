const db = require("../models/ConnectDatabase");

class ContactRepository {
  async findAll() {
    const rows = await db.query(`
        SELECT contacts.* FROM contacts
        LEFT JOIN categories ON categories.id = contacts.category_id
        `);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(
      `
      SELECT contacts.*, categories.name AS category_name
      FROM contacts
      LEFT JOIN categories ON categories.id = contacts.category_id
      WHERE contacts.id = ?;
      `,
      [id]
    );
    return row;
  }

  async findByEmail(email) {
    const [rows] = await db.query(
      `
      SELECT * FROM contacts
      WHERE email = ?;
      `,
      [email]
    );

    return rows;
  }

  async create({ name, email, phone, category_id }) {
    const result = await db.query(
      `
      INSERT INTO contacts (name, email, phone, category_id)
      VALUES (?, ?, ?, ?)
      `,
      [name, email, phone, category_id]
    );

    // Retorna o ID do novo contato inserido e os dados inseridos
    const insertedId = result.insertId;
    return {
      id: insertedId,
      name,
      email,
      phone,
      category_id,
    };
  }

  update() {}

  async delete(id) {
    const deleteItem = await db.query(
      `
        DELETE FROM contacts
        WHERE id = ?;
      `,
      [id]
    );

    return deleteItem;
  }
}

module.exports = new ContactRepository();
