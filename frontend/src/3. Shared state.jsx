// Share Module State Between Components in React Similar to Zustand 3
import { useState } from "react";

// помещаем модульное состояние в замыкание
const createStore = (initialState) => {
  let state = initialState;
  const getState = () => state;
  const setState = (nextState) => {
    state = nextState;
  };

  return { getState, setState };
};

const store = createStore({ count: 0 });

const Counter = () => {
  // определяем локальное состояния помещая в него состояние модуля
  const [state, setState] = useState(store.getState());

  //  Как и в первом примере происходит рендер только текущего компонента.
  //  Каждый компонент отслеживает только свое локальное состояние, измнение которого вызывает рендер
  //  в этот момент в других компонентах состояние НЕ обновляется через setState
  //  следовательо React не знает об его изменении и рендер не вызвается
  const inc = () => {
    const nextState = { count: store.getState().count + 1 };
    store.setState(nextState);
    setState(nextState);
  };

  return (
    <div>
      {state.count} <button onClick={inc}>+1</button>
    </div>
  );
};

const App = () => (
  <>
    <h1>Counter1</h1>
    <Counter />
    <h1>Counter2</h1>
    <Counter />
  </>
);

export default App;
