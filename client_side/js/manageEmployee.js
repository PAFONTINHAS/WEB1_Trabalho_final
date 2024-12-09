
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
        li.textContent = `${employee.funcionario} - ${employee.email} - ${employee.cargo} - ${employee.descricao}`;
        employeeList.appendChild(li);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("applyFilters").click();
});
