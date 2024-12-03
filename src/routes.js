const { Router } = require("express");
const Task       = require('./app/controllers/Task')
const Team       = require('./app/controllers/Team')
const Member     = require('./app/controllers/Member')
const Employee   = require('./app/controllers/Employee')

const routes = Router();

// TASK ROUTES
routes.get("/task", Task.index);
routes.get("/task/:id", Task.show);
routes.post("/task", Task.store);
routes.put("/task/:id", Task.update);
routes.delete("/task/:id", Task.delete);

// TEAM ROUTES
routes.get("/Team", Team.index);
routes.get("/Team/:id", Team.show);
routes.post("/Team", Team.store);
routes.put("/Team/:id", Team.update);
routes.delete("/Team/:id", Team.delete);

// MEMBER ROUTES
routes.get("/Member", Member.index);
routes.get("/Member/:id", Member.show);
routes.post("/Member", Member.store);
routes.put("/Member/:id", Member.update);
routes.delete("/Member/:id", Member.delete);

// EMPLOYEE ROUTES
routes.get("/Employee", Employee.index);
routes.get("/Employee/:id", Employee.show);
routes.post("/Employee", Employee.store);
routes.put("/Employee/:id", Employee.update);
routes.delete("/Employee/:id", Employee.delete);


module.exports = routes;
