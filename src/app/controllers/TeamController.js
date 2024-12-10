const TeamRepository= require("../repositories/TeamRepository");
const MemberRepository= require("../repositories/MemberRepository");
const TaskRepository = require("../repositories/TaskRepository");

class Team {
  async index(request, response) {
    // Listar todos os registros
    const teams = await TeamRepository.findAll();
    response.json(teams);
  }

  async show(request, response) {
    const {id} = request.params;
    const teams = await TeamRepository.findById(id);
  //Verificando se o Id enviado na requisição pertence a algum contato

    if (!teams){
      return response.status(404).json({error:"Equipe não encontrada"});
    }
    response.json(teams);
  }

  async store(request, response) {
    const {nome}=request.body;
    if(!nome){
      return response.status(400).json({error:"Obrigatório colocar nome"});
    }
    const team = await TeamRepository.create({
      nome
    })
    response.status(201).json(team);
  }

  async update(request,response) {
    //Atualizar um registro existente
    const {id} = request.params;
    const team = await TeamRepository.findById(id);
    if (!team){
      return response.status(404).json({error:"Equipe não encontrada"});
    }
    await TeamRepository.update(id);
    response.sendStatus(204);
  }

  async delete(request, response) {
    const {id} = request.params;
    if (!id) {
      return response.status(400).json({ error: "Equipe não encontrada" });
    }
    await TeamRepository.delete(id);
    // 204: Not Content
    response.sendStatus(204);
  }


  // async showTasks(request, response){
  //   const {id} = request.params;

  //   const status = request.query.status;

  //   const task = await TaskRepository.findTasksByTeam(id);
  //   if (!task) {
  //     return response.status(400).json({ error: "Equipe não encontrada" });
  //   }
  //   // 204: Not Content
  //   response.json(task);
  // }

  async showTasks(request, response) {
    const { id } = request.params; // ID da equipe
    const { status } = request.query; // Status da tarefa (opcional)

    try {
      // Busca as tarefas da equipe pelo ID e, se fornecido, pelo status
      const tasks = await TaskRepository.findTasksByTeam(id, status);

      if (!tasks || tasks.length === 0) {
        return response.status(204).json({ message: "Nenhuma tarefa encontrada" }); // 204: No Content
      }

      response.json(tasks);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Erro ao buscar tarefas" }); // Erro no servidor
    }
  }

  async showMembers(request, response){

    const { teamId } = request.params;
    const members = await MemberRepository.findMembersByTeam(teamId);

    if(!members){
      return response.status(404).json({message: "Equipe não encontrada"});
    }

    response.json(members);
  }

  async showManagers(request, response){
    const { teamId } = request.params;
    const members = await MemberRepository.findManagersByTeam(teamId);

    if(!members){
      return response.status(404).json({message: "Equipe não encontrada"});
    }

    response.json(members);
  }


}
module.exports = new Team();
