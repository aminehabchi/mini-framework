import { app } from "../bomberman/main.js";
export function diff(oldVTree, newVTree) {
  if (!oldVTree) {
    return (parent) => {
      return parent.appendChild(VDomToReelDom(newVTree));
    };
  }
  if (!newVTree) {
    return (parent) => parent.remove();
  }
  if (typeof oldVTree !== typeof newVTree || oldVTree.tag !== newVTree.tag) {
    return (parent) => parent.replaceWith(VDomToReelDom(newVTree));
  }
  if (typeof oldVTree === "string" || typeof newVTree === "string") {
    if (oldVTree !== newVTree) {
      return (parent) => (parent.textContent = newVTree);
    }
    return () => { }; // No change
  }

  return (parent) => {
    for (const prop in { ...oldVTree.props, ...newVTree.props }) {
      if (oldVTree.props[prop] !== newVTree.props[prop]) {
        if (
          prop.startsWith("on") &&
          typeof newVTree.props[prop] === "function"
        ) {
          parent[prop.toLowerCase()] = newVTree.props[prop];
        } else {
          parent.setAttribute(prop, newVTree.props[prop] || "");
        }
      }
    }

    // Handle updates and additions
    for (let i = 0; i < newVTree.children?.length; i++) {
      if (i < oldVTree.children.length) {
        diff(oldVTree.children[i], newVTree.children[i])(parent.childNodes[i]);
      } else {
        parent.appendChild(VDomToReelDom(newVTree.children[i]));
      }
    }

    // Handle removals - removing from the end to avoid index issues
    for (
      let i = oldVTree.children?.length - 1;
      i >= newVTree.children?.length;
      i--
    ) {
      if (parent.childNodes[i]) {
        parent.removeChild(parent.childNodes[i]);
      }
    }
  };
}

export function createVElement(tag, props = {}, children = []) {
  return { tag, props, children };
}

export function VDomToReelDom(vnode) {
  if (typeof vnode != "object") {
    return document.createTextNode(String(vnode));
  }

  if (vnode.tag === "") {
    return document.createTextNode("");
  }
  const element = document.createElement(vnode.tag);

  for (const prop in vnode.props) {
    if (prop === "ref") {
      app.setRef(vnode.props[prop], element);
    } else if (
      prop.startsWith("on") &&
      typeof vnode.props[prop] === "function"
    ) {
      // ✅ Attach event listeners correctly
      element[prop.toLowerCase()] = vnode.props[prop];

      app.Event.push(() => {
        element[prop.toLowerCase()] = null
      })

    } else {
      // ✅ Set normal attributes
      element.setAttribute(prop, vnode.props[prop]);
    }
  }

  vnode?.children?.forEach((child) => element.appendChild(VDomToReelDom(child)));
  return element;
}

export function updateDOM(parent, oldVTree, newVTree) {
  const patch = diff(oldVTree, newVTree);
  patch(parent);
}
