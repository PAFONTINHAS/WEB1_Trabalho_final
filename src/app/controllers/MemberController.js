const { query } = require("express");
const MemberRepository = require("../repositories/MemberRepository");
const EmployeeRepository = require("../repositories/EmployeeRepository");
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

  async showByMember(request, response){
    // Obter um registro
    const { id } = request.params;

    member = await MemberRepository.findById(id);
    //Verificando se o Id enviado na requisição pertence a algum contato
    if (!member) {
      return response.status(404).json({ error: "Member not found!" });
    }
    response.json(member);

  }

  async showAllMembersTeam(request, response){
    // Obter um registro
    const { id } = request.params;

    member = await MemberRepository.findByMember(id);
    //Verificando se o Id enviado na requisição pertence a algum contato
    if (!member) {
      return response.status(404).json({ error: "Member not found!" });
    }
    response.json(member);

  }
  async showNoTasks(request, response){
    // Obter um registro

    member = await MemberRepository.countMembersWithoutTasks();

    response.json(member);

  }


  async showMemberCountByStatus(request, response){

    const memberStatus = await EmployeeRepository.findEmployeeCountByStatus();

    response.json(memberStatus);

  }
  async showMemberCountByTasks(request, response){

    const memberStatus = await MemberRepository.findMemberCountByTasks();

    response.json(memberStatus);

  }



  async store(request, response) {
    const { codEquipe, codFunc, codTarefa} = request.body;

    if(codEquipe){
      const queryTeam = await MemberRepository.searchTeam(codEquipe);
      if (!queryTeam) {
        return response
          .status(404)
          .json({ error: "Team not found" });
      }
    }
    if(codFunc){
      const queryFunc = await EmployeeRepository.findById(codFunc);
      if (!queryFunc) {
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
    const updatedData = request.body;

    const currentMember = await MemberRepository.findById(id);

    if(!currentMember){
      return response.status(404).json({ error: "Member not found!" });
    }

    // Verificar as diferenças entre os dados atuais e os novos
    const updatedFields = {};
    for (const key in updatedData) {
      if (updatedData[key] !== currentMember[key]) {
        updatedFields[key] = updatedData[key];
      }
    }

    // Caso não haja campos diferentes, não há necessidade de atualizar
    if (Object.keys(updatedFields).length === 0) {
      return response.status(400).json({ message: "No changes detected!" });
    }


    // Atualizar os campos diferentes no banco
    await MemberRepository.update(id, updatedFields);


     response.json(member);

  }

  async delete(request, response) {
    const {id} = request.params;
    member = await MemberRepository.delete();
    response.json(member);
  }

}
module.exports = new Member();
