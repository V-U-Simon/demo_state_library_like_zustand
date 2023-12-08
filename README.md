# Demo: State-Library Zustand like

Это пример реализации библиотеки состояний для понимания того, как она работает под капотом.

## Description

| No. | Link                                                  | Описание                                                                                                                                                                                                                                                  |
|-----|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1   | [Shared state](./frontend/src/1.%20Shared%20state.jsx) | В качестве инициализирующего значения передаем состояние модуля, которое будет изменяться в компоненте. Каждый компонент отслеживает только свое локальное состояние, изменение которого вызывает рендер. Но изменение состояние модуля в других компонентах НЕ обновляется через setState,  следовательно React не знает об его изменении и рендер не вызывается. |
| 2   | [Shared state](./frontend/src/2.%20Shared%20state.jsx) | Выносим логику обновления локального состояния в массив (реализуя тем самым подписку) и при изменении состояния модуля изменяем и локальное состояние всех инициализированных компонентов.                                                            |
| 3   | [Shared state](./frontend/src/3.%20Shared%20state.jsx) | Выделяем логику создания / получения / обновления модульного состояния (с помощью замыкания) в отдельную функцию — createStore, позволяет нам использовать методы store.getState и store.setState. Пока не используем подписку, сохраняя недостатки из `shared state - 1`. |
| 4   | [Shared state](./frontend/src/4.%20Shared%20state.jsx) | Реализуем подписку — передачу setState инициализированных компонентов в listeners через метод store.subscribe. Что позволит изменять состояния этих компонентов при изменении состояния модуля — используя метод store.setState. При этом стоит обратить внимание, что подписка (передача  setState компонента) осуществляется в useEffect. |
| 5   | [Custom react hook](./frontend/src/5.%20Custom%20react%20hook.jsx) | Выделяем логику создания локального состояния компонента и логику подписки (передачи setState компонента) при его инициализации в отдельный хук для большего удобства. Хук возвращает локальное состояние компонента и метод для обновления состояния модуля, т.к. данный метод синхронизирует свое состояние со всеми инициализированными компонентами, его использующими. |
| 6   | [Custom react hook](./frontend/src/6.%20Custom%20react%20hook.jsx) | Добавляем возможность методу storage.setState принимать функцию, при этом передавая ей текущее состояние состояния модуля. Это позволит изменять "сложный" объект, а не просто заменять его. |
| 7   | [State selectors to prevent unneeded rerenders](./frontend/src/7.%20State%20selectors%20to%20prevent%20unneeded%20rerenders.jsx) | Используем отдельные компоненты для различных данных состояния модели: count1 и count2. При этом в случае изменения любого из значений состояния модели вызывается рендедер для всех компонентов которые используют хотя бы одно из его значений. |
| 8   | [State selectors to prevent unneeded rerenders](./frontend/src/8.%20State%20selectors%20to%20prevent%20unneeded%20rerenders.jsx) | Определяем селектор, функция которая принимает все (глобальное) состояние модуля и возвращает его либо возвращает определенную часть. При этом используем useCallback для мемоизации получения части состояния модуля и определения на его основе локального состояния. Что позволяет избежать перерендеры в случае изменения в других компонентах, до тех пор пока не изменится состояние затрагивающее (использующееся) в данном компоненте. |
| 9   | [State selectors to prevent unneeded rerenders](./frontend/src/9.%20State%20selectors%20to%20prevent%20unneeded%20rerenders.jsx) | Добавление {Math.random()} позволит более наглядно увидеть те части кода, подверженные перерендерам. |
| 10  | [Define actions in store](./frontend/src/10.%20Define%20actions%20in%20store.jsx) | Определили конструктор для инициализации состояние модуля, а также перенесли в него действия (actions) из компонентов. |



## Additional sources

Дополнительные материалы: 

- [zustand](https://docs.pmnd.rs/zustand/getting-started/introduction/) / [GitHub](https://github.com/pmndrs/zustand) /  [live demo](https://githubbox.com/pmndrs/zustand/tree/main/examples/demo)
- habr [React: Zustand State Manager](https://habr.com/ru/companies/timeweb/articles/646339/)
- habr [Как работает Zustand](https://h.amazingsoftworks.com/ru/articles/750716/)
- habr [Zustand — руководство по простому управлению состоянием](https://habr.com/ru/articles/661411/)