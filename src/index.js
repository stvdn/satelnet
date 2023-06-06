import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import store from "./store";
import { Provider } from "react-redux";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";

export const firebaseApp = initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
