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

    employee = await EmployeeRepository.update();
    response.json(employee);

  }

  async delete(request, response) {
    const {id} = request.params;
    employee = await EmployeeRepository.delete();
    response.json(employee);

  }

}
module.exports = new Employee();