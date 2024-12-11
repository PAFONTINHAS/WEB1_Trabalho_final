const TaskRepository = require("../repositories/TaskRepository");
const TeamRepository = require("../repositories/TeamRepository");

class Task {
  //listar todos os registros
  async index(request, response) {
    // Listar todos os registros
    const tasks = await TaskRepository.findAll();
    response.json(tasks);
  }
//read
  async show(request, response) {
    const {id} = request.params;
    const tasks = await TaskRepository.findById(id);
  //Verificando se o Id enviado na requisição pertence a algum contato

    if (!tasks){
      return response.status(404).json({error:"Task não encontrada"});
    }
    response.json(tasks);

  }

  async showTaskCountByStatus(request, response){

    const taskStatus = await TaskRepository.countTasksByStatus();

    response.json(taskStatus);

  }
  async countAllTasks(request, response){

    const taskStatus = await TaskRepository.countAllTasks();

    response.json(taskStatus);

  }

  async showLatestTasks(request, response){
    const latestTasks = await TaskRepository.findLatestTasks();

    response.json(latestTasks);
  }

  async showTasksByStatus(request, response){

    const {status} = request.params;

    const tasksByStatus = await TaskRepository.findTasksByStatus(status);

    if(!tasksByStatus){
      return response.status(404).json({error:"Status não encontrado"});

    }

    response.json(tasksByStatus);
  }


//create
  async store(request, response) {
    const {titulo, descricao, dataInicio, dataLimite, statusTarefa, codCriador, codEquipe} = request.body;
  // é obrigatório título, data_inicio, data_limite na task, se não tiver retorne 400
  if((!titulo) || (!dataInicio) || (!dataLimite)){
    return response.status(400).json({error:"Dados incompletos"});
  }
  //Task tem que ter equipe, se equipe existir, procure a equipe no banco.
  //Se equipe não estiver cadastrada no banco, cancela a req e retorna 400
  console.log(titulo, descricao, dataInicio, dataLimite, statusTarefa, codCriador,codEquipe);
  if(codEquipe){
    const tasksByEquipe = await TeamRepository.findById(codEquipe);
    if(!tasksByEquipe){
      return response.status(400).json({erro:"Essa equipe não existe "})
    }
  }

  const creatorId = codCriador || 13;

    const tasks = await TaskRepository.create({
      titulo,
      descricao,
      dataInicio,
      dataLimite,
      statusTarefa,
      codCriador: creatorId,
      codEquipe
    })
    response.status(201).json(tasks);
  }

  async update(request,response) {
    //Atualizar um registro existente
    const {id} = request.params;
    const updatedData = request.body;

    const tasks = await TaskRepository.findById(id);

    if (!tasks){
      return response.status(404).json({error:"Task não encontrada"});
    }

    // Verificar as diferenças entre os dados atuais e os novos
    const updatedFields = {};
    for (const key in updatedData) {
      if (updatedData[key] !== tasks[key]) {
        updatedFields[key] = updatedData[key];
      }
    }

    // Caso não haja campos diferentes, não há necessidade de atualizar
    if (Object.keys(updatedFields).length === 0) {
      return response.status(400).json({ message: "Nenhuma mudança detectada" });
    }



    await TaskRepository.update(id,updatedFields);
    response.json(tasks);
  }

  async delete(request, response) {
    const {id} = request.params;
    if (!id) {
      return response.status(400).json({ error: "Task não encontrada" });
    }
    await TaskRepository.delete(id);
    // 204: Not Content
    response.sendStatus(204);
  }

}
module.exports = new Task();
