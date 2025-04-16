import mf from "./frame-work.js";
import { Component, CreateVElement } from "./frame-work.js";


function addtask(e) {
  if (e.key == "Enter") {
    if (e.target.value == "") return
    let arr = todo.getState("tasks")
    arr.push(e.target.value)
    todo.setState("tasks", arr)
    e.target.value = ""
    todo.setState("input", "")
  }
}

function Header() {
  return CreateVElement("div", { class: "header" }, CreateVElement("input", { value: todo.getState("input"), onkeyup: addtask, placeholder: "add task" }))
}

function Main(tasks) {
  let arr = []
  for (let i = 0; i < tasks.length; i++) {
    arr.push(CreateVElement("div", { "key": i }, tasks[i]))
  }
  return CreateVElement("div", { class: "main" }, ...arr)
}


let todo = new Component("/", mf, {}, { input: "", tasks: [] });


todo.getVDom = () => {

  return CreateVElement("div", {},
    Header(),
    Main(todo.getState("tasks"))
  )
}







mf.routes["/"] = todo;

mf.start();