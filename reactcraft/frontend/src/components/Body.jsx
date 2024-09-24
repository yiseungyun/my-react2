import { createElement } from '../utils/createElement.js';

export const Body = () => {
  return (
    <div>
      <p>바디</p>
      <button onClick={() => alert('버튼 클릭')}>버튼</button>
    </div>
  );
};
