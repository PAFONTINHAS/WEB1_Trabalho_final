const MemberRepository = require("../repositories/MemberRepository");

class Member {
  async index(request, response) {
    // Listar todos os registros
    const contacts = await ContactRepository.findAll();
    response.json(contacts);
  }

  async show(request, response) {

  }

  async store(request, response) {

  }

  update() {
    //Atualizar um registro existente
  }

  async delete(request, response) {

  }

}
module.exports = new Member();
