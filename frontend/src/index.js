import App from './App.js';
import { createRoot } from './react-dom/client.js';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);