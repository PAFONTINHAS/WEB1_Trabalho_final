const TaskRepository = require("../repositories/TaskRepository");

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
    const {titulo, equipe, membros, data_inicio, data_limite, status, criador} = request.body;
  // é obrigatório título, data_inicio, data_limite na task, se não tiver retorne 400
  if((!titulo) || (!data_inicio) || (!data_limite)){
    return response.status(400).json({error:"Dados incompletos"});
  }
  //Task tem que ter equipe, se equipe existir, procure a equipe no banco.
  //Se equipe não estiver cadastrada no banco, cancela a req e retorna 400
  if(equipe){
    const tasksByEquipe = await TaskRepository.findByEquipe(equipe);
    if(!tasksByEquipe){
      return response.status(400).json({erro:"Essa equipe não existe "})
    }
  }
    const tasks = await TaskRepository.create({
      titulo,
      equipe: equipe || null,
      membros: membros || null,
      data_inicio,
      data_limite,
      status,
      criador
    })
    response.status(201).json(tasks);
  }

  async update(request,response) {
    //Atualizar um registro existente
    const {id} = request.params;
    const tasks = await TaskRepository.findById(id);
    if (!tasks){
      return response.status(404).json({error:"Task não encontrada"});
    }
    await TaskRepository.update(id);
    response.sendStatus(204);
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
