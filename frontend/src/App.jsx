// Share Module State Between Components in React Similar to Zustand 2
import { useEffect, useState } from "react";

let moduleState = { count: 0 };
const setStates = new Set();

const Counter = () => {
  const [state, setState] = useState(moduleState);

  // При инициализации компонента добавляем его в множество setState — для обновления локального состояния
  // А при размонтировании удалем из него setState
  useEffect(() => {
    setStates.add(setState);
    return () => setStates.delete(setState);
  }, []);

  // При изменеии состояния каждого компонента изменяем состояние модуля (moduleState)
  // и приводим к этому значению локальное состояние всех инициализированных компонентов
  // c помощью прохода в цикле по множеству setStates и применяя  хранящиеся в нём функции setState из компонентов
  // такми образом React узнает об их изменении и обнолвляет локальное состояние комопонентов, тем самым вызвая у них рендер
  const inc = () => {
    moduleState = { count: moduleState.count + 1 };
    setStates.forEach((fn) => fn(moduleState));
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
