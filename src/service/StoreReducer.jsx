import { useEffect } from "react";
import axios from "axios";

const initialState = {
  cars: [],
  clients: [],
  contracts: [],
};


const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_CARS":
      return { ...state, cars: action.payload };
    case "UPDATE_CLIENTS":
      return { ...state, clients: action.payload };
    case "UPDATE_CONTRACTS":
      return { ...state, contracts: action.payload };
    default:
      return state;
  }
};

export default storeReducer;

function add(endPoint, data) {
  axios.post(`http://localhost:3001/${endPoint}`, data)
  .then((response) => response.data)
  .catch(() => false);
}

function edit(endPoint, data) {
  axios.put(`http://localhost:3001/${endPoint}/${data.id}`, data)
  .then(() => (response) => response.data)
  .catch(() => false)
}