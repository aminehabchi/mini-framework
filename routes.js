console.log("Hello from routes.js");

class Framework {
    constructor() {
        this.routes = {};
    }

    route(path, component) {
        this.routes[path] = component;
    }

    start() {
        const navigateTo = () => {
            console.log("Current Hash:", window.location.hash);

            // Handle empty hash (default to "/")
            const path = window.location.hash.slice(1) || "/";

            const component = this.routes[path] || NotFoundComponent;
            const appContainer = document.querySelector("#app");

            appContainer.innerHTML = new component().render();
        };

        window.addEventListener("hashchange", navigateTo);
        navigateTo(); // Load initial route
    }
}

class NotFoundComponent {
    render() {
        return `<h1>404 - Not Found</h1>`;
    }
}

class Home {
    render() {
        return `<h1>Welcome to Home</h1>`;
    }
}

class About {
    render() {
        return `<h1>Welcome to About</h1>`;
    }
}

// Create app instance
const app = new Framework();
app.route("/", Home);
app.route("/about", About);
app.start();
