

let tasks = JSON.parse(localStorage.getItem("tasks"))
let lists = JSON.parse(localStorage.getItem("lists"))

if (!tasks) {
    tasks = []
}
if (!lists) {
    lists = []
}
renderLists()
renderTasks(tasks)

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


//      Generate a random ID


function generateId() {
    return Math.random().toString(36).substr(2, 9); // e.g. "k3f9z8q1a"
}



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
            id: generateId(),
            name: taskName || "",
            tag: taskTag || "",
            note: taskNote || "",
            date: taskDate || "",
            list: taskList || "",
            importance: taskImportance || false,
            isCompleted: false
        })
    }
    console.log(tasks);
    renderTasks(tasks)
    saveToStorage()
}

document.querySelector(".add-task-button").addEventListener("click", addTask)

console.log(tasks);


//  Show the tasks in the task list  (Only for all section)

function renderTasks(render) {
    // Sort so incomplete tasks come first
    const sortedTasks = [...render].sort((a, b) => {
        return a.isCompleted - b.isCompleted;
        // false (0) before true (1)
    });

    let tasksRenderedHtml = '';

    if (sortedTasks.length > 0) {
        sortedTasks.forEach(task => {
            tasksRenderedHtml += `
                <div class="tasks ${task.isCompleted ? "completed" : ""}">
                    <input type="checkbox" 
                        class="is-completed" 
                        data-id="${task.id}" 
                        ${task.isCompleted ? "checked" : ""} />
                    <div class="task-info">
                        <div class="task-name">${task.name}</div>
                        <div class="task-note">${task.note}</div>
                        <div class="tag-date">
                            <div class="task-date">${(task.date).replaceAll("-", "/")}</div>
                            <div class="task-tags">${task.tag}</div>
                        </div>
                    </div>
                </div>
            `;
        });

        document.querySelector(".task-container").innerHTML = tasksRenderedHtml;
    } else {
        document.querySelector(".task-container").innerHTML = `
            <div class="empty-list">
                <img src="./empty-cart.gif" alt="" />
                <p class="list-notice">LIST IS EMPTY</p>
                <p class="list-guide">
                    Click on the <span>+</span> button on top to add a new task
                </p>
            </div>
        `;
    }

    // Reattach event listeners after rendering
    document.querySelectorAll(".is-completed").forEach(cb => {
        cb.addEventListener("click", isCompletedCheck);
    });
}



//      show add list input


function showAddList() {
    const newList = document.querySelector(".new-list-container")

    if (newList.classList.contains("active")) {
        newList.style.display = "none"
        newList.classList.remove("active")
    }
    else {
        newList.style.display = "flex"
        newList.classList.add("active")
    }
}

document.querySelector(".list-header-container").addEventListener("click", showAddList)

//      add a new list to lists

function addList() {
    const list = document.querySelector(".new-list-name").value
    lists.push(list)
    saveToStorage()
    showAddList()
    renderLists()
    console.log(lists)
}

document.querySelector(".add-list-button").addEventListener("click", addList)


//      render lists on screen

function renderLists() {
    const listsHtml = lists.map((list) => {
        return `<div class="lists" data-list="${list}">
            <img src="./icons/list.svg" alt="" data-list="${list}"  />
            <p class="list-name list-class-${list}" data-list="${list}">${list}</p>
            <span class="list-quantity" data-list="${list}">0</span>
          </div>`;
    }).join("")
    document.querySelector(".list-items").innerHTML = listsHtml


    const popupLists = lists.map((list) => {
        return `<option value="${list}">${list}</option>`
    }).join("")
    document.querySelector("#list-options").innerHTML = popupLists
}


//      Capitalize the first letter of the word

function capitalizeFirstLetter(str) {
    if (!str) return ""; // handle empty strings
    try {
        return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (error) {
        console.error("Error:", error);
        return str; // return the original string if an error occurs
    }
}


//      show tasks related to selected list


function renderTaskByList(event) {
    const listContent = event.target.dataset.list
    const matchingTasks = tasks.filter(task => task.list === listContent);
    document.querySelector(".active-list-name").innerHTML = capitalizeFirstLetter(listContent)
    let listedTasks = []

    if (matchingTasks.length > 0) {
        console.log(`Found ${matchingTasks.length} tasks for "${listContent}":`);
        matchingTasks.forEach(task => listedTasks.push(task));
        renderTasks(listedTasks);
    } else {
        console.log(`No tasks found for "${listContent}"`);
        renderTasks(listedTasks);
    }
    console.log(listedTasks);
}

document.querySelectorAll(".lists").forEach((list) => {
    list.addEventListener("click", event => { renderTaskByList(event); })
})


//      show the selected section tasks by clicking on each section


function showSelectedSectionTasks(filterFn, name) {

    let allTasks = tasks.filter(filterFn);
    document.querySelector(".active-list-name").innerHTML = `${name} Tasks`
    renderTasks(allTasks)
}

document.querySelector(".show-important").addEventListener("click", () => showSelectedSectionTasks(task => task.importance, "Important"))

document.querySelector(".show-all").addEventListener("click", () => showSelectedSectionTasks(() => true, "All"))

document.querySelector(".show-today").addEventListener("click", () => showSelectedSectionTasks(isToday, "Today's"))

document.querySelector(".show-completed").addEventListener("click", () => showSelectedSectionTasks(task => task.isCompleted, "Completed"))

document.querySelector(".show-active").addEventListener("click", () => showSelectedSectionTasks(task => !task.isCompleted, "Active"))


// Helper to check if a task is due today
function isToday(task) {
    const todayStr = new Date().toISOString().split("T")[0];
    // e.g. "2025-08-30"
    return task.date === todayStr;
}



//          completed check

function isCompletedCheck(event) {
    const checkbox = event.target;
    const taskId = checkbox.dataset.id;

    const matchingTask = tasks.find(task => task.id === taskId);
    if (matchingTask) {
        matchingTask.isCompleted = checkbox.checked;
    } else {
        console.log("yes")
    }
    saveToStorage()
    renderTasks(tasks)
    console.log(tasks)
}


//      save lists and tasks to local storage

function saveToStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
    localStorage.setItem("lists", JSON.stringify(lists));
}