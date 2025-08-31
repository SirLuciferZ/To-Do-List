

let tasks = JSON.parse(localStorage.getItem("tasks"))
let lists = JSON.parse(localStorage.getItem("lists"))

if (!tasks) {
    tasks = []
}
if (!lists) {
    lists = []
}
renderLists()

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".active-list-name").textContent = "All";
    renderTasks(tasks);
});



//      making the dark mode button interactive

document.querySelector(".dark-mode-container").addEventListener("click", function () {
    this.classList.toggle("active");
    changeTheme()
    // Here you can also toggle your actual dark mode theme
});


//      change the theme to dark mode when the dark mode button is clicked


function changeTheme() {
    const active = document.querySelector(".dark-mode-container").classList.contains("active");

    // document.querySelector(".complete-clear").style.borderColor = active ? "rgba(255, 255, 255, 0.302)" : "rgba(0, 0, 0, 0.202)";

    document.documentElement.setAttribute("data-theme", active ? "light" : "dark");
    toggleTheme()
}




//          set theme to local storage and load it on page load

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
});

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
}






//      Make popup window visible
//      and make backdrop visible


function showAddTask() {
    const popup = document.querySelector(".add-task-popup")
    const backdrop = document.querySelector(".backdrop")

    if (popup.classList.contains("active")) {
        popup.style.opacity = 0
        popup.style.pointerEvents = "none"
        popup.style.scale = "0"
        popup.classList.remove("active")
        backdrop.style.opacity = 0
        backdrop.style.pointerEvents = "none"
    }
    else {
        popup.style.opacity = 1
        popup.style.pointerEvents = "all"
        popup.style.scale = "1"
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

/**
 * Gathers the inputs from popup and pushes it in tasks array.
 * If the task is being edited, it will update the existing task.
 * If not, it will add a new task to the array.
 * In the end, it will save the tasks to local storage, render the tasks and close the popup.
 */


function addTask() {
    const nameInput = document.querySelector(".task-name-holder input");
    const tagInput = document.querySelector(".task-tag-holder input");
    const noteInput = document.querySelector(".task-note-holder input");
    const dateInput = document.querySelector(".task-date-holder input");
    const listSelect = document.querySelector(".task-list-holder select");
    const importanceCheckbox = document.querySelector(".important-check input");

    if (!nameInput.value.trim()) return;

    if (isEditing) {
        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
            task.name = nameInput.value;
            task.tag = tagInput.value;
            task.note = noteInput.value;
            task.date = dateInput.value;
            task.list = listSelect.value;
            task.importance = importanceCheckbox.checked;
        }
        isEditing = false;
        editingTaskId = null;
        document.querySelector(".add-task-button").textContent = "Add Task";
    } else {
        tasks.push({
            id: generateId(),
            name: nameInput.value,
            tag: tagInput.value,
            note: noteInput.value,
            date: dateInput.value,
            list: listSelect.value,
            importance: importanceCheckbox.checked,
            isCompleted: false
        });
    }

    // ✅ Clear the actual inputs
    nameInput.value = "";
    tagInput.value = "";
    noteInput.value = "";
    dateInput.value = "";
    listSelect.selectedIndex = 0;
    importanceCheckbox.checked = false;

    saveToStorage();
    renderTasks(tasks);
    showAddTask(); // close popup
}



document.querySelector(".add-task-button").addEventListener("click", addTask)



//  Show the tasks in the task list 

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
                            <div class="task-date">${task.date.replaceAll("-", "/")}</div>
                            <div class="task-tags">${task.tag}</div>
                        </div>
                        
                    </div>
                    <img class="edit-task" data-id="${task.id
                }" src="./icons/edit.svg" alt="" />
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

    // Reattach checkbox listeners
    document.querySelectorAll(".is-completed").forEach(cb => {
        cb.addEventListener("click", isCompletedCheck);
    });

    // Attach edit button listeners
    document.querySelectorAll(".edit-task").forEach(btn => {
        btn.addEventListener("click", editTask);
    });

    // Attach task click listeners
    document.querySelectorAll(".task-info").forEach(info => {
        info.addEventListener("click", showTaskDetails);
    });



    updateCounts();
}


//          show task details on clicking the task


let currentDetailTaskId = null;

function showTaskDetails(event) {
    const taskId = event.currentTarget.parentElement.querySelector(".is-completed").dataset.id;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    currentDetailTaskId = taskId;

    // Fill view mode
    document.querySelector(".details-name").textContent = task.name;
    document.querySelector(".details-note").textContent = task.note || "—";
    document.querySelector(".details-date").textContent = task.date ? task.date.replaceAll("-", "/") : "—";
    document.querySelector(".details-tag").textContent = task.tag || "—";
    document.querySelector(".details-list").textContent = task.list || "—";
    document.querySelector(".details-importance").textContent = task.importance ? "Yes" : "No";
    document.querySelector(".details-completed").textContent = task.isCompleted ? "Yes" : "No";

    // Fill edit mode fields
    document.querySelector(".edit-name").value = task.name;
    document.querySelector(".edit-tag").value = task.tag;
    document.querySelector(".edit-note").value = task.note;
    document.querySelector(".edit-date").value = task.date;
    document.querySelector(".edit-list").innerHTML = lists.map(l => `<option value="${l}" ${l === task.list ? "selected" : ""}>${l}</option>`).join("");
    document.querySelector(".edit-importance").checked = task.importance;

    // Show view mode by default
    document.querySelector(".details-view").style.display = "block";
    document.querySelector(".details-edit").style.display = "none";

    document.querySelector(".task-details-popup").classList.add("active");
    document.querySelector(".backdrop-task-details").classList.add("active");
}

function closeTaskDetails() {
    document.querySelector(".task-details-popup").classList.remove("active");
    document.querySelector(".backdrop-task-details").classList.remove("active");
}

// Switch to edit mode
document.querySelector(".edit-task-inside").addEventListener("click", () => {
    document.querySelector(".details-view").style.display = "none";
    document.querySelector(".details-edit").style.display = "block";
});

// Save changes
document.querySelector(".save-task-changes").addEventListener("click", () => {
    const task = tasks.find(t => t.id === currentDetailTaskId);
    if (!task) return;

    task.name = document.querySelector(".edit-name").value;
    task.tag = document.querySelector(".edit-tag").value;
    task.note = document.querySelector(".edit-note").value;
    task.date = document.querySelector(".edit-date").value;
    task.list = document.querySelector(".edit-list").value;
    task.importance = document.querySelector(".edit-importance").checked;

    saveToStorage();
    renderTasks(tasks);
    closeTaskDetails();
});

document.querySelector(".backdrop-task-details").addEventListener("click", closeTaskDetails);






//     Edit a task  

let isEditing = false;
let editingTaskId = null;


function editTask(event) {
    const taskId = event.target.dataset.id;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Pre-fill popup inputs
    document.querySelector(".task-name-holder input").value = task.name;
    document.querySelector(".task-tag-holder input").value = task.tag;
    document.querySelector(".task-note-holder input").value = task.note;
    document.querySelector(".task-date-holder input").value = task.date;
    document.querySelector(".task-list-holder select").value = task.list;
    document.querySelector(".important-check input").checked = task.importance;

    // Set edit mode
    isEditing = true;
    editingTaskId = taskId;

    // Change button text
    document.querySelector(".add-task-button").textContent = "Save Changes";

    // Show popup
    showAddTask();
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
    let list = document.querySelector(".new-list-name").value
    lists.push(list)
    list = ""
    saveToStorage()
    showAddList()
    renderLists()

}

document.querySelector(".add-list-button").addEventListener("click", addList)


//              delete a list

function deleteList() {
    const currentList = document.querySelector(".active-list-name").textContent.trim();

    // Don't allow deleting "All" or special sections
    if (["All", "Today's", "Important", "Completed", "Active"].includes(currentList)) {
        alert("You can't delete this section.");
        return;
    }

    // Remove list from lists array
    lists = lists.filter(list => list !== currentList);

    // Remove tasks belonging to that list
    tasks = tasks.filter(task => task.list !== currentList);

    saveToStorage();
    renderLists();
    renderTasks(tasks); // Show all tasks after deletion
    document.querySelector(".active-list-name").textContent = "All";
}

document.querySelector(".delete-list").addEventListener("click", deleteList);

//          item count for each list and sections

function updateCounts() {
    const todayStr = new Date().toISOString().split("T")[0];

    // Sections (excluding completed unless it's the Completed section)
    const allCount = tasks.filter(t => !t.isCompleted).length;
    const activeCount = tasks.filter(t => !t.isCompleted).length;
    const todayCount = tasks.filter(t => t.date === todayStr && !t.isCompleted).length;
    const importantCount = tasks.filter(t => t.importance && !t.isCompleted).length;
    const completedCount = tasks.filter(t => t.isCompleted).length;

    document.querySelector(".all-num").textContent = allCount;
    document.querySelector(".active-num").textContent = activeCount;
    document.querySelector(".today-num").textContent = todayCount;
    document.querySelector(".important-num").textContent = importantCount;
    document.querySelector(".completed-num").textContent = completedCount;

    // Lists (only active tasks)
    lists.forEach(listName => {
        const listCount = tasks.filter(t => t.list === listName && !t.isCompleted).length;
        const listCountEl = document.querySelector(`.list-class-${listName} ~ .list-quantity`);
        if (listCountEl) {
            listCountEl.textContent = listCount;
        }
    });

    // Active list/section count at the top
    const currentListName = document.querySelector(".active-list-name").textContent.trim();
    let currentCount = 0;

    if (currentListName === "All") {
        currentCount = allCount;
    } else if (currentListName === "Active") {
        currentCount = activeCount;
    } else if (currentListName === "Today's") {
        currentCount = todayCount;
    } else if (currentListName === "Important") {
        currentCount = importantCount;
    } else if (currentListName === "Completed") {
        currentCount = completedCount;
    } else {
        // Custom list
        currentCount = tasks.filter(t => t.list === currentListName && !t.isCompleted).length;
    }

    document.querySelector(".active-list-tasks").textContent = currentCount;
}


//              Update today's progress bar


function updateTodayProgress() {
    const todayStr = new Date().toISOString().split("T")[0];

    const todayTasks = tasks.filter(t => t.date === todayStr);
    const completed = todayTasks.filter(t => t.isCompleted).length;
    const total = todayTasks.length;

    // Update the counts in the sidebar
    const completedEl = document.querySelector(".today-completed-task");
    const totalEl = document.querySelector(".today-total-task");
    if (completedEl) completedEl.textContent = completed;
    if (totalEl) totalEl.textContent = total;

    // Calculate percentage
    const pct = total ? Math.round((completed / total) * 100) : 0;

    // Update the bar
    const bar = document.querySelector(".progress-bar");
    if (!bar) return;

    // Optional color states
    bar.classList.remove("low", "mid", "high");
    if (pct >= 67) bar.classList.add("high");
    else if (pct >= 34) bar.classList.add("mid");
    else bar.classList.add("low");

    bar.style.width = pct + "%";
    bar.setAttribute("aria-valuenow", String(pct));
    bar.setAttribute("aria-label", `Today's progress: ${pct}%`);
}

window.addEventListener("DOMContentLoaded", updateTodayProgress);


//              clear tasks from a list

function clearTasks() {
    const currentList = document.querySelector(".active-list-name").textContent.trim();

    // If in "All" section, clear ALL tasks
    if (currentList === "All") {
        tasks = [];
    } else {
        // Remove only tasks in the current list
        tasks = tasks.filter(task => task.list !== currentList);
    }

    saveToStorage();
    renderTasks(tasks);
}

document.querySelector(".clear-completed").addEventListener("click", clearTasks);




//      render lists on screen

function renderLists() {
    const listsHtml = lists.map((list) => {
        return `<div class="lists" data-list="${list}">
            <img src="./icons/list.svg" alt="" data-list="${list}" />
            <p class="list-name list-class-${list}" data-list="${list}">${list}</p>
            <span class="list-quantity" data-list="${list}">0</span>
        </div>`;
    }).join("");

    document.querySelector(".list-items").innerHTML = listsHtml;

    const popupLists = lists.map((list) => {
        return `<option value="${list}">${list}</option>`;
    }).join("");
    document.querySelector("#list-options").innerHTML = popupLists;

    updateCounts(); // ✅ update after rendering lists

    document.querySelectorAll(".lists").forEach((list) => {
        list.addEventListener("click", event => { renderTaskByList(event); })
    })
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


//          filter tasks from completed tasks

function filterTasks(baseFilterFn, sectionName) {
    let result = tasks.filter(baseFilterFn);

    // Hide completed unless section is All or Completed
    if (sectionName !== "All" && sectionName !== "Completed") {
        result = result.filter(task => !task.isCompleted);
    }

    return result;
}



//      show tasks related to selected list


function renderTaskByList(event) {
    const listContent = event.target.dataset.list;
    currentFilterFn = task => task.list === listContent;
    currentViewName = listContent;
    const filtered = tasks.filter(currentFilterFn);
    document.querySelector(".active-list-name").textContent = listContent;
    renderTasks(filtered);
}


document.querySelectorAll(".lists").forEach((list) => {
    list.addEventListener("click", event => { renderTaskByList(event); })
})


//      show the selected section tasks by clicking on each section

let currentFilterFn = () => true; // default: show all
let currentViewName = "All";




function showSelectedSectionTasks(filterFn, name) {
    currentFilterFn = filterFn;
    currentViewName = name;
    const filtered = tasks.filter(filterFn);
    document.querySelector(".active-list-name").textContent = name;
    renderTasks(filtered);
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




//          search bar tasks


document.querySelector(".search input").addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    // Start from the current view's filtered tasks
    let visibleTasks = tasks.filter(currentFilterFn);

    // Apply search filter
    if (searchTerm) {
        visibleTasks = visibleTasks.filter(task =>
            task.name.toLowerCase().includes(searchTerm)
        );
    }

    renderTasks(visibleTasks);
});




//          completed check

function isCompletedCheck(event) {
    const checkbox = event.target;
    const taskId = checkbox.dataset.id;

    const matchingTask = tasks.find(task => task.id === taskId);
    if (matchingTask) {
        matchingTask.isCompleted = checkbox.checked;
    }

    saveToStorage();
    showSelectedSectionTasks(currentFilterFn, currentViewName);
}



//          delete the selected task



function deleteTask() {
    if (!currentDetailTaskId) return;

    if (!confirm("Are you sure you want to delete this task?")) return;

    // Find the task element in the background list
    const taskEl = document.querySelector(`.is-completed[data-id="${currentDetailTaskId}"]`)?.closest(".tasks");

    if (taskEl) {
        // Add animation styles
        taskEl.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        taskEl.style.opacity = "0";
        taskEl.style.transform = "translateX(-20px)";

        // Wait for animation to finish before removing
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== currentDetailTaskId);
            saveToStorage();
            closeTaskDetails();
            showSelectedSectionTasks(currentFilterFn, currentViewName);
        }, 300);
    } else {
        // Fallback if element not found
        tasks = tasks.filter(task => task.id !== currentDetailTaskId);
        saveToStorage();
        closeTaskDetails();
        showSelectedSectionTasks(currentFilterFn, currentViewName);
    }
}

document.querySelector(".delete-task-button").addEventListener("click", deleteTask);





//      save lists and tasks to local storage

function saveToStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
    localStorage.setItem("lists", JSON.stringify(lists));

    updateTodayProgress();
}