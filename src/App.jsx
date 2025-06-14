import React from 'react';
import Game from './components/Game.jsx';
import './App.css'; // 스타일을 따로 분리

function App() {
  return (
    <div className="App">
      <h1>🎣 2D게임 프로토타입</h1>
      <Game />
    </div>
  );
}

export default App;