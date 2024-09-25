import { React } from "../core/react.js";
import Todos from "./Todos.js";

const Home = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => { setCount(count => count + 1) }}>
        증가
      </button>
      <button onClick={() => { setCount(count => count - 1) }}>
        감소
      </button>
      <Todos />
    </div>
  );
};

export default Home;