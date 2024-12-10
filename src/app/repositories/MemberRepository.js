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
      equipe.nomeEquipe, funcionario.nomeFunc
      FROM membros
      INNER JOIN funcionario ON funcionario.codFunc = membros.codFunc
      INNER JOIN equipe ON equipe.codEquipe = membros.codEquipe
      WHERE membros.codEquipe = ?;
    `, [id]);

    return query;

  }

  async searchTeam(id) {
    query = await db.query(`
      SELECT * FROM equipe WHERE codEquipe = ?
    `, [id]);

    return query;

  }

  async findById(id) {
    [query]= await db.query(`
      SELECT
      funcionario.*, equipe.*
      FROM membros
      INNER JOIN funcionario ON funcionario.codFunc = membros.codFunc
      INNER JOIN equipe ON equipe.codEquipe = membros.codEquipe
      WHERE membros.codMembro = ?
    `,[id]);

    return query;

  }

  async findByMember(id){
    query= await db.query(`
      SELECT
      funcionario.*, equipe.*
      FROM membros
      INNER JOIN funcionario ON funcionario.codFunc = membros.codFunc
      INNER JOIN equipe ON equipe.codEquipe = membros.codEquipe
      WHERE membros.codFunc = ?
    `,[id]);

    return query;
  }

  async countMembersWithoutTasks(){
    query= await db.query(`
      SELECT COUNT(*) AS sem_tarefas
        FROM Funcionario F
        LEFT JOIN Membros_Tarefas MT ON F.codFunc = MT.codFunc
        WHERE MT.codFunc IS NULL;
    `,);

    return query;
  }

  async findMemberCountByTasks(){
    query= await db.query(`
      SELECT COUNT(DISTINCT codFunc) AS com_tarefas FROM membros_tarefas;
    `,);

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

 async update(updatedFields) {

    const fields = Object.keys(updatedFields)
    .map(key => `${key} = ?`)
    .join(", "); // Cria algo como: "nomeFunc = ?, emailFunc = ?"

    const values = Object.values(updatedFields); // Valores a serem atualizados
    values.push(id); // Adiciona o ID ao final para o WHERE

    const query = `
      UPDATE membros
      SET ${fields}
      WHERE codMembro = ?;
    `;

    await db.query(query, values);

  }

  async delete(id) {
    query = await db.query(`
      DELETE FROM membros WHERE id = ?
    `, [id])

      return query
  }

  // ROTAS ESPECIAIS

 async findMembersByTeam(teamId){
    query = await db.query(`
      SELECT funcionario.nomeFunc AS membro,permissao.descricao,
      equipe.nomeEquipe FROM membros
      INNER JOIN funcionario ON funcionario.codFunc = membros.codFunc
      INNER JOIN equipe ON equipe.codEquipe = membros.codEquipe
      INNER JOIN permissao ON permissao.codPermissao = funcionario.codPermissao
      WHERE funcionario.codPermissao > 3 AND membros.codEquipe = ?
      ORDER BY permissao.descricao DESC
    `, [teamId])

      return query
 }

 async findManagersByTeam(teamId){
    query = await db.query(`
      SELECT funcionario.nomeFunc AS supervisor, equipe.nomeEquipe, permissao.descricao FROM membros
      INNER JOIN funcionario ON funcionario.codFunc = membros.codFunc
      INNER JOIN equipe ON equipe.codEquipe = membros.codEquipe
      INNER JOIN permissao ON funcionario.codPermissao = permissao.codPermissao
      WHERE funcionario.codPermissao <= 3 AND membros.codEquipe = ?
      ORDER BY permissao.descricao

    `, [teamId])

      return query
 }

}

module.exports = new MemberRepository();
