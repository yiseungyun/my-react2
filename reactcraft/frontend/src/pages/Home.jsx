import { createElement } from '../core/createElement.js';

const Home = () => {
  // const [count, setCount] = useState(0);
  let count = 0;

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => { setCount(count + 1) }}>
        증가
      </button>
      <button onClick={() => { setCount(count - 1) }}>
        감소
      </button>
    </div>
  );
};

export default Home;