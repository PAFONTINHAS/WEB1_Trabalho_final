const db = require("../models/ConnectDatabase");

class TaskRepository {
  async findAll() {
    const rows = await db.query(`
      SELECT tasks.* FROM task
      LEFT JOIN categories ON categories.id = contacts.category_id
      `);
  return rows;

  }

  async findById(id) {

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

module.exports = new TaskRepository();
