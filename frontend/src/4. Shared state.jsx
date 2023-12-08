// Share Module State Between Components in React Similar to Zustand 4
import { useEffect, useState } from "react";

const createStore = (initialState) => {
  let state = initialState;
  const getState = () => state;
  const setState = (nextState) => {
    // обновляем текущее состояние модуля
    state = nextState;
    // обновляем локальные состояния всех инициализированных компонентов
    // поскольку listeners содержит список callback'ов
    // в качестве listener вызываем callback выполняющий setState(store.getState()) локальное состояние приводится к состоянию модуля
    listeners.forEach((listener) => {
      listener();
    });
  };

  // список фукнций которые синхранизируют локальное состояние компонента с состянием модуля
  const listeners = new Set();

  // реализация логики подписки / отписки
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return { getState, setState, subscribe };
};

const store = createStore({ count: 0 });

const Counter = () => {
  const [state, setState] = useState(store.getState());

  // осуществляем подписку при инициализации компонента (добавляем в listeners)
  useEffect(() => {
    // при вызове callback синхронизируем локальное состояние текущего компонента с состоянием модуля
    const callback = () => {
      setState(store.getState());
    };
    // передаем, через subscribe, в listeners фукнцию callback, которая изменяет локальное состояние
    const unsubscribe = store.subscribe(callback);
    return unsubscribe;
  }, []);

  const inc = () => {
    // обновляем состояние модуля
    const nextState = { count: store.getState().count + 1 };
    // выполняем обновление setState для локального состояния текущего компонента и всех других инициализированных компонентов
    // под капотом в store.setState вызывается setState для локального состояния (помещали его в  listeners при вызове useEffect)
    store.setState(nextState);
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
