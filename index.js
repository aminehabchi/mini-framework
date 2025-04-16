import mf from "./frame-work.js";
import { Component, CreateVElement } from "./frame-work.js";


function addtask(e) {
  if (e.key == "Enter") {
    if (e.target.value == "") return
    let arr = todo.getState("tasks")
    arr.push({ value: e.target.value, key: Number(new Date), status: "active" })
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
    CreateVElement("input", { value: todo.getState("input"), onkeyup: addtask, placeholder: "add task" }))
}

function DeleteTask(key) {


  let arr = removeTask(todo.getState("tasks"), key)
  todo.setState("tasks", arr)
}

function reverseStatus(key) {
  let tasks = todo.getState("tasks");

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].key == key) {
      if (tasks[i].status == "active") {
        tasks[i].status = "completed"
      } else {
        tasks[i].status = "active"
      }
      todo.setState(tasks);
    }
  }

}

function Main(tasks) {
  let arr = []


  for (let i = 0; i < tasks.length; i++) {
    arr.push(
      CreateVElement("div", {
        "class": "task",
        "key": tasks[i].key
      },
        CreateVElement("input", { onclick: () => reverseStatus(tasks[i].key), type: "checkbox" }),
        CreateVElement("p", {}, tasks[i].value),
        CreateVElement("p", {}, tasks[i].status),
        CreateVElement("div", { class: "delete", onclick: () => DeleteTask(tasks[i].key) }, "X")
      ))
  }

  return CreateVElement("main", { class: "main" }, ...arr)
}

function Footer() {
  return CreateVElement("footer", { class: "footer" },
    CreateVElement("span", { class: "btn" }, "All"),
    CreateVElement("span", { class: "btn" }, "Active"),
    CreateVElement("span", { class: "btn" }, "Completed")
  )
}


let todo = new Component("/", mf, {}, { input: "", tasks: [] });


todo.getVDom = () => {

  return CreateVElement("div", {},
    Header(),
    Main(todo.getState("tasks")),
    Footer()
  )
}





mf.routes["/"] = todo;

mf.start();