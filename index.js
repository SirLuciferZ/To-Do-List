const tasks = []

if (!tasks) {
    tasks = []
}

renderTasks()

//      Make popup window visible

function showAddTask() {
    const popup = document.querySelector(".add-task-popup")
    const backdrop = document.querySelector(".backdrop")

    if (popup.classList.contains("active")) {
        popup.style.opacity = 0
        popup.style.pointerEvents = "none"
        popup.style.top = "40%"
        popup.classList.remove("active")
        backdrop.style.opacity = 0
        backdrop.style.pointerEvents = "none"
    }
    else {
        popup.style.opacity = 1
        popup.style.pointerEvents = "all"
        popup.style.top = "50%"
        popup.classList.add("active")
        backdrop.style.opacity = 1
        backdrop.style.pointerEvents = "all"
    }
}


document
    .querySelectorAll(".add-task-img, .close-popup, .backdrop")
    .forEach(el => el.addEventListener("click", showAddTask));




//  Gather the inputs from popup and push it in tasks

function addTask() {
    const taskName = document.querySelector(".task-name-holder input").value
    const taskTag = document.querySelector(".task-tag-holder input").value
    const taskNote = document.querySelector(".task-note-holder input").value
    const taskDate = document.querySelector(".task-date-holder input").value
    const taskList = document.querySelector(".task-list-holder select").value
    const taskImportance = document.querySelector(".important-check input").checked


    if (taskName) {
        tasks.push({
            name: taskName || "",
            tag: taskTag || "",
            note: taskNote || "",
            date: taskDate || "",
            list: taskList || "",
            importance: taskImportance || false
        })
    }
    console.log(tasks);
    renderTasks()
}

document.querySelector(".add-task-button").addEventListener("click", addTask)


//  Show the tasks in the task list

function renderTasks() {
    let tasksRenderedHtml = ''
    tasks.forEach(task => {
        const tasksHtml = `<div class="tasks">
          <input type="checkbox" class="is-completed" />
          <div class="task-info">
            <div class="task-name">${task.name}</div>
            <div class="task-note">${task.note}</div>
            <div class="tag-date">
              <div class="task-date">${(task.date).replaceAll("-", "/")}</div>
              <div class="task-tags">${task.tag}</div>
            </div>
          </div>
        </div>`

        tasksRenderedHtml += tasksHtml;
        document.querySelector(".task-container").innerHTML = tasksRenderedHtml
    })



}