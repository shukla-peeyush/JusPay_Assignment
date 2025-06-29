import React, { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const SpriteContext = createContext();

const createInitialSprites = () => {
  const id = uuidv4();
  return {
    [id]: {
      name: "Cat",
      x: 0,
      y: 0,
      direction: 90,
      costume: "/cat.png",
      script: [],
    }
  };
};

export const SpriteProvider = ({ children }) => {
  const [sprites, setSprites] = useState(createInitialSprites);
  const [activeSprite, setActiveSprite] = useState(Object.keys(sprites)[0]);

  const value = { sprites, setSprites, activeSprite, setActiveSprite };

  return (
    <SpriteContext.Provider value={value}>
      {children}
    </SpriteContext.Provider>
  );
};
