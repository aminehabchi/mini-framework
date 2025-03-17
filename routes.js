console.log("Hello from routes.js");

class Framework {
  constructor() {
    this.routes = {};
    this.oldVTree = null; // Store the old Virtual DOM
    this.state = {}; // Global state object
    this.listeners = []; // State change listeners
  }

  route(path, component) {
    this.routes[path] = component;
  }

  // State management methods
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  getState() {
    return this.state;
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of state change
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
    this.renderCurrentRoute(); // Re-render the current route when state changes
  }

  // Render the current route
  renderCurrentRoute() {
    const path = window.location.hash.slice(1) || "/";
    const ComponentClass = this.routes[path] || NotFoundComponent;
    const component = new ComponentClass(this); // Pass framework instance to component
    const newVTree = component.render(); // Get Virtual DOM

    const appContainer = document.querySelector("#app");

    if (this.oldVTree) {
      updateDOM(appContainer.firstChild, this.oldVTree, newVTree);
    } else {
      appContainer.appendChild(render(newVTree)); // First render
    }

    this.oldVTree = newVTree; // Update old Virtual DOM
  }

  start() {
    const navigateTo = () => {
      console.log("Current path:", window.location.hash);
      const path = window.location.hash.slice(1) || "/";
      history.pushState(null, "", "" + path);
      this.renderCurrentRoute();
    };

    window.addEventListener("hashchange", navigateTo);
    navigateTo(); // Load initial route
  }
}

function diff(oldVTree, newVTree) {
  if (!oldVTree) {
    return (parent) => parent.appendChild(render(newVTree));
  }
  if (!newVTree) {
    return (parent) => parent.remove();
  }
  if (typeof oldVTree !== typeof newVTree || oldVTree.tag !== newVTree.tag) {
    return (parent) => parent.replaceWith(render(newVTree));
  }
  if (typeof oldVTree === "string" || typeof newVTree === "string") {
    if (oldVTree !== newVTree) {
      return (parent) => (parent.textContent = newVTree);
    }
    return () => {}; // No change
  }

  return (parent) => {
    for (const prop in { ...oldVTree.props, ...newVTree.props }) {
      if (oldVTree.props[prop] !== newVTree.props[prop]) {
        if (prop.startsWith("on") && typeof newVTree.props[prop] === "function") {
          parent[prop.toLowerCase()] = newVTree.props[prop];
        } else {
          parent.setAttribute(prop, newVTree.props[prop] || "");
        }
      }
    }

    const maxChildren = Math.max(
      oldVTree.children.length,
      newVTree.children.length
    );
    for (let i = 0; i < maxChildren; i++) {
      if (i < newVTree.children.length && i < oldVTree.children.length) {
        diff(oldVTree.children[i], newVTree.children[i])(parent.childNodes[i]);
      } else if (i < newVTree.children.length) {
        parent.appendChild(render(newVTree.children[i]));
      } else {
        parent.removeChild(parent.childNodes[i]);
      }
    }
  };
}

function createVElement(tag, props = {}, children = []) {
  return { tag, props, children };
}

function render(vnode) {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }
  const element = document.createElement(vnode.tag);

  for (const prop in vnode.props) {
    if (prop.startsWith("on") && typeof vnode.props[prop] === "function") {
      // ✅ Attach event listeners correctly
      element[prop.toLowerCase()] = vnode.props[prop];
    } else {
      // ✅ Set normal attributes
      element.setAttribute(prop, vnode.props[prop]);
    }
  }

  vnode.children.forEach((child) => element.appendChild(render(child)));
  return element;
}

function updateDOM(parent, oldVTree, newVTree) {
  const patch = diff(oldVTree, newVTree);
  patch(parent);
}

class Component {
  constructor(framework) {
    this.framework = framework;
  }

  // Helper to get state
  getState() {
    return this.framework.getState();
  }

  // Helper to update state
  setState(newState) {
    this.framework.setState(newState);
  }

  // Base render method
  render() {
    return createVElement("div", {}, ["Component"]);
  }
}

class NotFoundComponent extends Component {
  render() {
    return createVElement("h1", {}, ["404 - Not Found"]);
  }
}

class Home extends Component {
  render() {
    const state = this.getState();
    const counter = state.counter || 0;

    const incrementCounter = () => {
      this.setState({ counter: counter + 1 });
    };

    return createVElement("div", {}, [
      createVElement("h1", {}, ["Welcome to Home"]),
      createVElement("p", {}, [`Counter value: ${counter}`]),
      createVElement("button", { onclick: incrementCounter }, ["Increment Counter"])
    ]);
  }
}

class About extends Component {
  render() {
    const state = this.getState();
    const name = state.name || "Guest";

    const updateName = () => {
      const newName = prompt("Enter your name:", name);
      if (newName) {
        this.setState({ name: newName });
      }
    };

    return createVElement("div", {}, [
      createVElement("h1", { style: "background-color: coral;" }, ["Welcome to About"]),
      createVElement("p", {}, [`Hello, ${name}!`]),
      createVElement("button", { onclick: updateName }, ["Change Name"])
    ]);
  }
}

const app = new Framework();
app.route("/", Home);
app.route("/about", About);

// Initialize with some state
app.setState({ 
  counter: 0,
  name: "Guest" 
});

app.start();