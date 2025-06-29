import { updateDOM, VDomToReelDom } from "./helpers.js";
import { NotFoundComponent } from "./component.js";

export class Framework {
  constructor(state = {}) {
    this.routes = {};
    this.oldVTree = null;
    this.App = document.getElementById("app");
    this.state = state;
    this.Refs = {};
    this.Event = [];
    this.lastPath = undefined;
  }

  route(path, component) {
    this.routes[path] = component;
  }

  // Ref management
  setRef(name, value) {
    this.Refs[name] = value;
  }

  getRef(name) {
    return this.Refs[name];
  }

  // State management
  setWState(name, value) {
    this.state[name] = value;
  }

  setState(name, value) {
    this.state[name] = value;
    this.start();
  }

  getState(name) {
    return this.state[name];
  }

  // Get component for path
  getComponent(path) {
    const ComponentClass = this.routes[path] || NotFoundComponent;
    return new ComponentClass(this);
  }

  // Handle component lifecycle
  handleComponentLifecycle(path, component) {
    const pathChanged = this.lastPath !== path;

    // Unmount previous component
    if (pathChanged && this.lastPath && this.routes[this.lastPath]) {
      const lastComponent = this.getComponent(this.lastPath);
      lastComponent.UnMounting();
    }

    // Clean up event listeners on path change
    if (pathChanged) {
      this.Event.forEach((fn) => fn());
      this.Event = [];
    }

    // Mount new component
    if (pathChanged) {
      this.lastPath = path;
      component.Mounting();
    }
  }

  // Render current path
  renderthisPath(path) {
    const component = this.getComponent(path);
    const newVTree = component.getVDom();

    this.handleComponentLifecycle(path, component);

    // Update DOM
    if (this.oldVTree) {
      updateDOM(this.App.firstChild, this.oldVTree, newVTree);
    } else {
      this.App.appendChild(VDomToReelDom(newVTree));
    }

    this.oldVTree = newVTree;
  }

  navigateTo(newPath) {
    window.history.pushState({}, "", newPath);
    console.log("navigate to", newPath);
    this.renderthisPath(newPath);
  }

  start() {
    this.renderthisPath(window.location.pathname);
  }
}
