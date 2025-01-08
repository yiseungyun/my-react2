import { createRoot } from '../react/package/react-dom/client.js';
import App from './App.js';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);