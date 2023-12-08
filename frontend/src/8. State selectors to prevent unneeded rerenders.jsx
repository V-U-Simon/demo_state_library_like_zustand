import { useCallback, useEffect, useState } from "react";

const createStore = (initialState) => {
  let state = initialState;
  const getState = () => state;
  const setState = (nextState) => {
    state = typeof nextState === "function" ? nextState(state) : nextState;
    listeners.forEach((listener) => {
      listener();
    });
  };
  const listeners = new Set();
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return { getState, setState, subscribe };
};

const store = createStore({ count1: 0, count2: 0 });

// Identity — функция по умолчанию для селектора, возвращает полеченное ей состояние модуля
const identity = (storeState) => storeState;

// hook useStore с селектором значения из состояния модуля
// пример селектора, принимает глобальное состояние модуля и возвращает только часть от него: `(state) => state.count2`
const useStore = (store, selector = identity) => {
  // Выборка части состояния
  const [state, setState] = useState(selector(store.getState()));

  // Инициализация и обновление локального состояния компонента (синхронизация с состоянием модуля)
  useEffect(() => {
    const callback = () => {
      setState(selector(store.getState()));
    };
    callback();

    const unsubscribe = store.subscribe(callback);
    return unsubscribe;
  }, [store, selector]);

  return [state, store.setState];
};

// Counter1 component with selector for count1
const Counter1 = () => {
  console.log("render Counter1");

  const [count1, setState] = useStore(
    store,
    useCallback((state) => state.count1, []) // используем селектор, который возвращает нам первый счетчик
  ); // useCallback мемоизирует функцию для предотсвращения повторных рендеров

  const inc1 = () => {
    setState((prev) => ({
      ...prev,
      count1: prev.count1 + 1,
    }));
  };
  return (
    <div>
      {count1} <button onClick={inc1}>+1</button>
    </div>
  );
};

// Counter2 component with selector for count2
const Counter2 = () => {
  console.log("render Counter2");

  const [count2, setState] = useStore(
    store,
    useCallback((state) => state.count2, []) // используем селектор, который возвращает нам второй счетчик
  ); // useCallback мемоизирует функцию для предотсвращения повторных рендеров

  const inc2 = () => {
    setState((prev) => ({
      ...prev,
      count2: prev.count2 + 1,
    }));
  };
  return (
    <div>
      {count2} <button onClick={inc2}>+1</button>
    </div>
  );
};

// App component to show Counter1 and Counter2
const App = () => (
  <>
    <h1>Counter1</h1>
    <Counter1 />
    <Counter1 />
    <h1>Counter2</h1>
    <Counter2 />
    <Counter2 />
  </>
);

export default App;
