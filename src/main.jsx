import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { SpriteProvider } from './contexts/SpriteContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <SpriteProvider>
        <App />
      </SpriteProvider>
    </DndProvider>
  </React.StrictMode>
);