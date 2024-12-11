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
  addTaskButtonEvents();

}


// Função para adicionar eventos nos botões
function addTaskButtonEvents() {
  const buttons = document.querySelectorAll('.btnActions');
  buttons.forEach(button => {
      button.addEventListener('click', (event) => {
          const action = event.target.closest('button').dataset.action;
          const taskId = event.target.closest('button').dataset.taskId;

          // Chama a função correspondente à ação
          if (action === 'edit') {
              editTask(taskId);
          } else if (action === 'finish') {
              finishTask(taskId);
          } else if (action === 'delete') {
              deleteTask(taskId);
          }
      });
  });
}


async function finishTask(taskId) {
  const modalContainer = document.querySelector("#modal-finish-task-container");

  // Carregar o modal
  const response = await fetch("../../client_side/modais/modalFinishTask.html"); // Caminho do modal
  const html = await response.text();
  modalContainer.innerHTML = html;

  // Exibir o modal
  const overlay = document.getElementById("finish-modal-overlay");
  if (overlay) {
      overlay.style.display = "flex";

      // Fechar o modal ao clicar fora dele
      overlay.addEventListener("click", (event) => {
          if (event.target === overlay) {
              overlay.style.display = "none";
          }
      });
  }

  const taskData = await fetch(`${taskURL}/${taskId}`).then((res) => res.json());


  const taskNameElement = document.getElementById("task-name");

  if(taskNameElement){
      taskNameElement.textContent = taskData.titulo;
  }

  const finalizeButton = document.getElementById("finalize-btn");
  const cancelButton = document.getElementById("cancel-btn");

  if(finalizeButton){
      finalizeButton.onclick = async () => {
          // Atualizar o status da tarefa para "concluída"
          const updateResponse = await fetch(`${taskURL}/${taskId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ statusTarefa: "concluida" }),
          });

          if (updateResponse.ok) {
              alert("Tarefa finalizada com sucesso!");
              overlay.style.display = "none";
              // Atualize a interface com a lista de tarefas
              loadAllTasks(); // Recarregar a lista de tarefas
          } else {
              alert("Erro ao finalizar a tarefa. Tente novamente.");
          }
      };
  }

  if (cancelButton) {
      cancelButton.onclick = () => {
          overlay.style.display = "none";
      };
  }


}


async function deleteTask(taskId) {
  const modalContainer = document.querySelector("#modal-delete-task-container");

  // Carregar o modal
  const response = await fetch("../../client_side/modais/modalDeleteTask.html"); // Caminho do modal
  const html = await response.text();
  modalContainer.innerHTML = html;

  // Exibir o modal
  const overlay = document.getElementById("delete-modal-overlay");
  if (overlay) {
      overlay.style.display = "flex";

      // Fechar o modal ao clicar fora dele
      overlay.addEventListener("click", (event) => {
          if (event.target === overlay) {
              overlay.style.display = "none";
          }
      });
  }

  const taskData = await fetch(`${taskURL}/${taskId}`).then((res) => res.json());


  const taskNameElement = document.getElementById("task-name");

  if(taskNameElement){
      taskNameElement.textContent = taskData.titulo;
  }

  const deleteButton = document.getElementById("delete-btn");
  const cancelButton = document.getElementById("cancel-btn");

  if(deleteButton){
      deleteButton.onclick = async () => {
          // Atualizar o status da tarefa para "concluída"
          const deleteResponse = await fetch(`${taskURL}/${taskId}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
          });

          if (deleteResponse.ok) {
              alert("Tarefa deletada com sucesso!");
              overlay.style.display = "none";
              // Atualize a interface com a lista de tarefas
              loadAllTasks(); // Recarregar a lista de tarefas
          } else {
              alert("Erro ao deletada a tarefa. Tente novamente.");
          }
      };
  }

  if (cancelButton) {
      cancelButton.onclick = () => {
          overlay.style.display = "none";
      };
  }


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



// Carregar os funcionários assim que a página carregar

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
  const addTaskBtn = document.getElementById("add-task");
  const modalContainer = document.querySelector("#modal-add-task-container");

  // Função para carregar o modal
  function loadModal() {
    fetch("../../client_side/modais/modalAddTask.html") // Caminho do arquivo HTML do modal
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao carregar o modal.");
        return response.text();
      })
      .then((html) => {
        modalContainer.innerHTML = html; // Insere o HTML do modal no container

        // Exibir o modal
        const overlay = document.getElementById("modal-overlay");
        const nomeEquipe = document.getElementById('nomeEquipe');
        if(nomeEquipe){
          nomeEquipe.style.display = "none";
        }
        if (overlay) {
          overlay.style.display = "flex"; // Torna o modal visível

          // Adiciona evento para fechar o modal quando clicar fora dele
          overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
              overlay.style.display = "none";
            }
          });
        }

        // Adiciona evento ao botão de envio do formulário
        const form = document.querySelector("#modal-overlay form");
        form.addEventListener("submit", handleSubmit);
      })
      .catch((error) => console.error("Erro ao carregar o modal:", error));
  }

  // Função para tratar o envio do formulário
  function handleSubmit(event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const formData = new FormData(event.target);

    const codEquipe = teamId;

    formData.append("codEquipe", codEquipe);
    const data = Object.fromEntries(formData.entries());

    // Envia os dados para o servidor
    fetch(`${taskURL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao enviar a tarefa.");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Tarefa adicionada com sucesso:", result);
        const overlay = document.getElementById("modal-overlay");
        if (overlay) overlay.style.display = "none"; // Fecha o modal
      })
      .catch((error) => console.error("Erro ao enviar os dados:", error));
  }

  // Adiciona evento de clique ao botão "Adicionar Tarefa"
  addTaskBtn.addEventListener("click", loadModal);
});





