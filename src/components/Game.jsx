import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from './phaser/GameScene';
import SecondMapScene from './phaser/secondMapScene';
import ThirdMapScene from './phaser/ThirdMapScene';
import FishingResultScene from './phaser/FishingResultScene';

function Game() {
  const gameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (gameRef.current || !containerRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 400,
      parent: containerRef.current,
      physics: { default: 'arcade', arcade: { debug: false } },
      scene: [GameScene, SecondMapScene, ThirdMapScene,FishingResultScene,],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={{ width: '800px', height: '400px' }} />;
}

export default Game;
