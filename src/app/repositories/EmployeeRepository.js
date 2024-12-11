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
      SELECT funcionario.*, permissao.descricao, permissao.nivelAcesso, equipe.nomeEquipe , equipe.codEquipe FROM funcionario
      LEFT JOIN permissao on permissao.codPermissao = funcionario.codPermissao
      INNER JOIN membros ON membros.codFunc = funcionario.codFunc
      INNER JOIN equipe  ON membros.codEquipe = equipe.codEquipe
      WHERE funcionario.codFunc = ${id}
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

  async filterByAcessAndTeam(nivelAcesso, equipe){
    const query = `
        SELECT f.codFunc, f.nomeFunc AS funcionario, f.emailFunc AS email, f.cargo, GROUP_CONCAT(e.nomeEquipe) AS equipes, p.descricao, p.nivelAcesso
        FROM Funcionario f
        LEFT JOIN Membros m ON f.codFunc = m.codFunc
        LEFT JOIN Equipe e ON m.codEquipe = e.codEquipe
        INNER JOIN Permissao p ON p.codPermissao = f.codPermissao
        WHERE 1=1
        ${nivelAcesso ? `AND p.nivelAcesso = ?` : ""}
        ${equipe ? `AND e.codEquipe = ?` : ""}
        GROUP BY f.codFunc, funcionario, email, f.cargo
        ORDER BY p.codPermissao ASC
    `;

    const params = [];
    if (nivelAcesso) params.push(nivelAcesso);
    if (equipe) params.push(equipe);

    return await db.query(query, params);
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
      DELETE FROM funcionario WHERE codFunc = ?
    `, [id])

      return query
  }

}

module.exports = new EmployeeRepository();
