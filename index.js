const tasks = []

if (!tasks) {
    tasks = []
}

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

document.querySelector(".add-task-img").addEventListener("click", showAddTask)
document.querySelector(".close-popup").addEventListener("click", showAddTask)
document.querySelector(".backdrop").addEventListener("click", showAddTask)