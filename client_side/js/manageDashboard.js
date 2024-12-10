async function loadStatusMembers(){
    const response = await fetch(`${memberURL}/status`); // Requisição GET para o endpoint tasks
    const membersStatus = await response.json();

    // Agora você pode pegar os elementos e preencher com a quantidade de tarefas
    const onlineMembersElement = document.getElementById('online');
    const offlineMembersElement = document.getElementById('offline');


    membersStatus.forEach(member => {
        if (member.status === "online") {
            onlineMembersElement.innerHTML = ` ${member.total}`;
        }
        if (member.status === "offline") {
            offlineMembersElement.innerHTML = `${member.total}`;
        }
    });
}

async function loadMembersWithTasks(){
    const response = await fetch(`${memberURL}/with_tasks`);
    const [countMember] = await response.json();

    const withoutTasks = document.getElementById('withTasks');

    withoutTasks.innerHTML = `${countMember.com_tarefas}`;

}

async function loadMembersWithoutTasks(){
    const response = await fetch(`${memberURL}/no_tasks`);
    const [countMember] = await response.json();

    const withoutTasks = document.getElementById('withoutTasks');

    withoutTasks.innerHTML = `${countMember.sem_tarefas}`;

}

async function loadActiveTasks(){
    const response = await fetch(`${taskURL}/count`);
    const [countTask] = await response.json();


    const activeTasks = document.getElementById('active');

    activeTasks.innerHTML = `${countTask.tarefas_ativas}`

}
async function loadTaskSummary(){
    try{
        const response = await fetch(`${taskURL}/status`); // Requisição GET para o endpoint tasks
        const tasksSummary = await response.json();

        // Agora você pode pegar os elementos e preencher com a quantidade de tarefas
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
            if (item.statusTarefa === 'esperando-aprovacao') {
                waitingTasksElement.innerHTML = ` ${item.total}`;
            }
        });

    }catch(e){
        console.error(`Erro ao carregar tarefas:`, e);

    }

}

async function loadLatestTasks(){
    const response = await fetch(`${taskURL}/latest_tasks`);
    const latest_tasks = await response.json();

    const tasksContainer = document.querySelector('.lt_cards');

    tasksContainer.innerHTML = '';

    latest_tasks.forEach((task, index) => {
        if(index < 5){
            const taskCard = document.createElement('div');
            taskCard.classList.add('card');
            taskCard.id = `task_${index + 1}`;

            const dataInicio = convertData(task.dataInicio);
            const dataLimite = convertData(task.dataLimite);

            // Aqui você pode personalizar o conteúdo de cada card conforme os dados da tarefa
            taskCard.innerHTML = `
                <h3>${task.titulo}</h3>
                <p>Equipe: ${task.equipe}</p>
                <p>Prazo Inicial: ${dataInicio}</p>
                <p>Prazo Final: ${dataLimite}</p>
                <p>Criado Por:  ${task.funcionario}</p>
                <h3>${task.statusTarefa}</h3>

            `;

            tasksContainer.appendChild(taskCard);  // Adiciona o card ao container
        }
    });

}

async function loadTeams(){

    const teamImages = [
        "./images/Dev_Software.jpeg",
        "./images/RH.jpeg",
        "./images/Marketing.jpeg",
        "./images/Suporte_Tecnico.jpeg",
        "./images/Financeiro.jpeg",

    ]

    const response = await fetch(`${teamURL}`);
    const allTeams = await response.json();

    const teamContainer = document.querySelector('.team_cards');

    teamContainer.innerHTML = '';

    allTeams.forEach((team, index) => {
            const teamCard = document.createElement('div');
            teamCard.classList.add('card');

            const imagePath = teamImages[index]
            // Aqui você pode personalizar o conteúdo de cada card conforme os dados da tarefa
            teamCard.innerHTML = `
                <img src="${imagePath}" alt="Imagem da equipe ${team.equipe}" class="team-image"/>
                <h3>${team.equipe}</h3>

            `;

            teamContainer.appendChild(teamCard);  // Adiciona o card ao container
    });

}

loadLatestTasks();
loadStatusMembers();
loadMembersWithTasks();
loadMembersWithoutTasks();
loadActiveTasks();
loadTaskSummary();
loadTeams();

