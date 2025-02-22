import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import CarsList from "../cars/CarsList";
import ShowCar from "../cars/ShowCar";
import ClientsList from "../clients/ClientsList";
import ShowClient from "../clients/ShowClient";
import ContractsList from "../contracts/ContractsList";
import ShowContract from "../contracts/ShowContract";

export default function Router() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    axios.get("http://localhost:3001/cars").then(response =>
      dispatch({ type: "UPDATE_CARS", payload: response.data })
    );
    axios.get("http://localhost:3001/clients").then(response =>
      dispatch({ type: "UPDATE_CLIENTS", payload: response.data })
    );
    axios.get("http://localhost:3001/contracts").then(response =>
      dispatch({ type: "UPDATE_CONTRACTS", payload: response.data })
    );
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<h1>Hello world</h1>} />
      <Route path="/cars">
        <Route index element={<CarsList />} />
        <Route path=":id" element={<ShowCar />} />
      </Route>
      <Route path="/clients">
        <Route index element={<ClientsList />} />
        <Route path=":id" element={<ShowClient />} />
      </Route>
      <Route path="/contracts">
        <Route index element={<ContractsList />} />
        <Route path=":id" element={<ShowContract />} />
      </Route>
      <Route path="*" element={<h1>Page Not Found Error 404</h1>} />
    </Routes>
  );
}
