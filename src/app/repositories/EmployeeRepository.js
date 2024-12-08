const db = require("../models/ConnectDatabase");
var query;

class EmployeeRepository {
  async findAll() {
    query = await db.query(`
      SELECT
      funcionario.codFunc, funcionario.nomeFunc, funcionario.emailFunc, funcionario.cargo,
      permissao.descricao AS permissao
      FROM funcionario
      LEFT JOIN permissao ON permissao.codPermissao = funcionario.codPermissao
    `);
    return query;

  }

  async findById(id) {
    [query]= await db.query(`
      SELECT funcionario.*, permissao.descricao, permissao.nivelAcesso FROM funcionario
      LEFT JOIN permissao on permissao.codPermissao = funcionario.codPermissao
      WHERE codFunc = ${id}
    `);

    return query;

  }

  async findByPermission(id){
    query = await db.query(`
      SELECT funcionario.*, permissao.descricao, permissao.nivelAcesso
      FROM funcionario
      INNER JOIN permissao ON permissao.codPermissao = funcionario.codPermissao
      WHERE permissao.codPermissao = ?
      `, [id]
    );

    return query;
  }


  async findEmployeeCountByStatus(){
    query= await db.query(`
      SELECT
          CASE
              WHEN ativo = 1 THEN 'online'
              WHEN ativo = 0 THEN 'offline'
          END AS status,
          COUNT(*) AS total
      FROM funcionario
      GROUP BY ativo;
    `,);

    return query;
  }



  async findByEmail(email) {
    [query] = await db.query(`
      SELECT * FROM funcionario WHERE emailFunc = '${email}'
    `,
  );


    return query;

  }

  async create({ nomeFunc, emailFunc, cargo, codPermissao}) {
    query = await db.query(`
      INSERT INTO funcionario (nomeFunc, emailFunc, cargo, codPermissao)
      VALUES('${nomeFunc}','${emailFunc}','${cargo}',${codPermissao})
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

  async update(id, updatedFields) {

      const fields = Object.keys(updatedFields)
      .map(key => `${key} = ?`)
      .join(", "); // Cria algo como: "nomeFunc = ?, emailFunc = ?"

    const values = Object.values(updatedFields); // Valores a serem atualizados
    values.push(id); // Adiciona o ID ao final para o WHERE

    const query = `
      UPDATE funcionario
      SET ${fields}
      WHERE codFunc = ?;
    `;

    await db.query(query, values);


  }

  async delete(id) {
    query = await db.query(`
      DELETE FROM funcionario WHERE id = ?
    `, [id])

      return query
  }

}

module.exports = new EmployeeRepository();
