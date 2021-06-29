import ReactDOM from "react-dom";
import React from "react";
import App from "./components/App";
import { Provider } from "react-redux";
import store from "./store";
import "antd/dist/antd.css";
// import "react-quill/dist/quill.snow.css";
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
