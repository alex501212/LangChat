import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./views/App.jsx";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
      <App />
  </ChakraProvider>
);

reportWebVitals();
