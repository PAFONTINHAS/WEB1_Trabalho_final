const ContactRepository = require("../repositories/ContactRepository");

class ContactController {
  async index(request, response) {
    // Listar todos os registros
    const contacts = await ContactRepository.findAll();
    response.json(contacts);
  }

  async show(request, response) {
    // Obter um registro
    const { id } = request.params;

    const contact = await ContactRepository.findById(id);
    //Verificando se o Id enviado na requisição pertence a algum contato
    if (!contact) {
      return response.status(404).json({ error: "Contact not found!" });
    }
    response.json(contact);
  }

  async store(request, response) {
    const { name, email, phone, category_id } = request.body;
    // Definindo regra de que nome é obrigatório
    if (!name) {
      return response.status(400).json({ error: "Name is required" });
    }

    //Definindo que e-mail deve ser único para cada contato mas não obrigatório
    if (email) {
      const contactByEmail = await ContactRepository.findByEmail(email);
      if (contactByEmail) {
        return response
          .status(400)
          .json({ error: "This e-mail is already in use" });
      }
    }

    const contact = await ContactRepository.create({
      name,
      email: email || null, //definindo null se for ausente ou invalido
      phone,
      category_id: category_id || null, //definindo null se for ausente ou invalido
    });

    response.status(201).json(contact);
  }

  update() {
    //Atualizar um registro existente
  }

  async delete(request, response) {
    //Deletar um registro específico
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({ error: "Invalid contact id" });
    }
    await ContactRepository.delete(id);
    // 204: Not Content
    response.sendStatus(204);
  }
}
module.exports = new ContactController();
