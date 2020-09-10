const api = new Todo();

function dateParse(date) {
  const options = { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit", day: "numeric", month: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString("id-ID", options);
}

async function loadTodo() {
  let todos = await api.get();
  const todoContainer = document.querySelector(".todo");
  if (todos.data.length <= 0) {
    todoContainer.innerHTML = `
        <div class="w-full rounded overflow-hidden shadow-lg bg-gray-300 my-1">
          <div class="p-2 w-full text-center">
              <p class="text-gray-600 text-base w-auto">Todo Kosong</p>
          </div>
        </div>
  `;
  } else {
    todoContainer.innerHTML = "";
    todos.data.forEach((t) => {
      todoContainer.innerHTML += todoCard(t);
    });
  }
}

function todoCard(data) {
  return `
        <div class="w-full rounded overflow-hidden shadow-lg bg-white hover:bg-gray-200 my-1">
          <div class="p-2 flex flex-row w-full">
            <div class="pl-3 w-5/6">
              <p class="text-gray-700 text-base w-auto py-2 cursor-pointer teks" data-todoid="${data.id}">${data.teks}</p>
              <span class="flex w-full text-gray-400">
                <p class="w-1/2">create: ${dateParse(data.created)}</p>
                <p class="w-1/2">update: ${dateParse(data.updated)}</p>
              </span>
            </div>
            <button type="button" class="button py-1 w-1/5 text-center hover:bg-red-300" data-todoid="${data.id}">
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" class="w-5 h-5 inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  fill="currentColor"
                  d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
  `;
}

function showSnackbar(message) {
  const snackbar = document.querySelector("#snackbar");
  snackbar.classList.toggle("show");
  snackbar.textContent = message;
  setTimeout(() => snackbar.classList.toggle("show"), 3000);
}

window.addEventListener("load", () => {
  loadTodo();
});

document.addEventListener("click", async (e) => {
  const et = e.target;
  if (et.classList.contains("button")) {
    let response = await api.delete(et.dataset.todoid);
    if (response.code === 200) {
      showSnackbar(response.message);
      loadTodo();
    }
  } else if (et.classList.contains("teks")) {
    input.value = et.textContent;
    window.localStorage.setItem("todoId", et.dataset.todoid);
  }
});

const input = document.querySelector("input");
input.addEventListener("keyup", async (event) => {
  let todoId = window.localStorage.getItem("todoId");
  if (event.key === "Enter") {
    let response = null;
    if (todoId) {
      response = await api.update(todoId, input.value);
      window.localStorage.removeItem("todoId");
    } else {
      response = await api.add(input.value);
    }
    if (response.code === 200) {
      showSnackbar(response.message);
      loadTodo();
    }
    input.value = "";
  }
});
