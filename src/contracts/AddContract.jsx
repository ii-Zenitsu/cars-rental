import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "antd";

function AddContract({ contracts, nextId}) {
  const dispatch = useDispatch();
  const cars = useSelector(state => state.cars);
  const clients = useSelector((state) => state.clients);

  const [contract, setContract] = useState({id: nextId,
    clientId: "",
    carId: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    getClient : function(clients) { return clients.find(c => c.id === this.clientId)},
    getCar : function(cars) { return cars.find(c => c.id === this.carId)},
    getStatus : function() { return new Date(this.endDate) > new Date() ? true : false;},
    getTotalPrice : function(cars) {
      const car = this.getCar(cars);
      if (!car) return 0;

      const timeDiff = new Date(this.endDate) - new Date(this.startDate);
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      
      return car.price * daysDiff;
    },
  });
  
  function handleAdd(e) {
    e.preventDefault();

    const newContract = { ...contract, id: nextId};
    
    axios.post("http://localhost:3001/contracts", newContract)
    .then(res => {
      cancelAdd();
      dispatch({ type: "UPDATE_CONTRACTS", payload: [...contracts, newContract] })
      toggleCar(newContract.carId, !newContract.getStatus())
    })
    .catch(error => console.error("Error adding contract:", error));
  }


  function cancelAdd() {
    document.getElementById("addModal").close();
    setContract({...contract, id: nextId, clientId: "", carId: "", startDate: "", endDate: ""});
  }

  function toggleCar(carId, isAvailable) {
    const car = cars.find(c => c.id === carId)

    axios.put(`http://localhost:3001/cars/${car.id}`, { ...car, available: isAvailable }).then(() => {
      dispatch({ type: "UPDATE_CARS", payload: cars.map((c) => (c.id === car.id ? { ...car, available: isAvailable } : c)) });
    })
  }


  return (
    <div className="px-4">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl text-center">Add Contract</h1>
          <span className="badge badge-outline badge-lg mt-2">{nextId}</span>
        </div>
      </div>

      <form onSubmit={handleAdd} className="space-y-4 flex flex-col">
        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Client</span>
          </div>
          <select
            value={contract.clientId}
            onChange={(e) => setContract({ ...contract, clientId: e.target.value })}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.getInfo()}</option>
            ))}
          </select>
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Car</span>
          </div>
          <select
            value={contract.carId}
            onChange={(e) => setContract({ ...contract, carId: e.target.value })}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Car</option>
            {cars.filter((car => car.available)).map((car) => (
              <option key={car.id} value={car.id}>{car.getInfo()}</option>
            ))}
          </select>
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Start Date</span>
          </div>
          <input
            type="date"
            className="input input-bordered w-full"
            value={contract.startDate}
            onChange={(e) => setContract({ ...contract, startDate: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">End Date</span>
          </div>
          <input
            type="date"
            className="input input-bordered w-full"
            value={contract.endDate}
            onChange={(e) => setContract({ ...contract, endDate: e.target.value })}
            min={contract.startDate}
            required
          />
        </label>

        <div className="flex justify-between mt-4">
          <button type="button" onClick={cancelAdd} className="btn btn-outline">
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faCheck} /> Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddContract;