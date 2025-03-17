let categoryList = [];
let editIndex = null;
let currentCategory;


function _(selector) {
    return document.getElementById(selector);
}

_("add-category").addEventListener("click", function () {
    _("overlay").style.display = "block";
    _("add-category-form").style.display = "block";
})

_("category-cancel").addEventListener("click", function () {
    _("overlay").style.display = "none";
    _("add-category-form").style.display = "none";
})

function showNotification(msg) {
    const notification = document.getElementById("notification");
    notification.innerText = msg;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

document.getElementById("category-add").addEventListener("click", () => {
    const name = document.getElementById("category-name-input").value.trim();
    const description = document.getElementById("category-desp-input").value.trim();
    const task = 0;

    let categoryNames = categoryList.map(category => category.name);

    if (categoryNames.includes(name)) {
        _("error-msg").innerText = "This category name already exists!";
    } else if (!name || !description) {
        _("error-msg").innerText = "Please fill out both the category name and description.";
    } else {
        categoryList.push({ name, description, task, tasks: [] });
        renderCategories();
        showNotification("Category added successfully!");
        _("category-name-input").value = "";
        _("category-desp-input").value = "";
        _("overlay").style.display = "none";
        _("add-category-form").style.display = "none";
    }
    populateCategoryFilter();
});

function renderCategories() {
    const container = document.getElementById("category-container");
    container.innerHTML = "";
    container.innerHTML = "<h1>Recent Category</h1>";
    let currentEditCategoryIndex = null;

    if (categoryList.length === 0) {
        const placeholderDiv = document.createElement("div");
        placeholderDiv.className = "zsto-placeholder";

        const placeholderImage = document.createElement("img");
        placeholderImage.src = "nothing-there.png"; 
        placeholderImage.alt = "No-categories-available";

        const placeholderMessage = document.createElement("p");
        placeholderMessage.className = "zsto-category-message"
        placeholderMessage.innerText = "No categories to display. \nAdd a new category to get started!";

        placeholderDiv.appendChild(placeholderImage);
        placeholderDiv.appendChild(placeholderMessage);
        container.appendChild(placeholderDiv);

        return; 
    }

    categoryList.forEach((category, index) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "zsto-category";

        const infoDiv = document.createElement("div");
        infoDiv.className = "zsto-category-info";

        const title = document.createElement("h2");
        title.innerText = category.name;

        const desc = document.createElement("p");
        desc.innerText = category.description;

        const task = document.createElement("div");

        const menuButton = document.createElement("i");
        menuButton.className = "fa-solid fa-ellipsis-vertical";

        const contextMenu = document.createElement("div");
        contextMenu.className = "zsto-context-menu hidden";
        contextMenu.innerHTML = `
            <div id="edit-div"><i class="fa-solid fa-pen-to-square"></i>Edit</div>
            <div id="delete-div"><i class="fa-solid fa-trash"></i>Delete</div>
        `;

        task.innerHTML = `  
            <i class="fa-regular fa-circle-check"></i>
            <p>${category.tasks.length} Tasks</p>`;

        categoryDiv.addEventListener("click", function (ev) {
            if (ev.target.classList.contains("fa-ellipsis-vertical")) {
                ev.stopPropagation();
                contextMenu.classList.toggle("hidden");
            } else if (ev.target.id === "delete-div") {
                categoryList.splice(index, 1);
                renderCategories();
                renderTodos();
                updateTaskCounts();
                saveLocal();
            } else if (ev.target.id === "edit-div") {
                _("edit-categories").style.display = "block";
                contextMenu.classList.add("hidden");
                _("overlay").style.display = "block";
                currentEditCategoryIndex = index;
                _("category-name-input-edit").value = category.name;
                _("category-desp-input-edit").value = category.description;
            }
        })



        infoDiv.appendChild(title);
        infoDiv.appendChild(desc);
        infoDiv.appendChild(task);
        categoryDiv.appendChild(infoDiv);
        categoryDiv.appendChild(menuButton);
        categoryDiv.appendChild(contextMenu);
        container.appendChild(categoryDiv);




    });
    _("todo-category-edit-ok").addEventListener("click", function () {
        let name1 = _("category-name-input-edit").value.trim();
        let description1 = _("category-desp-input-edit").value.trim();
        let categoryNames = categoryList.map(category => category.name);


        if (categoryNames.includes(name1)) {
            _("error-msg-todo-edit").innerText = "This category name already exists!";
        } else if (!name1 || !description1) {
            _("error-msg-todo-edit").innerText = "Please fill out both the category name and description.";
            console.log("error")
        } else {
            showNotification("Category edited successfully!");
            _("error-msg-todo-edit").innerText = "";

            // category.name = name1;
            // category.description = description1
            // name1 = category.name;
            // description1 = category.description;
            categoryList[currentEditCategoryIndex].name = name1;
            categoryList[currentEditCategoryIndex].description = description1;
            _("edit-categories").style.display = "none";
            _("overlay").style.display = "none";
            renderCategories();

        }
        // category.name = _("category-name-input-edit").value;
        // category.description = _("category-desp-input-edit").value;

    })

    _("todo-category-edit-cancel").addEventListener("click", function () {
        _("edit-categories").style.display = "none";
        _("overlay").style.display = "none";
        _("error-msg-todo-edit").innerText = "";

    })
    saveLocal();
}

document.body.addEventListener("click", function (ev) {
    if (ev.target.classList.contains("zsto-category")) {
        const categoryName = ev.target.querySelector("h2").innerText;
        console.log(categoryName);
        currentCategory = categoryList.find(function (cat) {
            return cat.name === categoryName;
        });

        if (currentCategory) {
            // console.log("hello" + currentCategory);
            _("category-name").innerText = currentCategory.name;
            _("category-desp").innerText = currentCategory.description;
            _("category-div").style.display = "block";
            _("overlay").style.display = "block";
            renderTodos();
        }
    }

    else if (ev.target.classList.contains("fa-magnifying-glass")) {
        document.querySelectorAll('.zsto-nav i').forEach(icon => icon.classList.remove("selected"));
        _("search").classList.add("selected");
        _("zsto-search-div").classList.add("active");
        _("home").classList.remove("active");
        _("zsto-filter-div").classList.remove("active");
    }

    else if (ev.target.classList.contains("fa-filter")) {
        document.querySelectorAll('.zsto-nav i').forEach(icon => icon.classList.remove("selected"));
        _("zsto-filter").classList.add("selected");

        _("zsto-filter-div").classList.add("active");
        _("home").classList.remove("active");
        _("zsto-search-div").classList.remove("active");
        _("overlay").style.display = "block"
    }
});

_("category-div-close").addEventListener("click", function () {
    _("category-div").style.display = "none";
    _("overlay").style.display = "none";
})

_("category-plus").addEventListener("click", function () {
    _("add-todo-form").style.display = "block";
})

const todoList = [];

document.getElementById("todo-add").addEventListener("click", function () {
    const todoName = _("todo-name-input").value.trim();
    const priority = _("priority").value;

    if (!todoName) {
        _("error-msg-todo").style.display = "block";
        return;
    }

    const todo = { name: todoName, priority: priority, completed: false, flagged: false };

    if (currentCategory) {
        _("error-msg-todo").style.display = "none";
        currentCategory.tasks.push(todo);
        renderTodos();
        renderCategories();
        updateTaskCounts();
    }

    _("add-todo-form").style.display = "none";
    _("todo-name-input").value = "";
    _("priority").value = "Low";
    console.log(currentCategory.tasks);
    showNotification("Todo added successfully!");

});



function renderTodos(tasks = currentCategory.tasks, target = "todos") {

    const container = document.getElementById(target);
    container.innerHTML = "";

    tasks.forEach((todo, index) => {
        const divListItem = document.createElement("div");
        divListItem.className = "zsto-info-div";
        divListItem.style.backgroundColor = todo.completed ? "#e0f7e0" : "";

        const todoNameDiv = document.createElement("div");
        todoNameDiv.textContent = todo.name;
        todoNameDiv.style.textDecoration = todo.completed ? "line-through" : "";

        

        divListItem.addEventListener("click", function () {
            todo.completed = !todo.completed;
            renderTodos(tasks, target);
            updateTaskCounts();
        });

        const todoPrioDiv = document.createElement("div");
        todoPrioDiv.className = "zsto-todo-options";

        const priorityInfo = document.createElement("div");
        priorityInfo.className = `zsto-todo-prio-info ${todo.priority}`;

        const flagIcon = document.createElement("i");
        flagIcon.className = todo.flagged ? "fa-solid fa-flag" : "fa-regular fa-flag";

        priorityInfo.addEventListener("click", function (e) {
            e.stopPropagation();
            todo.flagged = !todo.flagged;
            renderTodos(tasks, target);
            updateTaskCounts();
        });

        priorityInfo.innerHTML = `<p>${todo.priority}</p>`;
        priorityInfo.prepend(flagIcon);

        const trashIcon = document.createElement("i");
        trashIcon.className = "fa-solid fa-trash";
        trashIcon.addEventListener("click", function (e) {
            e.stopPropagation();
            currentCategory.tasks.splice(index, 1);
            renderTodos(currentCategory.tasks, target);
            renderCategories();
            updateTaskCounts();
        });

        const editIcon = document.createElement("i");
        editIcon.className = "fa-solid fa-pen-to-square";
        editIcon.addEventListener("click", function (e) {
            e.stopPropagation();
            editIndex = index;
            _("edit-settings").style.display = "block";
            _("todo-name-input-edit").value = todo.name;
            _("priority-edit").value = todo.priority;
        });

        todoPrioDiv.appendChild(priorityInfo);
        todoPrioDiv.appendChild(trashIcon);
        todoPrioDiv.appendChild(editIcon);
        divListItem.appendChild(todoNameDiv);
        divListItem.appendChild(todoPrioDiv);
        container.appendChild(divListItem);
        saveLocal();
    });
}



_("todo-edit-ok").addEventListener("click", function () {
    let editName = _("todo-name-input-edit").value.trim();
    let editPriority = _("priority-edit").value;

    if (!editName) {
        _("error-msg-todo-edit").innerText = "Please provide a name for the task."
        return;
    }

    if (currentCategory && editIndex != null) {
        currentCategory.tasks[editIndex].name = editName;
        currentCategory.tasks[editIndex].priority = editPriority;

        renderTodos();
        renderCategories();

        editIndex = null;
        _("edit-settings").style.display = "none";
        _("error-msg-todo-edit").innerText = "";
    }
})


_("todo-cancel").addEventListener("click", function () {
    _("add-todo-form").style.display = "none";
})

_("todo-edit-cancel").addEventListener("click", function () {
    _("edit-settings").style.display = "none";
})

function calculateTaskStats() {
    let totalTasks = 0;
    let completedTasks = 0;
    let notCompletedTasks = 0;
    let flaggedTasks = 0;

    categoryList.forEach(category => {
        totalTasks += category.tasks.length;
        category.tasks.forEach(todo => {
            if (todo.completed) {
                completedTasks++;
            } else {
                notCompletedTasks++;
            }
            if (todo.flagged) {
                flaggedTasks++;
            }
        });
    });

    return { totalTasks, completedTasks, notCompletedTasks, flaggedTasks };
}

function updateTaskCounts() {
    const stats = calculateTaskStats();

    document.querySelector('.zsto-total-task p').innerText = `${stats.totalTasks} Tasks`;
    document.querySelector('.zsto-yet-to-start p').innerText = `${stats.notCompletedTasks} Tasks`;
    document.querySelector('.zsto-in-progress p').innerText = `${stats.flaggedTasks} Tasks`;
    document.querySelector('.zsto-completed-task p').innerText = `${stats.completedTasks} Tasks`;
}


_("home-btn").addEventListener("click", function () {
    document.querySelectorAll('.zsto-nav i').forEach(icon => icon.classList.remove("selected"));
    _("home-btn").classList.add("selected");

    _("home").classList.add("active");
    _("zsto-filter-div").classList.remove("active");
    _("zsto-search-div").classList.remove("active");
});

// _("search").addEventListener("click", function () {

// });


document.getElementById("search-task").addEventListener("input", function () {
    const searchWord = this.value.trim().toLowerCase();

    if (searchWord.length == 0) {
        _("searched-tasks").innerHTML = "";
    }
    else {
        if (currentCategory) {
            const filteredTasks = currentCategory.tasks.filter(task =>
                task.name.toLowerCase().includes(searchWord)
            );

            if (filteredTasks.length === 0) {
                _("searched-tasks").innerHTML = "<p>No tasks present</p>";
            } else {
                renderTodos(filteredTasks, "searched-tasks");
            }
        }
    }

});

function saveLocal() {
    localStorage.setItem("categoryList", JSON.stringify(categoryList));
}
function getLocal() {
    const taskLocal = JSON.parse(localStorage.getItem("categoryList"));
    if (taskLocal) {
        categoryList = taskLocal;
        renderCategories();
        if (categoryList.length > 0) {
            currentCategory = categoryList[0];
            renderTodos();
            updateTaskCounts();
        }
    }
}



_("todo-filter-cancel").addEventListener("click", function () {
    document.querySelectorAll('.zsto-nav i').forEach(icon => icon.classList.remove("selected"));
    _("home-btn").classList.add("selected");
    _("zsto-filter-div").classList.remove("active");
    _("overlay").style.display = "none";


})

_("todo-filter-ok").addEventListener("click", function () {
    filterTodos();
    _("filtered-tasks").style.display = "block";
    _("overlay").style.display = "block";
})

_("filtered-div-close").addEventListener("click", function () {
    _("filtered-tasks").style.display = "none";
    _("overlay").style.display = "none";
    document.querySelectorAll('.zsto-nav i').forEach(icon => icon.classList.remove("selected"));
    _("home-btn").classList.add("selected");
})

function init() {
    getLocal();
    populateCategoryFilter();
    renderCategories();
}

init();

function populateCategoryFilter() {
    const categoryFilter = _("category-filter");
    categoryList.forEach(category => {
        let exists = false;
        for (let i = 0; i < categoryFilter.options.length; i++) {
            if (categoryFilter.options[i].value === category.name) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            const option = document.createElement("option");
            option.value = category.name;
            option.innerText = category.name;
            categoryFilter.appendChild(option);
        }
    });
}






function filterTodos() {
    const selectedCategory = _("category-filter").value;
    const selectedPriority = _("priority-filter").value;
    const flagged = _("checkFlagged").checked;
    const completed = _("checkCompleted").checked;

    let filteredTasks = [];


    categoryList.forEach(category => {
        if (selectedCategory === "All" || category.name === selectedCategory) {
            category.tasks.forEach(task => {
                if (
                    (selectedPriority === "All" || task.priority === selectedPriority) &&
                    (!flagged || task.flagged) &&
                    (!completed || task.completed)
                ) {
                    filteredTasks.push(task);
                }
            });
        }
    });


    if (filteredTasks.length === 0) {
        _("filtered-tasks-div").innerHTML = "<p>No tasks present</p>";
    } else {
        renderTodos(filteredTasks, "filtered-tasks-div");
    }

    _("filtered-tasks-div").style.display = "block";
    _("zsto-filter-div").classList.remove("active");
    _("overlay").style.display = "none";
}




