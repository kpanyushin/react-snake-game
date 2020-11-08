import React from 'react';

import Snake from 'components/Snake';

import s from './App.module.scss';

function App() {
  return (
    <div className={s.root}>
      <Snake cellSize={20} />
    </div>
  );
}

export default App;
