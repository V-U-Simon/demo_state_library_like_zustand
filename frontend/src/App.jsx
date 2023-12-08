// Share Module State Between Components in React Similar to Zustand 1
import { useState } from "react";

let moduleState = { count: 0 };

const Counter = () => {
  const [state, setState] = useState(moduleState);

  //  Каждый компонент отслеживает только свое локальное состояние, измнение которого вызывает рендер
  //  в этот момент в других компонентах состояние НЕ обновляется через setState
  //  следовательо React не знает об его изменении и рендер не вызвается
  const inc = () => {
    moduleState = { count: moduleState.count + 1 };
    setState(moduleState);
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
