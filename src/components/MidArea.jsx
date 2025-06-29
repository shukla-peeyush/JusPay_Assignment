import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { SpriteContext } from '../contexts/SpriteContext';
import { v4 as uuidv4 } from 'uuid';


const ScriptBlock = ({ block, index, parentScript, onUpdate }) => {
  const handleValueChange = (valIndex, newValue) => {
    const updatedScript = [...parentScript];
    updatedScript[index].values[valIndex] =
      typeof newValue === 'number' ? parseInt(newValue, 10) : newValue;
    onUpdate(updatedScript);
  };

  const handleNestedUpdate = (updatedChildren) => {
    const updatedScript = [...parentScript];
    updatedScript[index].children = updatedChildren;
    onUpdate(updatedScript);
  };

  const getInput = (value, valIndex) => (
    <input
      type={typeof value === 'number' ? 'number' : 'text'}
      value={value}
      className="w-20 mx-1 text-black text-center rounded"
      onChange={(e) =>
        handleValueChange(valIndex, typeof value === 'number' ? parseInt(e.target.value, 10) : e.target.value)
      }
    />
  );

  const renderLabel = () => {
    const parts = block.label.split('__');
    return parts.map((part, i) => (
      <React.Fragment key={i}>
        {part}
        {i < block.values.length && getInput(block.values[i], i)}
      </React.Fragment>
    ));
  };

  return (
    <div className="mb-2">
      <div className="flex flex-row items-center bg-blue-500 text-white px-4 py-2 text-sm rounded-lg">
        {renderLabel()}
      </div>

      
      {block.id === 'REPEAT' && (
        <RepeatDropArea
          nestedBlocks={block.children || []}
          onUpdate={handleNestedUpdate}
        />
      )}
    </div>
  );
};


const RepeatDropArea = ({ nestedBlocks, onUpdate }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'block',
    drop: (item) => {
      const newBlock = {
        ...item,
        key: uuidv4(),
        values: [...item.values],
        children: item.id === 'REPEAT' ? [] : undefined,
      };
      const updated = [...nestedBlocks, newBlock];
      onUpdate(updated);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`ml-6 mt-2 p-2 border-l-4 border-blue-300 bg-blue-50 ${isOver ? 'bg-green-100' : ''}`}
    >
      {nestedBlocks.length === 0 && <p className="text-sm text-gray-500">Drop blocks here</p>}
      {nestedBlocks.map((block, index) => (
        <ScriptBlock
          key={block.key}
          block={block}
          index={index}
          parentScript={nestedBlocks}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default function MidArea() {
  const { sprites, setSprites, activeSprite } = useContext(SpriteContext);
  const activeScript = sprites[activeSprite]?.script || [];

  const handleMainUpdate = (updatedScript) => {
    const updatedSprites = JSON.parse(JSON.stringify(sprites));
    if (updatedSprites[activeSprite]) {
      updatedSprites[activeSprite].script = updatedScript;
      setSprites(updatedSprites);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'block',
    drop: (item) => {
      const newBlock = {
        ...item,
        key: uuidv4(),
        values: [...item.values],
        children: item.id === 'REPEAT' ? [] : undefined,
      };
      const updated = [...activeScript, newBlock];
      handleMainUpdate(updated);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [activeScript]);

  return (
    <div
      ref={drop}
      className={`flex-1 h-full overflow-auto p-4 ${isOver ? 'bg-green-100' : ''}`}
    >
      <h2 className="text-xl font-bold mb-4">
        Script for {sprites[activeSprite]?.name || 'None'}
      </h2>
      {activeScript.length === 0 && (
        <p className="text-gray-400">Drag blocks here</p>
      )}
      {activeScript.map((block, index) => (
        <ScriptBlock
          key={block.key}
          block={block}
          index={index}
          parentScript={activeScript}
          onUpdate={handleMainUpdate}
        />
      ))}
    </div>
  );
}
