const urlParams = new URLSearchParams(window.location.search);
const teamId = urlParams.get('id');

async function loadTeamInformation(){

  const response = await fetch(`${teamURL}/${teamId}`);
  const team = await response.json();

  const teamName = document.getElementById('team_name');
  const teamDesc = document.getElementById('team_desc');

  teamName.innerHTML = `${team.equipe}`;
  teamDesc.innerHTML = `${team.descricao}`;


}


async function loadTeamTasks(taskStatus, taskId){

  // Faz uma requisição para o backend para obter todas as tarefas
  const response = await fetch(`${teamURL}/${teamId}/tasks?status=${taskStatus}`);
  const tasks = await response.json();

  // Seleciona o elemento da lista
  const taskList = document.getElementById(taskId);

  // Limpa a lista antes de adicionar novos itens (se necessário)
  taskList.innerHTML = '';

  if(tasks.length === 0){
    const emptyMessage = document.createElement('li');
    emptyMessage.classList.add('task');
    emptyMessage.textContent = "Nenhuma tarefa disponível para este status.";
    taskList.appendChild(emptyMessage);
    return; // Sai da função
  }
  // Itera pelas tarefas e cria os elementos da lista
  tasks.forEach(task => {
      // Cria o elemento <li> para a tarefa
      const listItem = document.createElement('li');
      listItem.classList.add('task');

      const dataInicio = convertData(task.dataInicio);
      const dataLimite = convertData(task.dataLimite);


      // Adiciona o texto da tarefa
      listItem.innerHTML = `
              <h3>${task.titulo}</h3>
              <p>Equipe: ${task.equipe}</p>
              <p>Prazo Inicial: ${dataInicio}</p>
              <p>Prazo Final: ${dataLimite}</p>
              <p>Criado Por:  ${task.funcionario}</p>
          <div>
              <button class="btnActions" data-action="edit" data-task-id="${task.codTarefa}">
                  <img src="./icons/pencil-fill.svg" alt="edit">
              </button>
              <button class="btnActions" data-action="finish" data-task-id="${task.codTarefa}">
                  <img src="./icons/check-lg.svg" alt="finish">
              </button>
              <button class="btnActions" data-action="delete" data-task-id="${task.codTarefa}">
                  <img src="./icons/trash.svg" alt="delete">
              </button>
          </div>
      `;

      // Adiciona o item à lista
      taskList.appendChild(listItem);
  });

  // Adiciona eventos aos botões (edit, finish, delete)
  // addTaskButtonEvents();

}

async function loadManagers(){
    // Faz uma requisição para o backend para obter todas as tarefas
    const response = await fetch(`${teamURL}/managers/${teamId}`);
    const managers = await response.json();

    // Seleciona o elemento da lista
    const managerList = document.getElementById('manager_list');

    // Limpa a lista antes de adicionar novos itens (se necessário)
    managerList.innerHTML = '';

    // Itera pelas tarefas e cria os elementos da lista
    managers.forEach(manager => {
        // Cria o elemento <li> para a tarefa
        const listItem = document.createElement('p');
        listItem.classList.add('manager');

        // Adiciona o texto da tarefa
        listItem.innerHTML = `
               ${manager.supervisor} - ${manager.descricao}
        `;

        // Adiciona o item à lista
        managerList.appendChild(listItem);
    });

    // Adiciona eventos aos botões (edit, finish, delete)
    // addTaskButtonEvents();

}
async function loadMembers(){
    // Faz uma requisição para o backend para obter todas as tarefas
    const response = await fetch(`${teamURL}/members/${teamId}`);
    const members = await response.json();

    // Seleciona o elemento da lista
    const memberList = document.getElementById('member_list');

    // Limpa a lista antes de adicionar novos itens (se necessário)
    memberList.innerHTML = '';

    // Itera pelas tarefas e cria os elementos da lista
    members.forEach(member => {
        // Cria o elemento <li> para a tarefa
        const listItem = document.createElement('p');
        listItem.classList.add('member');

        // Adiciona o texto da tarefa
        listItem.innerHTML = `
               ${member.membro} - ${member.descricao}
        `;

        // Adiciona o item à lista
        memberList.appendChild(listItem);
    });
}

loadTeamInformation();
loadManagers();
loadMembers();
loadTeamTasks('pendente','pending_task_list');
loadTeamTasks('em-andamento','ongoing_task_list');
loadTeamTasks('esperando-aprovacao','awaiting_task_list');
loadTeamTasks('concluida','finished_task_list');




document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".tab-button");
  const taskContainers = document.querySelectorAll(".taskBox");

  filterButtons.forEach(button => {
      button.addEventListener("click", () => {
          const status = button.getAttribute("data-status");

          // Ocultar todas as taskBoxes
          taskContainers.forEach(container => container.style.display = "none");

          // Exibir apenas a div correspondente
          const selectedContainer = document.getElementById(status);

          if (selectedContainer) {
              selectedContainer.style.display = "block";
          }

      });
  });
});



document.addEventListener("DOMContentLoaded", function () {
  const openModalBtn = document.getElementById("open-modal-btn");
  const modalContainer = document.getElementById("modal-container");

  // Função para carregar o modal dinamicamente
  function loadModal() {
    fetch("./modaladdmember.html") // Caminho relativo para o modal
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao carregar o modal.");
        return response.text();
      })
      .then((html) => {
        modalContainer.innerHTML = html; // Insere o HTML do modal no container

        // Exibir o modal
        const overlay = document.getElementById("overlay");
        if (overlay) {
          overlay.style.display = "flex";

          // Adicionar evento para fechar o modal clicando fora dele
          overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
              overlay.style.display = "none";
            }
          });

          // Adicionar evento de clique no botão de "Adicionar Membro"
          const adicionarBtn = document.getElementById("adicionar-btn");
          if (adicionarBtn) {
            adicionarBtn.addEventListener("click", function () {
              // Aqui você pode adicionar a lógica para realmente adicionar o membro
              console.log("Membro Adicionado");

              // Fechar o modal após adicionar o membro
              overlay.style.display = "none";
            });
          }
        }
      })
      .catch((error) => console.error("Erro ao carregar o modal:", error));
  }

  // Adiciona evento ao botão de abrir o modal
  openModalBtn.addEventListener("click", loadModal);
});

document.addEventListener("DOMContentLoaded", function () {
  const addTaskBtn = document.getElementById("add-task");
  const modalContainer = document.querySelector("#modal-add-task-container");

  // Função para carregar o modal
  function loadModal() {
    fetch("./modaladdtask.html") // Caminho do arquivo HTML do modal
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao carregar o modal.");
        return response.text();
      })
      .then((html) => {
        modalContainer.innerHTML = html; // Insere o HTML do modal no container

        // Exibir o modal
        const overlay = document.getElementById("modal-overlay");
        if (overlay) {
          overlay.style.display = "flex"; // Torna o modal visível

          // Adiciona evento para fechar o modal quando clicar fora dele
          overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
              overlay.style.display = "none";
            }
          });
        }
      })
      .catch((error) => console.error("Erro ao carregar o modal:", error));
  }

  // Adiciona evento de clique ao botão "Adicionar Tarefa"
  addTaskBtn.addEventListener("click", loadModal);
});
