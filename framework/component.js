import { createVElement } from "./helpers.js";

export class Component {
  constructor(framework) {
    this.framework = framework;
  }

  // this function runs after first run
  Mounting() {}

  //this function runs when path change
  UnMounting() {}


  // Base render method
  getVDom() {
    return createVElement("div", {}, ["Component"]);
  }
}

export class NotFoundComponent extends Component {
  getVDom() {
    return createVElement("h1", {}, ["404 - Not Found"]);
  }
}
