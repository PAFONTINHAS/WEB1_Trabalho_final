

document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filterButton");
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


async function loadAllTasks(taskStatus, taskId) {
    // Faz uma requisição para o backend para obter todas as tarefas
    const response = await fetch(`${taskURL}/status/${taskStatus}`);
    const tasks = await response.json();

    // Seleciona o elemento da lista
    const taskList = document.getElementById(taskId);

    // Limpa a lista antes de adicionar novos itens (se necessário)
    taskList.innerHTML = '';

    // Itera pelas tarefas e cria os elementos da lista
    tasks.forEach(task => {
        // Cria o elemento <li> para a tarefa
        const listItem = document.createElement('li');
        listItem.classList.add('listTask');

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

// Funções de exemplo para as ações (substitua pelo comportamento real)
function editTask(taskId) {
    console.log(`Editar tarefa com ID: ${taskId}`);
    // Implemente a lógica de edição
}

function finishTask(taskId) {
    const finishModal = document.getElementById('finish_modal')

    if(finishModal){
        // finishModal.style.display = "block";
    }

    finishModal.innerHTML = '';
    console.log(`Concluir tarefa com ID: ${taskId}`);


    // Implemente a lógica para concluir a tarefa
}

function deleteTask(taskId) {
    console.log(`Excluir tarefa com ID: ${taskId}`);
    // Implemente a lógica para excluir a tarefa
}

loadAllTasks('pendente', 'pending_task_list');
loadAllTasks('em-andamento', 'ongoing_task_list');
loadAllTasks('esperando-aprovacao', 'awaiting_task_list');
loadAllTasks('concluida', 'finished_task_list');





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
