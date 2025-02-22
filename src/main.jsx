// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Provider } from "react-redux";
import { legacy_createStore } from "redux";
import StoreReducer from "./service/StoreReducer";

const store = legacy_createStore(StoreReducer);


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)