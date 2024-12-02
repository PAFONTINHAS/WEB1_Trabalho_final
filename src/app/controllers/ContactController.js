const ContactRepository = require('../repositories/ContactRepository')

class ContactController{
    async index(request, response){
        const contacts = await ContactRepository.findAll()
        response.json(contacts) 
    }

   async show(request, response){
        const {id} = request.params

        const contact = await ContactRepository.findById(id)
        if(!contact){
            return response.status(404).json({error: "Contact not found!"})
        }
        response.status(200).json(contact)
    }

    store(){
        //CADASTRAR UM CONTATO
    }

    update(){
        //ATUALIZAR UM CONTATO
    }

    delete(){
        //DELETAR UM CONTATO
    }

}

module.exports = new ContactController();