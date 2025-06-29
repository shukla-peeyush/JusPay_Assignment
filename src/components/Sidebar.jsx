import { Children } from 'react';
import { useDrag } from 'react-dnd';

const DraggableBlock = ({ block }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: () => ({ ...block }), // always return a new copy
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [block]);

  return (
    <div
      ref={drag}
      className={`flex flex-row items-center bg-blue-500 text-white px-4 py-2 my-2 text-sm cursor-pointer rounded-lg ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {block.label}
    </div>
  );
};

export default function Sidebar() {
  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold mb-4">Motion</div>
      <DraggableBlock block={{ id: 'MOVE Forward', label: 'Move Forward __ steps', values: [10] }} />
      <DraggableBlock block={{ id: 'TURN_RIGHT', label: 'Turn ↻ __ degrees', values: [15] }} />
      <DraggableBlock block={{ id: 'GOTO_XY', label: 'Go to x: __ y: __', values: [0, 0] }} />
      <DraggableBlock block={{ id: 'REPEAT', label: 'REPEAT __ times', values: [10], children:[{ id: 'MOVE Forward', label: 'Move Forward __ steps', values: [10] },{ id: 'TURN_RIGHT', label: 'Turn ↻ __ degrees', values: [15] }] }} />

      <div className="font-bold mt-6 mb-4">Looks</div>
      <DraggableBlock block={{ id: 'SAY_FOR_SECS', label: 'Say __ for __ secs', values: ['Hello!', 2] }} />
      <DraggableBlock block={{ id: 'THINK_FOR_SECS', label: 'Think __ for __ secs', values: ['Hmm...', 2] }} />
    </div>
  );
}
