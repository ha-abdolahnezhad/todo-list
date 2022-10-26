const todos = document.querySelector("#todos-tab");
const form = document.querySelector("#form");
const submit = document.querySelector("#btn-submit");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const dueDate = document.querySelector("#date");
const titleMessage = document.querySelector('.title-message');
const dateMessage = document.querySelector('.date-message');
const alert = document.querySelector('.alert');
const alertMessage = document.querySelector('#alert-message');
const editItem = document.querySelector('#edit');
let todosList = document.querySelector('.todos-list');
let paginationElement = document.querySelector('#pagination');

let info = {};

//regex
const titleRegex = /^([a-zA-Z0-9_-\s]){2,15}$/;

window.onload = function () {
    const urlParams = new URLSearchParams(location.search);
    if(urlParams.has('id')) {
        getDataById(urlParams.get('id'));
    }
}


// get data from api
function getData() {
    todosList.innerHTML = `<div class="d-flex justify-content-center">
                                <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>`;
    fetch('https://6347f21b0484786c6e8d835e.mockapi.io/todos',
    {
        method: "GET",
    })
	.then(response => response.json())
	.then(data => {
        renderData(data);
    } )
	.catch(err => {
        alert.classList.remove('alert-success');
        alert.classList.add('alert-danger');
        alertMessage.textContent = "";
        alertMessage.textContent = err;
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
        alertMessage.textContent = "";
        alertMessage.textContent = err;
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
        alertMessage.textContent = "";
        alertMessage.textContent = "information sended successfully";
        alert.classList.add('show');
        form.reset();
    })
    .catch((error) => {
        alert.classList.remove('alert-success');
        alert.classList.add('alert-danger');
        alertMessage.textContent = "";
        alertMessage.textContent = error;
        alert.classList.add('show');
    });
}

function updateData(obj) {
    fetch(`https://6347f21b0484786c6e8d835e.mockapi.io/todos/${obj.id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
    })
    .then((response) => {
        if(response.ok) {
            alertMessage.textContent = "";
            alertMessage.textContent = "information updated successfully";
            form.reset();
            submit.textContent = "Submit";
            submit.classList.replace('btn-warning', 'btn-primary');
            alert.classList.add('show');
            history.replaceState({}, document.title, "/");
        } else if(response.status === 404) {
            setInterval(() => {
                location.href = "404.html";
            }, 2000);
            
        }
    })
    .catch((error) => {
        alert.classList.remove('alert-success');
        alert.classList.add('alert-danger');
        alertMessage.textContent = "";
        alertMessage.textContent = error;
        alert.classList.add('show');
    });
}

function validate(event) {
    event.preventDefault();
    if(title.value.match(titleRegex)) {
        info.title = title.value;
        title.textContent = "";
        titleMessage.textContent = "";
    } else {
        info.title = "";
        titleMessage.classList.remove('d-none');
        titleMessage.classList.add('text-danger');
        titleMessage.textContent = "your value must contain a-z, A-Z, 0-9, - _ and at least 2 character an maximum character is 15";
    }


    if(dueDate.value && (dueDate.value >= new Date().toISOString().slice(0, 10))) {
        info.dueDate = dueDate.value;
        dueDate.textContent = "";
        dateMessage.textContent = "";
    } else {
        info.dueDate = "";
        dateMessage.classList.remove('d-none');
        dateMessage.classList.add('text-danger');
        dateMessage.textContent = "choose date like 2022/1/1 format and biger or equal than today";
    }
    const date = new Date().toISOString().slice(0, 10);
    info.description = description.value;
    info.updatedAt = date;
    info.checked = false;
    const url = new URLSearchParams(location.search);
    if(info.title !=="" && info.dueDate !== "") {
        if(!url.has("id")) {
            sendData(info);
        } else if (url.has("id")) {
            info.id = url.get('id');
            updateData(info);
        }
    }
}

function setData(item) {
    title.value = item.title;
    description.value = item.description;
    dueDate.value = item.dueDate;
    submit.classList.replace('btn-primary', 'btn-warning');
    submit.textContent = "Save";
}

function editFunc(event) {
    location.href = `http://127.0.0.1:5500/?id=${event.target.dataset.id}`;
}

function deleteFunc(event) {
    document.querySelector('.modal-item-title').textContent = event.currentTarget.dataset.title;
    document.querySelector('.modal-date').textContent = event.currentTarget.dataset.time;
    modal.style.display = "block";
    const {id} = event.currentTarget.dataset;
    console.log('delete id', id);
    document.querySelector('#modal-delete').addEventListener('click', () => {
        modal.style.display = "none";
        deleteData(id);
    });
    event.remove();
}

function deleteData(id) {
    fetch(`https://6347f21b0484786c6e8d835e.mockapi.io/todos/${id}`, {
        method: 'DELETE'
    })
    .then((response) => {
        if(response.ok) {
            alertMessage.textContent = "";
            alertMessage.textContent = "information deleted successfully";
            alert.classList.add('show');
            getData();
        } else {
            throw new Error("something is wrong in deleting item");
        }
    })
    .catch((error) => {
        alert.classList.remove('alert-success');
        alert.classList.add('alert-danger');
        alertMessage.textContent = "";
        alertMessage.textContent = error;
        alert.classList.add('show');
    });
}
// pagination
let currentPage = 1;
let rows = 5;
function renderData(listItems) {
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
                                        <button type="button" class="btn-edit m-1" data-id="${item.id}" id="edit" onclick="editFunc(event)">
                                            <i class="bi bi-pencil-fill"></i>
                                        </button>
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