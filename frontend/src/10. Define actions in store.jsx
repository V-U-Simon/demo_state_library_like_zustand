import { useCallback, useEffect, useState } from "react";

// createState — функция инициализации состояния модуля, возвращает объект состояния
const createStore = (createState) => {
  const getState = () => state;
  const setState = (nextState) => {
    state = typeof nextState === "function" ? nextState(state) : nextState;
    listeners.forEach((listener) => {
      listener();
    });
  };
  // Инициализация состояния через функцию `createState`
  // передает в него setState, чтобы можно было внутри этой функции объявить / изменить состояние модуля
  let state = createState(setState);
  const listeners = new Set();
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return { getState, setState, subscribe };
};

// так же в createState перенесли (actons) — функции-фабрики возвращающие новые объекты для обновления состояние модуля (inc1, inc2)
const store = createStore((setState) => ({
  count1: 0,
  count2: 0,
  // currentState — текущее состояние (state), которое передается при вызове state.setState(state), где state и есть currentState.
  inc1: () => {
    setState((currentState) => ({
      ...currentState,
      count1: currentState.count1 + 1,
    }));
  },
  inc2: () => {
    setState((currentState) => ({
      ...currentState,
      count2: currentState.count2 + 1,
    }));
  },
}));

const identity = (x) => x;

const useStore = (store, selector = identity) => {
  const [state, setState] = useState(() => selector(store.getState()));
  useEffect(() => {
    const callback = () => {
      setState(() => selector(store.getState()));
    };
    const unsubscribe = store.subscribe(callback);
    callback();
    return unsubscribe;
  }, [store, selector]);
  return state;
};

const Counter1 = () => {
  const count1 = useStore(
    store,
    useCallback((state) => state.count1, [])
  );
  // извлекли функцию обновления состояния, теперь импортируем ее из состояния модуля
  const inc1 = useStore(
    store,
    useCallback((state) => state.inc1, [])
  );
  return (
    <div>
      {count1} <button onClick={inc1}>+1</button>
    </div>
  );
};

const Counter2 = () => {
  const count2 = useStore(
    store,
    useCallback((state) => state.count2, [])
  );
  // извлекли функцию обновления состояния, теперь импортируем ее из состояния модуля
  const inc2 = useStore(
    store,
    useCallback((state) => state.inc2, [])
  );
  return (
    <div>
      {count2} <button onClick={inc2}>+1</button>
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
