import { createElement } from "../../src/utils/createElement.js";
import { Body } from "./Body.js";
import { Header } from "./Header.js";
var App = function App() {
  return createElement("div", null, createElement(Header, null), createElement(Body, null));
};
export default App;