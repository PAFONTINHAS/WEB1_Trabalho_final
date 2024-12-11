

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
                console.log("Editar tarefa código :", taskId)
            } else if (action === 'finish') {
                finishTask(taskId);
                console.log("finalizar tarefa código :", taskId)

            } else if (action === 'delete') {
                deleteTask(taskId);
                console.log("Deletar tarefa código :", taskId)

            }
        });
    });
}

// Funções de exemplo para as ações (substitua pelo comportamento real)
// Função para editar uma tarefa (abrir o modal e preencher os dados)
async function editTask(taskId) {
    const modalContainer = document.querySelector("#modal-edit-task-container");

    // Carregar o modal
    const response = await fetch("../../client_side/modais/modalEditTask.html"); // Caminho do modal
    const html = await response.text();
    modalContainer.innerHTML = html;

    // Exibir o modal
    const overlay = document.getElementById("modal-overlay");
    if (overlay) {
        overlay.style.display = "flex";

        // Fechar o modal ao clicar fora dele
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) {
                overlay.style.display = "none";
            }
        });
    }

    // Carregar os dados da tarefa
    const taskResponse = await fetch(`${taskURL}/${taskId}`); // Endpoint para obter a tarefa
    const task = await taskResponse.json();

    // Preencher os campos do formulário
    document.querySelector('input[name="titulo"]').value = task.titulo;
    document.querySelector('textarea[name="descricao"]').value = task.descricao;
    document.querySelector('input[name="dataInicio"]').value = task.dataInicio.split('T')[0];
    document.querySelector('input[name="dataLimite"]').value = task.dataLimite.split('T')[0];
    document.querySelector('select[name="statusTarefa"]').value = task.statusTarefa;
    document.querySelector('select[name="codEquipe"]').value = task.codEquipe;

    // Adicionar evento de envio no formulário
    const form = document.querySelector("#modal-overlay form");
    form.addEventListener("submit", (event) => {
        handleEditSubmit(event, taskId);
    });

    const cancelButton = document.getElementById('cancel-btn');
    if(cancelButton){
        cancelButton.onclick = () => {
            overlay.style.display = "none";
        };
    }
}

// Função para tratar o envio do formulário de edição
async function handleEditSubmit(event, taskId) {
    event.preventDefault();

    // Coletar os dados do formulário
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Enviar os dados atualizados para o servidor
    try {
        const response = await fetch(`${taskURL}/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Erro ao atualizar a tarefa.");

        console.log("Tarefa atualizada com sucesso!");

        // Atualizar a lista de tarefas
        const overlay = document.getElementById("modal-overlay");
        if (overlay) overlay.style.display = "none"; // Fecha o modal

        // Atualizar a lista de tarefas após edição (chame a função principal)
        // loadAllTasks(data.statusTarefa, "task-list-id"); // Substitua pelo ID real da lista
    } catch (error) {
        console.error("Erro ao atualizar a tarefa:", error);
    }
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

loadAllTasks('pendente', 'pending_task_list');
loadAllTasks('em-andamento', 'ongoing_task_list');
loadAllTasks('esperando-aprovacao', 'awaiting_task_list');
loadAllTasks('concluida', 'finished_task_list');



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




