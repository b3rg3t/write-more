import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { setupStore } from "../src/store/redux/store.ts";
import { Provider } from "react-redux";
import { text } from "./localization/eng.ts";

const root = document.getElementById("root");

if (!root) {
  throw new Error(text.errors.root);
}

ReactDOM.createRoot(root).render(
  <Provider store={setupStore()}>
    <App />
  </Provider>
);
