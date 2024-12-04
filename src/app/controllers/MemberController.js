const { query } = require("express");
const MemberRepository = require("../repositories/MemberRepository");
var member;

class Member {
  async index(request, response) {
    // Listar todos os registros
    member = await MemberRepository.findAll();
    response.json(member);
  }

  async showByTeam(request, response) {
    // Obter um registro
    const {id} = request.params;

    const team = await MemberRepository.findByTeam(id);
    //Verificando se o Id enviado na requisição pertence a algum contato
    if (!team || team.length === 0) {
      return response.status(404).json({ error: "No Members on this team!" });
    }
    return response.json(team);
  }

  async store(request, response) {
    const { codEquipe, codFunc, codTarefa} = request.body;

    if(codEquipe){
      const queryTeam = await MemberRepository.findByTeam(codEquipe);
      if (!queryTeam) {
        return response
          .status(404)
          .json({ error: "Team not found" });
      }
    }
    if(codFunc){
      const queryTeam = await MemberRepository.findByEmployee(codEquipe);
      if (!queryTeam) {
        return response
          .status(404)
          .json({ error: "Employee not found" });
      }
    }


    const member = await MemberRepository.create({
      codEquipe,
      codFunc, //definindo null se for ausente ou invalido
      codTarefa: codTarefa || null, //definindo null se for ausente ou invalido
    });

    response.status(201).json(member);
  }

  async update() {
    //Atualizar um registro existente
    const {id} = request.params;

    member = await MemberRepository.update();
    response.json(member);
  }

  async delete(request, response) {
    const {id} = request.params;
    member = await MemberRepository.delete();
    response.json(member);
  }

}
module.exports = new Member();
