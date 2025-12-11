document.addEventListener('DOMContentLoaded', () => {
    const newWorkButton = document.getElementById('newWork');
    const modal = document.getElementById('taskModal');
    const closeModal = document.querySelector('.close-button');
    const saveTaskButton = document.getElementById('saveTask');
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const dateInput = document.getElementById('taskDate');
    const statusSelect = document.getElementById('taskStatus');
    const userInput = document.getElementById('taskUser'); // Novo input para o nome do funcionário
    
    // Referência a todas as colunas Kanban
    const columns = document.querySelectorAll('#ToDo, #Doing, #Done');

    // 1. Mostrar o modal ao clicar em "Nova Tarefa"
    newWorkButton.addEventListener('click', () => {
        titleInput.value = '';
        descriptionInput.value = '';
        userInput.value = '';  // Limpa o campo de nome do funcionário
        dateInput.value = new Date().toISOString().substring(0, 10); 
        statusSelect.value = 'ToDo';
        modal.style.display = 'block';
    });

    // 2. Fechar o modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 3. Salvar a Tarefa
    saveTaskButton.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const date = dateInput.value;
        const statusId = statusSelect.value;
        const user = userInput.value.trim();  // Obtém o nome do funcionário
        
        if (!title || !description || !date || !user) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // 3.1. Cria o elemento HTML da nova tarefa
        const newTaskElement = createTaskElement(title, description, date, statusId, user);
        
        // 3.2. Adiciona a lógica de deletar e mudar status ao novo elemento
        initializeTaskListeners(newTaskElement);
        
        // 3.3. Adiciona a tarefa à coluna selecionada
        const targetColumn = document.getElementById(statusId);
        if (targetColumn) {
            targetColumn.appendChild(newTaskElement);
        }

        // 3.4. Fecha o modal
        modal.style.display = 'none';
    });

    /**
     * Cria o elemento HTML para uma nova tarefa.
     */
    function createTaskElement(title, description, date, statusId, user) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-card');
        
        const dateFormatted = new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        taskDiv.innerHTML = `
            <h3>${title}</h3>
            <p><strong>Descrição:</strong> ${description}</p>
            <p class="task-date"><strong>Prazo:</strong> ${dateFormatted}</p>
            <p><strong>Funcionário:</strong> ${user}</p>  <!-- Exibe o nome do funcionário -->
            <button class="delete-task-button">Deletar</button>
            <div class="status-selector">
                <select class="status-select">
                    <option value="ToDo">A Fazer</option>
                    <option value="Doing">Em Andamento</option>
                    <option value="Done">Pronto</option>
                </select>
            </div>
        `;
        
        taskDiv.setAttribute('data-status', statusId); // A tarefa tem um status

        return taskDiv;
    }

    /**
     * Inicializa os listeners das tarefas (delete e mudar status)
     */
    function initializeTaskListeners(taskElement) {
        // 1. Lógica de Deletar
        const deleteButton = taskElement.querySelector('.delete-task-button');
        deleteButton.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
                taskElement.remove();
            }
        });

        // 2. Lógica de alterar o status (ao clicar na tarefa)
        const statusSelectElement = taskElement.querySelector('.status-select');

        statusSelectElement.addEventListener('change', (e) => {
            const newStatus = e.target.value;
            const currentStatus = taskElement.getAttribute('data-status');
            
            if (newStatus !== currentStatus) {
                // Atualiza o status da tarefa
                taskElement.setAttribute('data-status', newStatus);

                // Move a tarefa para a nova coluna
                const targetColumn = document.getElementById(newStatus);
                if (targetColumn) {
                    targetColumn.appendChild(taskElement); // Move a tarefa para a nova coluna
                }
            }
        });
    }
});
