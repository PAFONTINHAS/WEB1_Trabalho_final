const apiUrl = 'http://localhost:3000/employees'; // Ajuste para a rota correta no seu backend

// Função para carregar funcionários
async function loadEmployees() {
  try {
    // Requisição para o back-end
    const response = await fetch(apiUrl);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    // Converte a resposta para JSON
    const employees = await response.json();

    // Seleciona o container onde os dados serão exibidos
    const employeeContainer = document.getElementById('employee');
    employeeContainer.innerHTML = ''; // Limpa o conteúdo antigo

    // Itera sobre os dados e cria os elementos HTML
    employees.forEach((employee) => {
      const employeeElement = document.createElement('div');
      employeeElement.classList.add('employee');
      employeeElement.innerHTML = `
        <div>
          <strong>Nome:</strong> ${employee.nomeFunc} <br>
          <strong>Email:</strong> ${employee.emailFunc} <br>
          <strong>Cargo:</strong> ${employee.cargo} <br>
          <strong>Nível de Acesso:</strong> ${employee.permissao}
          <hr>
        </div>
      `;
      employeeContainer.appendChild(employeeElement);
    });
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error);
  }
}

// Carrega os dados ao iniciar
loadEmployees();



// Função para adicionar um novo funcionário
async function addEmployee(event) {
    event.preventDefault(); // Evita o reload da página ao enviar o formulário

    // Captura os dados do formulário
    const nomeFunc = document.getElementById('nomeFunc').value;
    const emailFunc = document.getElementById('emailFunc').value;
    const cargo = document.getElementById('cargo').value;
    const codPermissao = document.getElementById('codPermissao').value;

    const newEmployee = {
        nomeFunc,
        emailFunc,
        cargo,
        codPermissao: Number(codPermissao), // Certifica que o valor é numérico
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST', // Requisição POST para adicionar um funcionário
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmployee),
        });

        if (response.ok) {
            alert('Funcionário adicionado com sucesso!');
            document.getElementById('employeeForm').reset(); // Limpa o formulário
            loadEmployees(); // Recarrega a lista de funcionários
        } else {
            const errorData = await response.json();
            alert(`Erro ao adicionar funcionário: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Erro ao adicionar o funcionário:', error);
    }
}

// Inicializa as funções
document.getElementById('employeeForm').addEventListener('submit', addEmployee);
loadEmployees(); // Carrega os funcionários ao abrir a página
