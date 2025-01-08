import { createRoot } from '../react/packages/react-dom/client.js';
import App from './App.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);