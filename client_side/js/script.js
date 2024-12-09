const localhost   = "http://localhost:3000/"
const taskURL     = localhost +"tasks"
const memberURL   = localhost +"members"
const teamURL     = localhost +"teams"
const EmployeeURL = localhost +"employees"


function convertData(dateString) {
    const date = new Date(dateString); // Cria um objeto Date a partir da string
    const day = String(date.getDate()).padStart(2, '0'); // Obtém o dia e adiciona 0 à esquerda, se necessário
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtém o mês (0-based) e adiciona 0 à esquerda
    const year = date.getFullYear(); // Obtém o ano

    return `${day}/${month}/${year}`; // Retorna a data no formato dd/mm/aaaa
}




