const vdom = null;

const miniFramwork = {
  _state: {},
  _oldVDom: undefined,
  App: document.getElementById("app"),
  routes: {},
  createVElement: (tag, props, ...children) => {
    return {
      tag,
      props,
      children,
    };
  },

  render: (vdom) => {
    if (typeof vdom == "string") {
      return document.createTextNode(vdom);
    }

    const ele = document.createElement(vdom.tag);
    for (let k in vdom.props) {
      if (k.startsWith("on")) {
        ele[k] = vdom.props[k];
      } else {
        ele.setAttribute(k, vdom.props[k]);
      }
    }

    vdom.children.forEach((child) =>
      ele.appendChild(miniFramwork.render(child))
    );

    return ele;
  },

  setState(newState) {
    this._state = { ...this._state, ...newState };
  },

  dif(oldVDom, newVDom, parent) {
    if (typeof oldVDom !== typeof newVDom) {
      parent.appendChild(this.render(newVDom), parent.firstChild);
      return;
    }

    if (typeof oldVDom === "string") {
      if (oldVDom !== newVDom) {
        parent.replaceChild(this.render(newVDom), parent.firstChild);
      }
      return;
    }

    if (oldVDom.tag !== newVDom.tag) {
      parent.replaceChild(this.render(newVDom), parent.firstChild);
      return;
    }

    const realDom = parent.firstChild;

    // Update props
    const allProps = { ...oldVDom.props, ...newVDom.props };
    for (let prop in allProps) {
      const oldVal = oldVDom.props[prop];
      const newVal = newVDom.props[prop];

      if (newVal === undefined) {
        realDom.removeAttribute(prop);
      } else if (oldVal !== newVal) {
        realDom.setAttribute(prop, newVal);
      }
    }

    // Diff children
    const max = Math.max(oldVDom.children.length, newVDom.children.length);
    for (let i = 0; i < max; i++) {
      const oldChild = oldVDom.children[i];
      const newChild = newVDom.children[i];
      const realDomChild = realDom.childNodes[i];

      if (!oldChild) {
        realDom.appendChild(this.render(newChild));
      } else if (!newChild) {
        realDom.removeChild(realDomChild);
      } else {
        this.dif(oldChild, newChild, realDomChild.parentNode);
      }
    }
  },

  getState(name) {
    return this._state[name];
  },

  renderThisPath(path) {
    const component = this.routes[path];
    let a = new component();

    this.dif({}, component.getVDom(), this.App);
  },

  start() {
    const currentPath = window.location.pathname;
    this.renderThisPath(currentPath);
  },
};

export class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this.root = null; // DOM root of this component
  }

  setState(name, value) {
    this.state[name] = value;
    this.update(); // trigger re-render
  }

  // Called when component is mounted to DOM
  onMount() {}

  // Called when component updates
  onUpdate() {}

  // Called when component is destroyed
  onDestroy() {}

  // Responsible for returning HTML/DOM
  render() {
    throw new Error("Render method should be implemented by subclass");
  }

  // Mount the component to a parent element
  mount(parent) {
    this.root = this.render();
    parent.appendChild(this.root);
    this.onMount();
  }

  // Destroy component
  destroy() {
    this.onDestroy();
    if (this.root) {
      this.root.remove();
    }
  }
}

export default miniFramwork;

export function CreateVElement(tag, props, ...children) {
  return {
    tag,
    props,
    children,
  };
}
