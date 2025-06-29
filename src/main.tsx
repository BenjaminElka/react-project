// main.tsx  –  כל השאר נשאר בדיוק כפי שהיה
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { Flowbite } from "flowbite-react";  // ← הוספנו
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Flowbite>                                {/* עטיפה מוד־עליון */}
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
        <ToastContainer />
      </BrowserRouter>
    </Flowbite>
  </React.StrictMode>,
);
