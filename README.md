# 🧩 Custom JavaScript Framework

A lightweight front-end JavaScript framework built from scratch, featuring **virtual DOM**, **component-based architecture**, **client-side routing**, and **state management**. Perfect for learning how modern frameworks like React work under the hood or for building small SPAs.

---

## ✨ Features

- 🔄 **Virtual DOM** with efficient diffing and patching
- 🧱 **Component-based architecture** with lifecycle methods
- 🗺️ **Client-side routing** with navigation
- 📊 **Global and local state management**
- 📌 **Reference system** for DOM element access
- 🧹 **Automatic event cleanup** on route changes

---

## 📁 Project Structure

```
/framework
  ├── framework.js     # Core Framework class with routing & state
  ├── component.js     # Base Component and NotFoundComponent classes
  └── helpers.js       # Virtual DOM creation, diffing, and patching
```

---

## 🚀 Quick Start

### 1. Setup

Include the framework in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="./main.js"></script>
</body>
</html>
```

### 2. Initialize your app

Create `main.js`:

```js
import { Framework } from './framework/framework.js';
import { Home, Game } from './components.js';

export const app = new Framework({ score: 0 });

// Define routes
app.route("/", Home);
app.route("/game", Game);

// Start the application
app.start();
```

---

## 📖 API Reference

### 🧱 Components

All components extend the base `Component` class and must implement `getVDom()`:

```js
import { Component } from './framework/component.js';
import { createVElement } from './framework/helpers.js';

export class Home extends Component {
  getVDom() {
    return createVElement("div", { class: "home" }, [
      createVElement("h1", {}, ["Welcome to My App!"]),
      createVElement("button", { 
        onclick: () => this.framework.navigateTo("/game") 
      }, ["Start Game"])
    ]);
  }

  mounting() {
    console.log("Home component mounted");
  }

  unmounting() {
    console.log("Home component unmounting");
  }
}
```

### 🔧 Virtual DOM

Create elements using `createVElement(tag, props, children)`:

```js
// Simple element
createVElement("h1", {}, ["Hello World"]);

// Element with props
createVElement("div", { id: "container", class: "wrapper" }, [
  createVElement("p", {}, ["Content here"])
]);

// Element with event handlers
createVElement("button", { 
  onclick: () => console.log("Clicked!") 
}, ["Click Me"]);
```

### 📊 State Management

```js
// Set state and trigger re-render
this.framework.setState("score", 100);

// Set state without re-render
this.framework.setWState("temporary", true);

// Get state value
const currentScore = this.framework.getState("score");
```

### 📌 References

Access DOM elements directly:

```js
// Create element with ref
createVElement("input", { ref: "userInput", type: "text" }, []);

// Access the DOM element later
const inputElement = this.framework.getRef("userInput");
inputElement.focus();
```

### 🗺️ Routing

```js
// Define routes
app.route("/", HomeComponent);
app.route("/about", AboutComponent);
app.route("/contact", ContactComponent);

// Navigate programmatically
this.framework.navigateTo("/about");
```

### 🔄 Lifecycle Methods

```js
class MyComponent extends Component {
  mounting() {
    // Called after component is first rendered
    this.setupEventListeners();
  }

  unmounting() {
    // Called before navigating away from this component
    this.cleanup();
  }
}
```

---

## 💡 Complete Example

```js
import { Component } from './framework/component.js';
import { createVElement } from './framework/helpers.js';

class Counter extends Component {
  getVDom() {
    const count = this.framework.getState("count") || 0;
    
    return createVElement("div", { class: "counter" }, [
      createVElement("h2", {}, ["Counter App"]),
      createVElement("p", {}, [`Count: ${count}`]),
      createVElement("div", {}, [
        createVElement("button", { 
          onclick: () => this.increment() 
        }, ["+"]),
        createVElement("button", { 
          onclick: () => this.decrement() 
        }, ["-"]),
        createVElement("button", { 
          onclick: () => this.reset() 
        }, ["Reset"])
      ])
    ]);
  }

  increment() {
    const current = this.framework.getState("count") || 0;
    this.framework.setState("count", current + 1);
  }

  decrement() {
    const current = this.framework.getState("count") || 0;
    this.framework.setState("count", current - 1);
  }

  reset() {
    this.framework.setState("count", 0);
  }

  mounting() {
    console.log("Counter component mounted");
  }

  unmounting() {
    console.log("Counter component unmounting");
  }
}
```

---

## 🎯 Best Practices

- **Keep components small and focused** - Each component should have a single responsibility
- **Use refs sparingly** - Prefer state-driven updates over direct DOM manipulation
- **Clean up in unmounting()** - Remove timers, intervals, or external listeners
- **Leverage the virtual DOM** - Let the framework handle DOM updates for you

---

## 🔧 Browser Support

This framework uses modern JavaScript features:
- ES6 Modules
- Arrow functions
- Destructuring
- Optional chaining

Supported browsers: Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+

---

## 🚀 What's Next?

This framework demonstrates core concepts found in production frameworks. To extend it further, consider adding:

- Component props and data passing
- Computed properties and watchers
- Animation and transition system
- Server-side rendering support
- Development tools and debugging

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or suggest features
- Fork the project and submit pull requests
- Use this framework in your own projects
- Share your learning experience

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).