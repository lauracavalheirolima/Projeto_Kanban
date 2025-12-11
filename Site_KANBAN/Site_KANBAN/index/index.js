document.addEventListener('DOMContentLoaded', () => {
    const newWorkButton = document.getElementById('newWork');
    const modal = document.getElementById('taskModal');
    const closeModal = document.querySelector('.close-button');
    const saveTaskButton = document.getElementById('saveTask');
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const dateInput = document.getElementById('taskDate');
    const statusSelect = document.getElementById('taskStatus');
    
    // Referência a todas as colunas Kanban
    const columns = document.querySelectorAll('#ToDo, #Doing, #Done');

    // Inicializa listeners de drag and drop nas colunas
    initializeDropZones(columns);

    // 1. Mostrar o modal ao clicar em "Nova Tarefa"
    newWorkButton.addEventListener('click', () => {
        titleInput.value = '';
        descriptionInput.value = '';
        // Define a data limite como a data atual por padrão
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
        
        if (!title || !description || !date) {
            alert('Por favor, preencha o Título, a Descrição e a Data.');
            return;
        }

        // 3.1. Cria o elemento HTML da nova tarefa
        const newTaskElement = createTaskElement(title, description, date);
        
        // 3.2. Adiciona a lógica de deletar e arrastar ao novo elemento
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
    function createTaskElement(title, description, date) {
        const taskDiv = document.createElement('div');
        // Usa um ID único para o drag and drop
        taskDiv.id = 'task-' + Date.now(); 
        taskDiv.classList.add('task-card'); 
        taskDiv.setAttribute('draggable', 'true'); // Torna o cartão arrastável

        const dateFormatted = new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        taskDiv.innerHTML = `
            <h3>${title}</h3>
            <p><strong>Descrição:</strong> ${description}</p>
            <p class="task-date"><strong>Prazo:</strong> ${dateFormatted}</p>
            <button class="delete-task-button">Deletar</button>
        `;
        return taskDiv;
    }

    /**
     * Inicializa listeners de Drag e Delete para um elemento de tarefa.
     */
    function initializeTaskListeners(taskElement) {
        // Funcionalidade de Deletar
        const deleteButton = taskElement.querySelector('.delete-task-button');
        deleteButton.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
                taskElement.remove();
            }
        });

        // Funcionalidade de Arrastar (Drag Start)
        taskElement.addEventListener('dragstart', (e) => {
            // Armazena o ID do elemento que está sendo arrastado
            e.dataTransfer.setData('text/plain', taskElement.id);
            // Adiciona uma classe para feedback visual
            setTimeout(() => taskElement.classList.add('dragging'), 0);
        });

        // Funcionalidade de Arrastar (Drag End)
        taskElement.addEventListener('dragend', () => {
            taskElement.classList.remove('dragging');
        });
    }

    /**
     * Configura as colunas Kanban como zonas de drop (soltura).
     */
    function initializeDropZones(columns) {
        columns.forEach(column => {
            // 1. Permite o drop
            column.addEventListener('dragover', (e) => {
                e.preventDefault(); 
                column.classList.add('drag-over'); // Feedback visual
            });

            // 2. Remove feedback visual ao sair da área
            column.addEventListener('dragleave', () => {
                column.classList.remove('drag-over');
            });

            // 3. Lógica de Drop (Soltar)
            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.classList.remove('drag-over');

                // Obtém o ID da tarefa arrastada
                const id = e.dataTransfer.getData('text/plain');
                const draggable = document.getElementById(id);

                // Move a tarefa para a nova coluna
                if (draggable) {
                    column.appendChild(draggable);
                }
            });
        });
    }
});