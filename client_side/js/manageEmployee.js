
document.getElementById("applyFilters").addEventListener("click", async () => {
    const nivelAcesso = document.getElementById("nivelAcesso").value;
    const equipe = document.getElementById("equipe").value;

    const queryParams = new URLSearchParams();
    if (nivelAcesso) queryParams.append("nivelAcesso", nivelAcesso);
    if (equipe) queryParams.append("equipe", equipe);

    const response = await fetch(`${EmployeeURL}/filter?${queryParams}`);
    const employees = await response.json();

    const employeeList = document.getElementById("employeeList");
    employeeList.innerHTML = "";

    employees.forEach(employee => {
        const li = document.createElement("li");
        li.classList.add('listEmployee');

        li.innerHTML = `${employee.funcionario} - ${employee.email} - ${employee.cargo} - ${employee.descricao}

        <div>
            <button class="btnActions" data-action="edit" data-cod-func="${employee.codFunc}">
                <img src="./icons/pencil-fill.svg" alt="edit">
            </button>
            <button class="btnActions" data-action="delete" data-cod-func="${employee.codFunc}">
                <img src="./icons/trash.svg" alt="delete">
            </button>
        </div>
            `;
        employeeList.appendChild(li);

    });

    addEmployeeButtonEvents();
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("applyFilters").click();
});


// Função para adicionar eventos nos botões
function addEmployeeButtonEvents() {
    const buttons = document.querySelectorAll('.btnActions');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const action = event.target.closest('button').dataset.action;
            const codFunc = event.target.closest('button').dataset.codFunc;

            // Chama a função correspondente à ação
            if (action === 'edit') {
                editEmployee(codFunc);
                console.log("Editar funcionario código :", codFunc)
            } else if (action === 'delete') {
                deleteEmployee(codFunc);
                console.log("Deletar funcionario código :", codFunc)

            }
        });
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const addTaskBtn = document.getElementById("add-employee");
    const modalContainer = document.querySelector("#modal-add-employee-container");

    // Função para carregar o modal
    function loadModal() {
      fetch("../../client_side/modais/modalAddEmployee.html") // Caminho do arquivo HTML do modal
        .then((response) => {
          if (!response.ok) throw new Error("Erro ao carregar o modal.");
          return response.text();
        })
        .then((html) => {
          modalContainer.innerHTML = html; // Insere o HTML do modal no container

          // Exibir o modal
          const overlay = document.getElementById("add-employee-modal-overlay");
          if (overlay) {
            overlay.style.display = "flex"; // Torna o modal visível

            // Adiciona evento para fechar o modal quando clicar fora dele
            overlay.addEventListener("click", function (event) {
              if (event.target === overlay) {
                overlay.style.display = "none";
              }
            });
          }

        const cancelButton = document.getElementById("cancel-btn");
        if (cancelButton) {
            cancelButton.onclick = () => {
                overlay.style.display = "none";
            };
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

    const codEquipe = data.codEquipe;

    // Remove o campo codEquipe, já que ele não deve ser enviado ao servidor na criação do funcionário
    delete data.codEquipe;

    // Envia os dados para o servidor
    fetch(`${EmployeeURL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao enviar o Funcionário.");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Funcionário adicionado com sucesso:", result);

        // A partir do resultado, obtém o codFunc e chama addMember
        addMember(result.codFunc, codEquipe);

        // Fecha o modal após o sucesso
        const overlay = document.getElementById("modal-overlay");
        if (overlay) overlay.style.display = "none";
      })
      .catch((error) => {
        console.error("Erro ao enviar os dados:", error);
        alert("Erro ao adicionar o funcionário. Tente novamente.");
      });
  }


    // Adiciona evento de clique ao botão "Adicionar Tarefa"
    addTaskBtn.addEventListener("click", loadModal);
});



async function addMember(codFunc, codEquipe) {
fetch(`${memberURL}`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        "codFunc": codFunc,
        "codEquipe": codEquipe
    }),
    })

    .then((response) => {
    if (!response.ok) {
        throw new Error("Erro ao enviar o Membro.");
    }
    return response.json();
    })
    .then((result) => {
    console.log("Membro adicionado com sucesso:", result);
    })
    .catch((error) => console.error("Erro ao enviar os dados:", error));

}




async function editEmployee(codFunc) {
    const modalContainer = document.querySelector("#modal-edit-employee-container");

    // Carregar o modal
    const response = await fetch("../../client_side/modais/modalEditEmployee.html"); // Caminho do modal
    const html = await response.text();
    modalContainer.innerHTML = html;

    // Exibir o modal
    const overlay = document.getElementById("edit-employee-modal-overlay");
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
    const employeeResponse = await fetch(`${EmployeeURL}/${codFunc}`); // Endpoint para obter a tarefa
    const employee = await employeeResponse.json();

    // Preencher os campos do formulário
    document.querySelector('input[name="nomeFunc"]').value = employee.nomeFunc;
    document.querySelector('input[name="emailFunc"]').value = employee.emailFunc;
    document.querySelector('input[name="cargo"]').value = employee.cargo;
    document.querySelector('select[name="codPermissao"]').value = employee.codPermissao;
    document.querySelector('select[name="codEquipe"]').value = employee.codEquipe;

    // Adicionar evento de envio no formulário
    const form = document.querySelector("#edit-employee-modal-overlay form");
    form.addEventListener("submit", (event) => {
        handleEditSubmit(event, codFunc);
    });

    const cancelButton = document.getElementById('cancel-btn');
    if(cancelButton){
        cancelButton.onclick = () => {
            overlay.style.display = "none";
        };
    }
}

// Função para tratar o envio do formulário de edição
async function handleEditSubmit(event, codFunc) {
    event.preventDefault();

    // Coletar os dados do formulário
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    delete data.codEquipe;

    // Enviar os dados atualizados para o servidor
    try {
        const response = await fetch(`${EmployeeURL}/${codFunc}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Erro ao atualizar a tarefa.");

        console.log("Tarefa atualizada com sucesso!");

        // Atualizar a lista de tarefas
        const overlay = document.getElementById("edit-employee-modal-overlay");
        if (overlay) overlay.style.display = "none"; // Fecha o modal

        // Atualizar a lista de tarefas após edição (chame a função principal)
        // loadAllemployees(data.statusTarefa, "employee-list-id"); // Substitua pelo ID real da lista
    } catch (error) {
        console.error("Erro ao atualizar a funcionário:", error);
    }
}



async function deleteEmployee(codFunc) {
    const modalContainer = document.querySelector("#modal-delete-employee-container");

    // Carregar o modal
    const response = await fetch("../../client_side/modais/modalDeleteEmployee.html"); // Caminho do modal
    const html = await response.text();
    modalContainer.innerHTML = html;

    // Exibir o modal
    const overlay = document.getElementById("delete-employee-modal-overlay");
    if (overlay) {
        overlay.style.display = "flex";

        // Fechar o modal ao clicar fora dele
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) {
                overlay.style.display = "none";
            }
        });
    }

    const employeeData = await fetch(`${EmployeeURL}/${codFunc}`).then((res) => res.json());


    const employeeNameElement = document.getElementById("employee-name");

    if(employeeNameElement){
        employeeNameElement.textContent = employeeData.nomeFunc;
    }

    const deleteButton = document.getElementById("delete-btn");
    const cancelButton = document.getElementById("cancel-btn");

    if(deleteButton){
        deleteButton.onclick = async () => {
            // Atualizar o status da tarefa para "concluída"
            const deleteResponse = await fetch(`${EmployeeURL}/${codFunc}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (deleteResponse.ok) {
                alert("Funcionário excluido do sistema com sucesso!");
                overlay.style.display = "none";

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
