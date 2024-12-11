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
    const {nomeEquipe,descricao}=request.body;
    if(!nomeEquipe){
      return response.status(400).json({error:"Obrigatório colocar nome"});
    }
    const team = await TeamRepository.create({
      nomeEquipe, descricao
    })
    response.status(201).json(team);
  }

  async update(request,response) {
    const {id} = request.params;
    const updatedData = request.body;
    const teams = await TeamRepository.findById(id);

    if (!teams){
      return response.status(404).json({error:"Equipe não encontrada"});
    }
    // Verificar as diferenças entre os dados atuais e os novos
    const updatedFields = {};
    for (const key in updatedData) {
      if (updatedData[key] !== teams[key]) {
        updatedFields[key] = updatedData[key];
      }
  }
  // Caso não haja campos diferentes, não há necessidade de atualizar
  if (Object.keys(updatedFields).length === 0) {
    return response.status(400).json({ message: "Nenhuma mudança detectada" });
  }
  // Atualizar os campos diferentes no banco
  await TeamRepository.update(id, updatedFields);
  response.json(teams);
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


  async showTasks(request, response){
    const {id} = request.params;

    const task = await TaskRepository.findTasksByTeam(id);
    if (!task) {
      return response.status(400).json({ error: "Equipe não encontrada" });
    }
    // 204: Not Content
    response.json(task);
  }

}
module.exports = new Team();
