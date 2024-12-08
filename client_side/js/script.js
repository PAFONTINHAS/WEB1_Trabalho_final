const localhost = "http://localhost:3000/"
const taskURL   = localhost +"tasks"
const memberURL = localhost +"members"
const teamURL   = localhost +"teams"

function loadMemberSummary(){

}

async function loadTaskSummary(){
    try{
        const response = await fetch(`${taskURL}/status`); // Requisição GET para o endpoint tasks
        const tasksSummary = await response.json();

        // Agora você pode pegar os elementos e preencher com a quantidade de tarefas
        const activeTasksElement = document.getElementById('active');
        const pendingTasksElement = document.getElementById('pending');
        const ongoingTasksElement = document.getElementById('ongoing');
        const waitingTasksElement = document.getElementById('waiting');

        tasksSummary.forEach(item => {
            if (item.statusTarefa === 'pendente') {
                pendingTasksElement.innerHTML = ` ${item.total}`;
            }
            if (item.statusTarefa === 'em-andamento') {
                ongoingTasksElement.innerHTML = `${item.total}`;
            }
            if (item.statusTarefa === 'concluida') {
                activeTasksElement.innerHTML = `${item.total}`;
            }
            if (item.statusTarefa === 'esperando-aprovacao') {
                waitingTasksElement.innerHTML = ` ${item.total}`;
            }
        });

    }catch(e){
        console.error(`Erro ao carregar tarefas ${status}:`, e);

    }

}

loadTaskSummary();
