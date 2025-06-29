import { app } from "../bomberman/main.js";

export function diff(oldVTree, newVTree) {
  // Handle null/undefined cases
  if (!oldVTree) {
    return (parent) => parent.appendChild(VDomToReelDom(newVTree));
  }

  if (!newVTree) {
    return (parent) => parent.remove();
  }

  // Handle type or tag changes
  if (typeof oldVTree !== typeof newVTree || oldVTree.tag !== newVTree.tag) {
    return (parent) => parent.replaceWith(VDomToReelDom(newVTree));
  }

  // Handle text nodes
  if (typeof oldVTree === "string" || typeof newVTree === "string") {
    return oldVTree !== newVTree
      ? (parent) => (parent.textContent = newVTree)
      : () => {}; // No change
  }

  // Handle element updates
  return (parent) => {
    updateProps(parent, oldVTree.props, newVTree.props);
    updateChildren(parent, oldVTree.children, newVTree.children);
  };
}

function updateProps(element, oldProps = {}, newProps = {}) {
  const allProps = { ...oldProps, ...newProps };

  for (const prop in allProps) {
    if (oldProps[prop] !== newProps[prop]) {
      setProp(element, prop, newProps[prop]);
    }
  }
}

function updateChildren(parent, oldChildren = [], newChildren = []) {
  const maxLength = Math.max(oldChildren.length, newChildren.length);

  // Update existing and add new children
  for (let i = 0; i < newChildren.length; i++) {
    if (i < oldChildren.length) {
      diff(oldChildren[i], newChildren[i])(parent.childNodes[i]);
    } else {
      parent.appendChild(VDomToReelDom(newChildren[i]));
    }
  }

  // Remove extra children (from end to avoid index issues)
  for (let i = oldChildren.length - 1; i >= newChildren.length; i--) {
    const childNode = parent.childNodes[i];
    if (childNode) {
      parent.removeChild(childNode);
    }
  }
}

function setProp(element, prop, value) {
  if (prop.startsWith("on") && typeof value === "function") {
    element[prop.toLowerCase()] = value;
  } else {
    element.setAttribute(prop, value || "");
  }
}

export function createVElement(tag, props = {}, children = []) {
  return { tag, props, children };
}

export function VDomToReelDom(vnode) {
  // Handle text nodes
  if (typeof vnode !== "object") {
    return document.createTextNode(String(vnode));
  }

  // Handle empty tag
  if (vnode.tag === "") {
    return document.createTextNode("");
  }

  const element = document.createElement(vnode.tag);

  // Set properties
  for (const prop in vnode.props) {
    handleProp(element, prop, vnode.props[prop]);
  }

  // Append children
  vnode.children?.forEach((child) => {
    element.appendChild(VDomToReelDom(child));
  });

  return element;
}

function handleProp(element, prop, value) {
  if (prop === "ref") {
    app.setRef(value, element);
  } else if (prop.startsWith("on") && typeof value === "function") {
    // Attach event listener
    element[prop.toLowerCase()] = value;

    // Register cleanup function
    app.Event.push(() => {
      element[prop.toLowerCase()] = null;
    });
  } else {
    // Set normal attribute
    element.setAttribute(prop, value);
  }
}

export function updateDOM(parent, oldVTree, newVTree) {
  const patch = diff(oldVTree, newVTree);
  patch(parent);
}
