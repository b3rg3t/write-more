// import { setLocalStorage } from "../util/localStorage";
// import { RootState } from "./redux/store";

const storeMiddleware =
  () =>
  // store: any

  (next: any) =>
  (action: any) => {
    const result = next(action);

    // const state: RootState = store.getState();

    // Object.keys(state).forEach((s) => {
    //   setLocalStorage(s, state[s as keyof RootState]);
    // });

    return result;
  };

export { storeMiddleware };
