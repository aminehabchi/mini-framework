import { updateDOM } from "./helpers.js";
import { NotFoundComponent } from "./component.js";
import { VDomToReelDom } from "./helpers.js";

export class Framework {
  constructor(state) {
    this.routes = {};
    this.oldVTree = null; // Store the old Virtual DOM
    this.App = document.getElementById("app");
    this.state = state || {}; // Global state object
    this.Refs = {};
    this.Event = [];
    this.Lastpath = undefined;
  }

  route(path, component) {
    this.routes[path] = component;
  }

  //ref
  setRef(name, value) {
    this.Refs[name] = value;
  }

  getRef(name) {
    return this.Refs[name];
  }

  // State management methods
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

  // Render the current route
  renderthisPath(path) {
    let newVTree;
    let component;

    if (this.routes[path]) {
      const ComponentClass = this.routes[path];
      component = new ComponentClass(this);
      newVTree = component.getVDom();
    } else {
      const ComponentClass = NotFoundComponent;
      component = new ComponentClass(this);
      newVTree = component.getVDom();
    }

    if (this.Lastpath && this.Lastpath !== path) {
      if (this.routes[this.Lastpath]) {
        const lastComponentClass = this.routes[this.Lastpath];
        let lastComponent = new lastComponentClass(this);
        lastComponent.UnMounting();
      }
    }

    // remove listners if path change
    if (this.Lastpath !== path) {
      this.Event.forEach((fn) => {
        fn();
      });
      this.Event = [];
    }

    if (this.oldVTree) {
      updateDOM(this.App.firstChild, this.oldVTree, newVTree);
    } else {
      this.App.appendChild(VDomToReelDom(newVTree)); // First render
    }

    if (this.Lastpath !== path) {
      this.Lastpath = path;
      component.Mounting();
    }

    this.Lastpath = path;

    this.oldVTree = newVTree;
  }

  navigateTo(newPath) {
    // Update the browser's history with the new path without reloading the page
    window.history.pushState({}, "", newPath);
    console.log("navagate to ", newPath);
    // Call your custom render method to handle the content change
    this.renderthisPath(newPath);
  }

  start() {
    const path = window.location.pathname;

    this.renderthisPath(path);
  }
}
