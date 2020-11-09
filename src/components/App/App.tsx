import React from 'react';

import SnakeGame from 'components/SnakeGame';

import s from './App.module.scss';

function App() {
  return (
    <div className={s.root}>
      <SnakeGame />
    </div>
  );
}

export default App;
