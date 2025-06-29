const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const checkCollision = (spriteA, spriteB) => {
  const rectA = { x: spriteA.x, y: spriteA.y, width: 80, height: 80 };
  const rectB = { x: spriteB.x, y: spriteB.y, width: 80, height: 80 };

  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.y + rectA.height > rectB.y
  );
};

export default async function runAnimation(spriteId, allSprites, setSprites, heroMode) {
  let currentSprites = { ...allSprites };
  let script = [...currentSprites[spriteId].script];

  const executeBlock = async (block) => {
    switch (block.id) {
      case 'MOVE Forward': {
        const steps = block.values[0];
        const rad = (currentSprites[spriteId].direction * Math.PI) / 180;
        currentSprites[spriteId].x += steps * Math.sin(rad);
        currentSprites[spriteId].y += steps * Math.cos(rad);
        setSprites({ ...currentSprites });
        await wait(50);
        break;
      }

      case 'TURN_RIGHT': {
        const degrees = block.values[0];
        currentSprites[spriteId].direction -= degrees;
        setSprites({ ...currentSprites });
        await wait(50);
        break;
      }

      case 'GOTO_XY': {
        currentSprites[spriteId].x = block.values[0];
        currentSprites[spriteId].y = block.values[1];
        setSprites({ ...currentSprites });
        await wait(50);
        break;
      }

      case 'SAY_FOR_SECS': {
        const message = block.values[0];
        const duration = block.values[1] * 1000;
        currentSprites[spriteId].message = message;
        currentSprites[spriteId].isThinking = false;
        setSprites({ ...currentSprites });
        await wait(duration);
        currentSprites[spriteId].message = null;
        setSprites({ ...currentSprites });
        break;
      }

      case 'THINK_FOR_SECS': {
        const message = block.values[0];
        const duration = block.values[1] * 1000;
        currentSprites[spriteId].message = message;
        currentSprites[spriteId].isThinking = true;
        setSprites({ ...currentSprites });
        await wait(duration);
        currentSprites[spriteId].message = null;
        setSprites({ ...currentSprites });
        break;
      }

      case 'REPEAT': {
        const times = block.values[0]*2;
        const nested = block.children || [];

        for (let i = 0; i < times; i++) {
          for (const nestedBlock of nested) {
            const result = await executeBlock(nestedBlock);
            if (result?.swappedWith) return result;
          }
        }
        break;
      }

      default:
        break;
    }

    // Hero collision detection
    if (heroMode) {
      for (const otherId in currentSprites) {
        if (spriteId !== otherId) {
          if (checkCollision(currentSprites[spriteId], currentSprites[otherId])) {
            const spriteA = currentSprites[spriteId];
            const spriteB = currentSprites[otherId];
            console.log(`Collision detected between ${spriteA.name} and ${spriteB.name}. Swapping scripts.`);

            const temp = spriteA.script;
            spriteA.script = spriteB.script;
            spriteB.script = temp;
            setSprites({ ...currentSprites });

            return { swappedWith: otherId };
          }
        }
      }
    }

    return null;
  };

  // Main loop
  for (const block of script) {
    const result = await executeBlock(block);
    if (result?.swappedWith) return result;
  }

  return null;
}
