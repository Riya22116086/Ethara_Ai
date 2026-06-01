import {
 BrowserRouter,
 Routes,
 Route
}
from "react-router-dom";

import Navbar from "./components/Navbar";

import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";

function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Products />}
        />

        <Route
          path="/customers"
          element={<Customers />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;