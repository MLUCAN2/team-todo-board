// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id 
function generateTaskId() {
    return Math.floor(Math.random()*10000);
}
const taskId=generateTaskId();
console.log(taskId)


// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete') .text('delete') .attr('data-task-id', task.id);

    cardDeleteBtn.on('click', handleDeleteTask);

    if (task.dueDate && task.status !== 'done'){
        const now= dayjs();
        const taskDueDate= dayjs(task.DueDate, 'DD/MM/YYYY');
        if (now.isSame(taskDueDate, 'day')){
        taskCard.addClass('bg-warning text-white');
        }
        else if (now.isAfter(taskDueDate)){
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    taskCard.append(cardHeader,cardBody)
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const todoContainer= $('#todo-cards');
    const inProgressContainer= $('#in-progress-cards');
    const doneContainer= $('#done-cards');
    todoContainer.empty()

    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
            if (task.status === 'todo'){
                todoContainer.append(taskCard);
            }
            else if(task.status === 'in-progress'){
                inProgressContainer.append(taskCard);
            }
            else if(task.status === 'done'){
                doneContainer.append(taskCard);
            }
        taskCard.draggable();
    });
    
}


// Todo: create a function to handle adding a new task
function handleAddTask(event){
    console.log("Add task button clicked")
    const taskTitle= $('#taskTitle').val();
    const taskDueDate= $('#taskDueDate').val();
    const taskDescription= $('#taskDescription').val();
    const newTask= {
        id:generateTaskId(),
        title:taskTitle,
        dueDate:taskDueDate,
        description:taskDescription,
        status:'todo'
    };

    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
    $('#exampleModal').modal('hide');
    $('#taskTitle').val('');
    $('#taskDueDate').val('');
    $('#taskDescription').val('');

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(){
    console.log ('Delete button clicked')
    const taskId= $(this).attr('data-task-id');
    console.log (taskId);
    const taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1){
        taskList.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList();
    }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId= ui.draggable.attr('data-task-id');
    const newStatus= event.target.id;
    const taskIndex= taskList.findIndex(task => task.id == taskId);
    if (taskIndex !== -1){
        taskList[taskIndex].status= newStatus;

        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList();
    }

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    taskList=JSON.parse(localStorage.getItem("tasks"));
    nextId =JSON.parse(localStorage.getItem("nextID"));
    if (taskList === null || taskList === undefined){
        taskList= [];
    }
    renderTaskList();
    $('#saveTaskBtn').click(handleAddTask);
    $('.lane').droppable({
        drop: handleDrop
    });
    $('#taskDueDate').datepicker();
    $('#todo-cards').on('click', '.delete', handleDeleteTask);

});
