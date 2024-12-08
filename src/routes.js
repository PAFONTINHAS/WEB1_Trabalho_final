const { Router } = require("express");
const task       = require('./app/controllers/TaskController')
const team       = require('./app/controllers/TeamController')
const member     = require('./app/controllers/MemberController')
const employee   = require('./app/controllers/EmployeeController')

const routes = Router();

// TASK ROUTES
routes.get("/tasks", task.index);
routes.get("/tasks/count", task.countAllTasks)
routes.get("/tasks/latest_tasks", task.showLatestTasks)
routes.get("/tasks/status", task.showTaskCountByStatus)
// routes.get("/tasks/status/:status", task.showTasksByStatus)
routes.get("/tasks/:id", task.show);
routes.post("/tasks", task.store);
routes.put("/tasks/:id", task.update);
routes.delete("/tasks/:id", task.delete);

// TEAM ROUTES
routes.get("/teams", task.index);
routes.get("/teams/:id", team.show);
routes.post("/teams", team.store);
routes.put("/teams/:id", team.update);
routes.delete("/teams/:id", team.delete);

// MEMBER ROUTES
routes.get("/members", member.index);
routes.get("/members/no_tasks", member.showNoTasks);
routes.get("/members/with_tasks", member.showMemberCountByTasks);
routes.get("/members/status", member.showMemberCountByStatus);
routes.get("/members/codEquipe/:id", member.showByTeam);
routes.get("/members/codFunc/:id", member.showAllMembersTeam);
routes.get("/members/:id", member.showByMember);
routes.post("/members", member.store);
routes.put("/members/:id", member.update);
routes.delete("/members/:id", member.delete);

// EMPLOYEE ROUTES
routes.get("/employees", employee.index);
routes.get("/employees/:id", employee.show);
routes.get("/employees/codPermissao/:id", employee.showByPermission);
routes.post("/employees", employee.store);
routes.put("/employees/:id", employee.update);
routes.delete("/employees/:id", employee.delete);


module.exports = routes;
