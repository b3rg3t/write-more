import { setLocalStorage } from "../util/localStorage";
import { RootState } from "./redux/store";

const storeMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  const state: RootState = store.getState();

  Object.keys(state).forEach((s) => {
    // @ts-ignore
    setLocalStorage(s, state[s]);
  });

  return result;
};

export { storeMiddleware};