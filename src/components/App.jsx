import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Calendar from "./Calendar.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Calendar />
  </StrictMode>
);