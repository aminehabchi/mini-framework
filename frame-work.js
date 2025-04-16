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


    vdom.children?.forEach((child) =>
      ele.appendChild(miniFramwork.render(child))
    );

    return ele;
  },

  setState(newState) {
    this._state = { ...this._state, ...newState };
    this.start()
  },

  getState(name) {
    return this._state[name];
  },


  dif(oldVDom, newVDom, parent, current) {

    if (typeof oldVDom !== typeof newVDom) {
      parent.innerHTML = ''
      parent.appendChild(this.render(newVDom));
      return;
    }

    if (typeof oldVDom === "string") {
      if (oldVDom !== newVDom) {
        parent.innerHTML = ''
        parent.appendChild(this.render(newVDom));
      }
      return;
    }

    if (oldVDom.tag !== newVDom.tag) {
      parent.innerHTML = ''
      parent.appendChild(this.render(newVDom));
      return;
    }



    const oldProps = oldVDom.props || {};
    const newProps = newVDom.props || {};
    for (let key in { ...oldProps, ...newProps }) {

      const oldVal = oldProps[key];
      const newVal = newProps[key];
      if (oldVal !== newVal) {
        if (key.startsWith("on") && typeof newVal === "function") {
          current[key.toLowerCase()] = newVal;
        } else if (newVal == null || newVal === undefined) {
          current.removeAttribute(key);
        } else {
          current.setAttribute(key, newVal);
        }
      }
    }



    const max = Math.max(oldVDom.children.length, newVDom.children.length);


    for (let i = 0; i < max; i++) {
      const oldChild = oldVDom.children[i];
      const newChild = newVDom.children[i];

      if (!oldChild) {
        current.appendChild(this.render(newChild));
      } else if (!newChild) {
        current.removeChild(current.children[i]);
      } else {



        if (oldChild.props?.key != newChild.props?.key) {
          current.removeChild(current.children[i])
          return
        }

        this.dif(oldChild, newChild, current, current.children[i]);
  
      }
    }


  },


  renderThisPath(path) {
    const component = this.routes[path];
    const newVDom = component.getVDom(); // only call once
    this.dif(this._oldVDom, newVDom, this.App, this.App.firstChild);

    this._oldVDom = newVDom;

    // Lifecycle hook
    if (typeof component.onMount === "function") {
      component.onMount();
    }
  },

  start() {
    const currentPath = window.location.pathname;
    this.renderThisPath(currentPath);
  },
};

export class Component {
  constructor(Route, FrameWork, Props, State = {}) {
    this.props = Props;
    this.state = State;
    this.Route = Route;
    this.frameWork = FrameWork;
  }

  setState(name, value) {
    this.state[name] = value;
    this.onUpdate(); // trigger re-render
  }

  getState(name) {
    return this.state[name];
  }

  // Called when component updates
  onUpdate() {
    const newVDom = this.getVDom();
    this.frameWork.dif(this.frameWork._oldVDom, newVDom, this.frameWork.App, this.frameWork.App.firstChild);

    this.frameWork._oldVDom = newVDom;
  }
  // Called when component is mounted to DOM
  onMount() { }

  // Called when component is destroyed
  onDestroy() { }


  // Mount the component to a parent element
  // mount(parent) {
  //   this.root = this.render();
  //   parent.appendChild(this.root);
  //   this.onMount();
  // }

  // // Destroy component
  // destroy() {
  //   this.onDestroy();
  //   if (this.root) {
  //     this.root.remove();
  //   }
  // }
  getVDom() {

    return CreateVElement("h1", {}, "Default")
  }
}

export default miniFramwork;

export function CreateVElement(tag, props = {}, ...children) {
  return {
    tag,
    props,
    children,
  };
}
