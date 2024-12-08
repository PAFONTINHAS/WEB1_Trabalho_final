const { query } = require("express");
const EmployeeRepository = require("../repositories/EmployeeRepository");
var employee;
class Employee {
  async index(request, response) {
    // Listar todos os registros
    employee = await EmployeeRepository.findAll();
    response.json(employee);
  }

  async show(request, response) {
    // Obter um registro
    const { id } = request.params;

    employee = await EmployeeRepository.findById(id);
    //Verificando se o Id enviado na requisição pertence a algum contato
    if (!employee) {
      return response.status(404).json({ error: "Employee not found!" });
    }
    response.json(employee);
  }

  async showByPermission(request, response){
    const {id} = request.params;
    employee = await EmployeeRepository.findByPermission(id);

    if(!employee){
      return response.status(404).json({ error: "Permission not found!" });

    }

    response.json(employee);


  }

  async store(request, response) {
    const { nomeFunc, emailFunc, cargo, codPermissao} = request.body;
    // Definindo regra de que email é obrigatório
    if (!emailFunc) {
      return response.status(400).json({ error: "email is required" });
    }
    if(!codPermissao){
      return response.status(400).json({ error: "acess code is required" });

    }

    //Definindo que e-mail deve ser único para cada contato mas não obrigatório
    if (emailFunc) {
      const employeeByEmail = await EmployeeRepository.findByEmail(emailFunc);
      if (employeeByEmail) {
        return response
          .status(400)
          .json({ error: "This e-mail is already in use" });
      }
    }

    const employee = await EmployeeRepository.create({
      nomeFunc,
      emailFunc: emailFunc || null, //definindo null se for ausente ou invalido
      cargo,
      codPermissao: codPermissao , //definindo null se for ausente ou invalido
    });

    response.status(201).json(employee);

  }



  async update(request, response) {
    //Atualizar um registro existente
    const {id} = request.params;
    const updatedData = request.body;

    const currentEmployee = await EmployeeRepository.findById(id);

    if(!currentEmployee){
      return response.status(404).json({ error: "Employee not found!" });
    }

    // Verificar as diferenças entre os dados atuais e os novos
    const updatedFields = {};
    for (const key in updatedData) {
      if (updatedData[key] !== currentEmployee[key]) {
        updatedFields[key] = updatedData[key];
      }
    }

    // Caso não haja campos diferentes, não há necessidade de atualizar
    if (Object.keys(updatedFields).length === 0) {
      return response.status(400).json({ message: "No changes detected!" });
    }


    // Atualizar os campos diferentes no banco
    await EmployeeRepository.update(id, updatedFields);


     response.json(employee);

  }

  async delete(request, response) {
    const {id} = request.params;
    employee = await EmployeeRepository.delete();
    response.json(employee);

  }

}
module.exports = new Employee();
