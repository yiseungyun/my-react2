import { Body } from "./Body.js";
import { Header } from "./Header.js";
import { createElement } from "../utils/createElement.js";

const App = () => {
  return (
    <div>
      <Header />
      <Body />
    </div>
  );
};

export default App;