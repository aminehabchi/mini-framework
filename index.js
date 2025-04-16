import mf from "./frame-work.js";
import { Component, CreateVElement } from "./frame-work.js";

class Home extends Component {
  constructor(Root, FrameWork, Props, State = {}) {
    super(FrameWork);
    this.props = Props;
    this.state = State;
    this.root = Root;
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

    this.frameWork.dif(this.frameWork._oldVDom, newVDom, this.frameWork.App);

    this.frameWork._oldVDom = this.getVDom();
  }

  increment() {
    this.setState("counter", this.getState("counter") + 1);
  }

  dincrement() {
    this.setState("counter", this.getState("counter") - 1);
  }

  // Return VDOM
  getVDom() {
    return CreateVElement(
      "div",
      {},
      CreateVElement(
        "h1",
        { class: "text" },
        "count :" + this.getState("counter")
      ),
      CreateVElement(
        "button",
        { onclick: () => this.increment() },
        "Incriment"
      ),
      CreateVElement(
        "button",
        { onclick: () => this.dincrement() },
        "Dicriment"
      )
    );
  }
}

let home = new Home("/", mf, {}, { counter: 0 });
// console.log(home.getVDom());

// home.onUpdate();

mf.routes["/"] = home;

mf.start();

// mf.setState({ count: 10 });
// mf.setState({ name: "sd" });

// const increment = () => {
//   mf.setState({ count: mf.getState("count") + 1 }, ComponentHome());

//   const newVDom = ComponentHome();

//   mf.dif(mf._oldVDom, newVDom, app);
//   mf._oldVDom = ComponentHome();
// };

// function ComponentHome() {
//   return mf.createVElement(
//     "div",
//     {},
//     mf.createVElement(
//       "h1",
//       { class: "text" },
//       "count :" + mf.getState("count")
//     ),
//     mf.createVElement("button", { onclick: increment }, "add")
//   );
// }

// app.appendChild(mf.render(ComponentHome()));
// mf._oldVDom = ComponentHome();
