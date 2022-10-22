const todos = document.querySelector("#todos-tab");
const submit = document.querySelector("#btn-submit");
const save = document.querySelector("#btn-save");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const dueDate = document.querySelector("#date");
const titleMessage = document.querySelector('.title-message');
const dateMessage = document.querySelector('.date-message');
const alert = document.querySelector('.alert');
const alertMessageElement = document.createElement('span');
const editItem = document.querySelector('#edit');
let todosList = document.querySelector('.todos-list');
let paginationElement = document.querySelector('#pagination');

let info = {};

//regex
const titleRegex = /^([a-zA-Z0-9_-\s]){2,15}$/;
// get data from api
function getData() {
    todosList.innerHTML = `<div class="d-flex justify-content-center">
                                <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>`;
    fetch('https://6347f21b0484786c6e8d835e.mockapi.io/todos',
    {
        method: "GET"
    })
	.then(response => response.json())
	.then(data => {
        renderData(data);
    } )
	.catch(err => {
        alert.classList.remove('alert-success');
        alert.classList.add('alert-danger');
        alertMessageElement.textContent = "";
        alertMessageElement.textContent = err;
        alert.appendChild(alertMessageElement);
        alert.classList.add('show');
        todosList.innerHTML = "";
    });
    // .finally(()=> {
    //     document.querySelector('.spinner-border').remove;
    // });
}

function getDataById(id) {
    fetch(`https://6347f21b0484786c6e8d835e.mockapi.io/todos/${id}`,
    {
        method: "GET"
    })
	.then(response => response.json())
	.then((data) => {
        setData(data);
    })
	.catch(err => {
        alert.classList.remove('alert-success');
        alert.classList.add('alert-danger');
        alertMessageElement.textContent = "";
        alertMessageElement.textContent = err;
        alert.appendChild(alertMessageElement);
        alert.classList.add('show');
        todosList.innerHTML = "";
    });
}

function sendData(obj) {
    fetch('https://6347f21b0484786c6e8d835e.mockapi.io/todos', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
    })
    .then((response) => response.json())
    .then(() => {
        const alertMessageElement = document.createElement('span');

        alertMessageElement.textContent = "";
        alertMessageElement.textContent = "information sended successfully";
        alert.appendChild(alertMessageElement);
        alert.classList.add('show');
        setInterval(() => {
            location.reload();
        }, 2000)
    })
    .catch((error) => {
        alert.classList.remove('alert-success');
        alert.classList.add('alert-danger');
        const alertMessageElement = document.createElement('span');
        alertMessageElement.textContent = "";
        alertMessageElement.textContent = error;
        alert.appendChild(alertMessageElement);
        alert.classList.add('show');
    });
}

function updateData(obj) {
    console.log('info', obj);
    fetch(`https://6347f21b0484786c6e8d835e.mockapi.io/todos/${obj.id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
    })
    .then((response) => {
        if(response.ok) {
            const alertMessageElement = document.createElement('span');
            alertMessageElement.textContent = "";
            alertMessageElement.textContent = "information updated successfully";
            alert.appendChild(alertMessageElement);
            alert.classList.add('show');
            setInterval(() => {
                location.reload();
            }, 2000);
        } else if(response.status === 404) {
            setInterval(() => {
                location.href = "404.html";
            }, 10000);
            
        }
    })
    .catch((error) => {
        alert.classList.remove('alert-success');
        alert.classList.add('alert-danger');
        const alertMessageElement = document.createElement('span');
        alertMessageElement.textContent = "";
        alertMessageElement.textContent = error;
        alert.appendChild(alertMessageElement);
        alert.classList.add('show');
    });
}

function validate(event) {
    if(title.value.match(titleRegex)) {
        info.title = title.value;
        title.textContent = "";
        titleMessage.textContent = "";
    } else {
        titleMessage.classList.remove('d-none');
        titleMessage.classList.add('text-danger');
        titleMessage.textContent = "your value must contain a-z, A-Z, 0-9, - _ and at least 2 character";
    }

    info.description = description.value;

    if(dueDate.value) {
        info.dueDate = dueDate.value;
        dueDate.textContent = "";
        dateMessage.textContent = "";
        
    } else {
        dateMessage.classList.remove('d-none');
        dateMessage.classList.add('text-danger');
        dateMessage.textContent = "choose date like 2022/1/1 format";
    }
    const date = new Date().toISOString().slice(0, 10);
    info.createdAt = date;
    info.updatedAt = date;
    info.checked = false;

    if(info.title && info.dueDate) {
        if(event.target.id === "btn-submit") {
            sendData(info);
        } else if (event.target.id === "btn-save") {
            updateData(info);
        }
    }
}

function setData(item) {
    title.value = item.title;
    description.value = item.description;
    dueDate.value = item.dueDate;
    submit.classList.add('d-none');
    save.classList.remove('d-none');
    info.id = item.id;
}

function editFunc(event) {
    const id = event.target.dataset.id;
    const triggerEl = document.querySelector('#myTab button[data-bs-target="#home-tab-pane"]');
    bootstrap.Tab.getInstance(triggerEl).show();
    getDataById(id); 
}

function deleteFunc(event) {
    console.log('event', event.currentTarget);
    document.querySelector('.modal-item-title').textContent = event.currentTarget.dataset.title;
    document.querySelector('.modal-date').textContent = event.currentTarget.dataset.time;
    modal.style.display = "block";
    const {id} = event.currentTarget.dataset;
    document.querySelector('#modal-delete').addEventListener('click', () => {
        modal.style.display = "none";
        deleteData(id);
    });
}

function deleteData(id) {
    console.log('deleteData', id);
    fetch(`https://6347f21b0484786c6e8d835e.mockapi.io/todos/${id}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        }
    })
    .then((response) => {
        if(response.ok) {
            const alertMessageElement = document.createElement('span');
            alertMessageElement.textContent = "";
            alertMessageElement.textContent = "information deleted successfully";
            alert.appendChild(alertMessageElement);
            alert.classList.add('show');
            getData();
        } else {
            throw new Error("something is wrong in deleting item");
        }
    })
    .catch((error) => {
        alert.classList.remove('alert-success');
        alert.classList.add('alert-danger');
        const alertMessageElement = document.createElement('span');
        alertMessageElement.textContent = "";
        alertMessageElement.textContent = error;
        alert.appendChild(alertMessageElement);
        alert.classList.add('show');
    });
}
// pagination
let currentPage = 1;
let rows = 5;
function renderData(listItems) {
    console.log('renderData', listItems);
    DisplayList(listItems, todosList , rows , currentPage);
    setupPagination(listItems, paginationElement , rows);
}

function DisplayList(items , wrapper, rows, currentPage){
    wrapper.innerHTML = '';
    currentPage--;
    
    let start = rows * currentPage;
    let end = start + rows;
    let paginatedItems = items.slice(start , end)

    for (let i = 0; i < paginatedItems.length; i++) {
        let item = paginatedItems[i];
        todosList.innerHTML += `
                                <li class="border border-dark p-1 my-2 box position-relative">
                                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" ${item.checked && 'checked'}>
                                    <span class="h6 mx-2">${item.title}</span>
                                    <span class="fs-6 fw-lighter">${item.dueDate}</span>
                                    <p class="fs-6 fw-lighter d-block mt-2">${item.description}</p>
                                    <div class="position-absolute icon">
                                        <i data-id="${item.id}" class="bi bi-pencil-fill m-1" id="edit" onclick="editFunc(event)"></i>
                                        <button type="button"  data-id="${item.id}" data-title="${item.title}" data-time="${item.dueDate}" class="btn-delete" id="delete" onclick="deleteFunc(event)">
                                            <i class="bi bi-trash m-1"></i>
                                        </button>
                                    </div>
                                </li>`;
    }
}

function setupPagination(items, wrapper, rows) {
    wrapper.innerHTML = '';

    let pageCount = Math.ceil(items.length / rows)
    for (let i = 1; i < pageCount + 1; i++) {
        let btn = paginationBtn(i, items)
        wrapper.appendChild(btn)
    }
}

function paginationBtn(page ,items){
    let button = document.createElement("button")
    button.innerHTML = page;
    if(currentPage == page) {button.classList.add("active")}
    button.addEventListener('click', function(){
        currentPage = page;

        DisplayList(items , todosList , rows , currentPage);

        let currentBtn = document.querySelector('.pagenumber button.active');
        currentBtn.classList.remove('active');
        this.classList.add('active');
    })

    return button;
}

todos.addEventListener('click', getData);
submit.addEventListener('click', validate);
save.addEventListener('click', validate);


//modal

// Get the modal
const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const closeBtn = document.querySelector(".close");

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
  modal.style.display = "none";
}
// When the user clicks on no button in modal, close the modal
document.querySelector("#modal-cancel").addEventListener('click', () => {
    modal.style.display = "none";
})
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}