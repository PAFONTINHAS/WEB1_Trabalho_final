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

loadTeamInformation();



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
