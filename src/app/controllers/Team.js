const TeamRepository= require("../repositories/TeamRepository");

class Team {
  async index(request, response) {
    // Listar todos os registros
    const teams = await ContactRepository.findAll();
    response.json(contacts);
  }

  async show(request, response) {
    const {id} = request.params; 
    const teams = await TeamRepository.findById(id); 
  //Verificando se o Id enviado na requisição pertence a algum contato

    if (!teams){
      return response.status(404).json({error:"Task não encontrada"}); 
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

}
module.exports = new Team();
