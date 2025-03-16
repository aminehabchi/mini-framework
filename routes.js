console.log("Hello from routes.js");

class Framework {
    constructor() {
        this.routes = {};
        this.oldVTree = null; // Store the old Virtual DOM
    }

    route(path, component) {
        this.routes[path] = component;
    }

    start() {
        const navigateTo = () => {
            console.log("Current path:", window.location.hash);

            const path = window.location.hash.slice(1) || "/";
            history.pushState(null, "", "" + path);

            const component = this.routes[path] || NotFoundComponent;
            const newVTree = new component().render(); // Get Virtual DOM

            const appContainer = document.querySelector("#app");

            if (this.oldVTree) {
                updateDOM(appContainer.firstChild, this.oldVTree, newVTree);
            } else {
                appContainer.appendChild(render(newVTree)); // First render
            }

            this.oldVTree = newVTree; // Update old Virtual DOM
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
        return () => { }; // No change
    }

    return (parent) => {
        for (const prop in { ...oldVTree.props, ...newVTree.props }) {
            if (oldVTree.props[prop] !== newVTree.props[prop]) {
                parent.setAttribute(prop, newVTree.props[prop] || "");
            }
        }

        const maxChildren = Math.max(oldVTree.children.length, newVTree.children.length);
        for (let i = 0; i < maxChildren; i++) {
            diff(oldVTree.children[i], newVTree.children[i])(parent.childNodes[i]);
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

    vnode.children.forEach(child => element.appendChild(render(child)));
    return element;
}


function updateDOM(parent, oldVTree, newVTree) {
    const patch = diff(oldVTree, newVTree);
    patch(parent);
}




class NotFoundComponent {
    render() {
        return createVElement("h1", {}, ["404 - Not Found"]);
    }
}

class Home {

    render() {
        function click() {
            console.log("clicked");
        }
        
        return createVElement("button", { "onclick": click }, ["Welcome to Home"]);
    }
}

class About {
    render() {
        return createVElement("h1", {"style":"background-color: coral;"}, ["Welcome to About"]);
    }
}

const app = new Framework();
app.route("/", Home);
app.route("/about", About);
app.start();
