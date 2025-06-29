import React from 'react';
import Sidebar from './components/Sidebar';
import MidArea from './components/MidArea';
import PreviewArea from './components/PreviewArea';
import { SpriteProvider } from './contexts/SpriteContext'; 

export default function App() {
  return (
    <div className="bg-blue-100 font-sans">
      
      <SpriteProvider>
        <div className="h-screen overflow-hidden flex flex-row">
          <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
            <Sidebar />
            <MidArea />
          </div>
          
          <div className="w-1/2 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
            <PreviewArea />
          </div>
        </div>
      </SpriteProvider>
    </div>
  );
}
