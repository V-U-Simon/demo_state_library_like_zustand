// Extract Module Logic (like Zustand) into a Custom React Hook 2
import { useEffect, useState } from "react";

const createStore = (initialState) => {
  let state = initialState;
  const getState = () => state;

  // добавляем возможность обновления "сложных объектов" состояния
  const setState = (nextState) => {
    // если функция, то передаем в качестве аргумента текущее состояние модуля для обновления этого состояния там, в этой функции — nextState(state)
    // если объект, то заменяем на новое состояние — nextState
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

const store = createStore({ count: 0 });

const useStore = (store) => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const callback = () => {
      setState(store.getState());
    };
    callback();

    const unsubscribe = store.subscribe(callback);
    return unsubscribe;
  }, [store]);

  // Как и раньше хук возвращает:
  // - локальнео состояние и
  // - ФУНКЦИЮ, которая обновляет состояние модуля и локальное состояние всех инициализированных компонентов
  return [state, store.setState];
};

const Counter = () => {
  const [state, setState] = useStore(store);

  const inc = () => {
    setState((currentStorageState) => ({
      ...currentStorageState,
      count: currentStorageState.count + 1,
    }));
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
