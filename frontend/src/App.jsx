import { useEffect, useState } from "react";

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

const useStore = (store) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => {
    const callback = () => {
      setState(store.getState());
    };
    const unsubscribe = store.subscribe(callback);
    callback();
    return unsubscribe;
  }, [store]);
  return [state, store.setState];
};

// Используем отдельные компоненты для различных данных состояния модели:
// - count1
// - count2
// При этом в случае изменения любого из значений состояния модели
// вызывается рендедер для всех компонентов которые используют хотя бы одно из его значений
const Counter1 = () => {
  console.log("render Counter1");

  const [state, setState] = useStore(store);
  const inc1 = () => {
    setState((prev) => ({
      ...prev,
      count1: prev.count1 + 1,
    }));
  };
  return (
    <div>
      {state.count1} <button onClick={inc1}>+1</button>
    </div>
  );
};

const Counter2 = () => {
  console.log("render Counter2");

  const [state, setState] = useStore(store);
  const inc2 = () => {
    setState((prev) => ({
      ...prev,
      count2: prev.count2 + 1,
    }));
  };
  return (
    <div>
      {state.count2} <button onClick={inc2}>+1</button>
    </div>
  );
};

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
