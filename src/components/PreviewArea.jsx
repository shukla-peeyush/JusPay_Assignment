import React, { useContext, useState } from 'react';
import { SpriteContext } from '../contexts/SpriteContext';
import { v4 as uuidv4 } from 'uuid';
import CatSprite from './CatSprite';
import runAnimation from '../utils/animationEngine';

export default function PreviewArea() {
  const { sprites, setSprites, activeSprite, setActiveSprite } = useContext(SpriteContext);
  const [heroMode, setHeroMode] = useState(false);

  const handleAddSprite = () => {
    const newSpriteId = uuidv4();
    const newSprite = {
      name: "Football",
      x: 50,
      y: 50,
      direction: 90,
      costume: "/football.png",
      script: [],
    };
    setSprites({ ...sprites, [newSpriteId]: newSprite });
    setActiveSprite(newSpriteId);
  };

  const handlePlay = async () => {
    const alreadyRun = new Set();

    for (const spriteId of Object.keys(sprites)) {
      if (alreadyRun.has(spriteId)) continue;

      const result = await runAnimation(spriteId, sprites, setSprites, heroMode);

      if (result?.swappedWith) {
        alreadyRun.add(spriteId);
        alreadyRun.add(result.swappedWith);
        console.log(`Swap occurred between ${spriteId} and ${result.swappedWith}, skipping execution for swapped pair.`);
      }
    }
  };

  return (
    <div className="flex-none h-full w-full flex flex-col items-center p-2 relative">
      <div className="flex justify-center items-center mb-4">
        <button onClick={handlePlay} className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2">Play</button>
        <button onClick={() => setHeroMode(prev => !prev)} className={`px-4 py-2 rounded-lg ${heroMode ? 'bg-yellow-500 text black' : 'bg-gray-300 text gray-700'}`}> {heroMode ? 'Hero Feature' : 'Hero Feature'} </button>
      </div>

      {/* The Stage */}
      <div className="w-full h-3/5 bg-white border border-gray-300 relative">
        {Object.entries(sprites).map(([id, sprite]) => (
          <CatSprite key={id} id={id} sprite={sprite} />
        ))}
      </div>

      {/* Sprite List */}
      <div className="w-full h-2/5 p-2 bg-gray-100 mt-2">
        <h3 className="text-lg font-bold">Sprites</h3>
        <button onClick={handleAddSprite} className="bg-blue-500 text-white px-3 py-1 rounded text-sm my-2">Add Sprite</button>
        <div className="flex flex-row gap-2">
          {Object.entries(sprites).map(([id, sprite]) => (
            <div
              key={id}
              onClick={() => {
                console.log(`Selected sprite: ${sprite.name}`);
                setActiveSprite(id);
              }}
              className={`p-2 border-2 rounded cursor-pointer ${activeSprite === id ? 'border-blue-500' : 'border-transparent'}`}
            >
              <h4>X:{Math.round(sprite.x)} | Y:{Math.round(sprite.y)}</h4>
              <img src={sprite.costume} alt={sprite.name} className="w-12 h-12" />
              <p className="text-center text-sm">{sprite.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
