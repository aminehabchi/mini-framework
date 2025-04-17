import mf from "./frame-work.js";
import { Component, CreateVElement } from "./frame-work.js";


function addtask(e) {
  if (e.key == "Enter") {
    let input = e.target.value.trim()
    if (input == "") return
    let arr = todo.getState("tasks")
    arr.push({ value: input, key: Number(new Date), status: "" })
    todo.setState("tasks", arr)
    e.target.value = ""
    todo.setState("input", "")
  }
}
function removeTask(tasks, key) {
  return tasks.filter(task => task.key !== key);
}

function Header() {
  return CreateVElement("header", { class: "header" },
    CreateVElement("h1", {}, "todos"),
    CreateVElement("div", {},
      CreateVElement("input", { class: "new-todo", id: "todo-input", value: todo.getState("input"), onkeyup: addtask, placeholder: "What needs to be done?" }),
      CreateVElement("label", { class: "visually-hidden", for: "todo-input" })
    )
  )
}


function DeleteTask(key) {
  let arr = removeTask(todo.getState("tasks"), key)
  todo.setState("tasks", arr)
}

function reverseStatus(key) {
  let tasks = todo.getState("tasks");

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].key == key) {
      if (tasks[i].status == "") {
        tasks[i].status = "completed"
      } else {
        tasks[i].status = ""
      }
      todo.setState(tasks);
    }
  }

}

function CountCompletedTasks(tasks) {
  return tasks.filter(task => task.status === "").length;
}

function filterTasks(tasks, route) {

  if (route == "/") {
    console.log("ggg");
    
    return tasks
  }
  
  if (route == "/Active") {
    console.log("ddddd");
    
    return tasks.filter(task => task.status === "")
  }
  console.log("ssd");
  
  return tasks.filter(task => task.status === "/Completed")
}

function Main(tasks) {
  let arr = []


  for (let i = 0; i < tasks.length; i++) {
    arr.push(
      CreateVElement("li", {
        "class": tasks[i].status,
        "data-testid": "todo-item",
        "key": tasks[i].key
      }, CreateVElement("div", { class: "view" },
        CreateVElement("input", { class: "toggle", onclick: () => reverseStatus(tasks[i].key), type: "checkbox", "data-testid": "todo-item-toggle" }),
        CreateVElement("label", { "data-testid": "todo-item-label" }, tasks[i].value),
        CreateVElement("button", {
          class: "destroy", "data-testid": "todo-item-button", onclick: () => {
            DeleteTask(tasks[i].key)
          }
        }),
      )
      ))
  }

  return CreateVElement("main", { class: "main" },
    CreateVElement("ul", { class: "todo-list", "data-testid": "todo-list" }, ...arr)
  )
}



function Footer(lenght) {
  return CreateVElement("footer", { class: "footer" },
    CreateVElement("span", { class: "todo-count" }, lenght.toString() + " items left!"),
    CreateVElement("ul", { class: "filters" },
      CreateVElement("li", {}, CreateVElement("a", { onclick: () => mf.renderThisPath("/") }, "All"),),
      CreateVElement("li", {}, CreateVElement("a", { onclick: () => mf.renderThisPath("/Active") }, "Active"),),
      CreateVElement("li", {}, CreateVElement("a", { onclick: () => mf.renderThisPath("/Completed") }, "Completed"),),
    ),
    CreateVElement("button", { class: "clear-completed" }, "Clear completed")
  )
}


let todo = new Component("/", mf, {}, { input: "", tasks: [] });


todo.getVDom = () => {
  // console.log(filterTasks(todo.getState("tasks"), window.location.pathname));

  return CreateVElement("section", { class: "todoapp", id: "root" },
    Header(),
    Main(filterTasks(todo.getState("tasks"), window.location.pathname)),
    Footer(CountCompletedTasks(todo.getState("tasks")))
  )
}





mf.routes["/"] = todo;
mf.routes["/Active"] = todo;
mf.routes["/Completed"] = todo;
mf.start();