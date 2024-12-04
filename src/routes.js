const { Router } = require("express");
const task       = require('./app/controllers/TaskController')
const team       = require('./app/controllers/TeamController')
const member     = require('./app/controllers/MemberController')
const employee   = require('./app/controllers/EmployeeController')

const routes = Router();

// TASK ROUTES
routes.get("/task", task.index);
routes.get("/task/:id", task.show);
routes.post("/task", task.store);
routes.put("/task/:id", task.update);
routes.delete("/task/:id", task.delete);

// TEAM ROUTES
routes.get("/team", task.index);
routes.get("/team/:id", team.show);
routes.post("/team", team.store);
routes.put("/team/:id", team.update);
routes.delete("/team/:id", team.delete);

// MEMBER ROUTES
routes.get("/member", member.index);
routes.get("/member/:id", member.showByTeam);
routes.post("/member", member.store);
routes.put("/member/:id", member.update);
routes.delete("/member/:id", member.delete);

// EMPLOYEE ROUTES
routes.get("/employee", employee.index);
routes.get("/employee/:id", employee.show);
routes.post("/employee", employee.store);
routes.put("/employee/:id", employee.update);
routes.delete("/employee/:id", employee.delete);


module.exports = routes;
