# 🧩 Custom JavaScript Framework

This is a lightweight front-end JavaScript framework built from scratch, featuring a **virtual DOM**, **component-based architecture**, **client-side routing**, and **state management**. It's ideal for learning how modern frameworks like React work under the hood or for building small SPAs.

---

## 📦 Features

- ✅ Virtual DOM with diffing and patching  
- ✅ Component class with lifecycle methods (`Mounting`, `UnMounting`)  
- ✅ Global and local state management  
- ✅ Reference system (`setRef` / `getRef`)  
- ✅ Simple client-side routing with navigation  
- ✅ Event cleanup on route change  

---

## 🛠️ Project Structure

```
/framework
  ├── framework.js     # Core Framework class
  ├── component.js     # Base Component and NotFoundComponent
  └── helpers.js       # Virtual DOM helpers and diffing logic
```

---

## 🚀 Getting Started

### 1. Add the framework to your project

Include the files in your HTML via ES module imports:

```html
<script type="module" src="./main.js"></script>
```

Your `main.js` should initialize the app:

```js
import { Framework } from './framework/framework.js';
import { Home, Game } from './components.js';

export const app = new Framework({ score: 0 });

app.route("/", Home);
app.route("/game", Game);

app.start();
```

---

## 📚 Core Concepts

### 🧱 Components

Components extend the base `Component` class and implement the `getVDom()` method to return a virtual DOM.

```js
import { Component } from './framework/component.js';
import { createVElement } from './framework/helpers.js';

export class Home extends Component {
  getVDom() {
    return createVElement("div", {}, [
      createVElement("h1", {}, ["Welcome!"]),
      createVElement("button", { onClick: () => this.framework.navigateTo("/game") }, ["Play"])
    ]);
  }
}
```

### ⚙️ Virtual DOM

Instead of direct DOM manipulation, elements are created using virtual DOM objects:

```js
createVElement("div", { id: "container" }, ["Hello World"]);
```

The framework converts this virtual tree into real DOM and patches it on state or route changes.

---

### 🔄 State Management

You can store and update global state using:

```js
this.framework.setState("score", 42);
let current = this.framework.getState("score");
```

Or update without triggering a re-render:

```js
this.framework.setWState("temporary", true);
```

---

### 📌 Refs

Refs let you save and access real DOM elements:

```js
createVElement("input", { ref: "nameInput" }, []);
let inputEl = this.framework.getRef("nameInput");
```

---

### 🚦 Routing

Define routes using:

```js
app.route("/path", ComponentClass);
```

Navigate with:

```js
this.framework.navigateTo("/path");
```

A fallback `NotFoundComponent` is used for unknown paths.

---

### 🧼 Lifecycle Methods

Each component can define:

```js
Mounting() {
  // Called when component is rendered
}

UnMounting() {
  // Called before route changes away
}
```

---

## 🧪 Example

```js
class Game extends Component {
  getVDom() {
    return createVElement("div", {}, [
      createVElement("h1", {}, ["Game Page"]),
      createVElement("p", {}, [`Score: ${this.framework.getState("score")}`])
    ]);
  }

  Mounting() {
    console.log("Game mounted");
  }

  UnMounting() {
    console.log("Game unmounted");
  }
}
```

---

## 🧼 Cleanup

The framework automatically removes old event listeners when switching routes, keeping the DOM clean and memory-safe.


---

## 🙌 Contributing

Feel free to fork and improve this framework or integrate it into your own learning or game projects.