// Extract Module Logic (like Zustand) into a Custom React Hook 1
import { useEffect, useState } from "react";

const createStore = (initialState) => {
  let state = initialState;
  const getState = () => state;
  const setState = (nextState) => {
    state = nextState;
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

const store = createStore({ count: 0 });

// добавляем хук useStore
const useStore = (store) => {
  // выносим локальное состояние модуля в хук
  const [state, setState] = useState(store.getState());

  // выносим управление подпиской / отпиской — логику синхронизации локального состояния компонента с состоянием модуля
  useEffect(() => {
    const callback = () => {
      setState(store.getState());
    };
    callback();

    const unsubscribe = store.subscribe(callback);
    return unsubscribe;
  }, [store]);

  // Хук возвращает:
  // - локальнео состояние и
  // - ФУНКЦИЮ, которая обновляет состояние модуля и локальное состояние всех инициализированных компонентов
  return [state, store.setState];
};

const Counter = () => {
  const [state, setState] = useStore(store);

  const inc = () => {
    const nextState = { count: state.count + 1 };
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
