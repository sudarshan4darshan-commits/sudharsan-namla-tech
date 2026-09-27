import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import "./index.css";

import App from "./App.jsx";
import AddHotel from "./pages/addhotel.jsx";
import EditHotel from "./pages/edithotel.jsx";
import HotelDetails from "./pages/hoteldetails.jsx";

import store from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<App />} />

          <Route
            path="/add-hotel"
            element={<AddHotel />}
          />

          <Route
            path="/edit-hotel"
            element={<EditHotel />}
          />

          <Route
            path="/hotel-details"
            element={<HotelDetails />}
          />

        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);