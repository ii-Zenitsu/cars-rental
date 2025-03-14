import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { message, Popconfirm } from "antd";
import { CircleCheckBig, CircleHelp } from "lucide-react";

function EditContract({ contract, setContract, contracts }) {
  const dispatch = useDispatch();
  const cars = useSelector((state) => state.cars);
  const clients = useSelector((state) => state.clients);

  function cancelEdit() {
    document.getElementById("modifyModal").close();
  }
  
  function validate() {
    for (const [key, value] of Object.entries(contract)) {
      if (!value) {
        alert(`Please fill in the ${key.replace("Id", "")} field.`)
        return false;
      }
    }
    return true;
  }
    
    function handleEdit() {
    if (!validate()) return;
    axios
      .put(`http://localhost:3001/contracts/${contract.id}`, contract)
      .then(() => {
        cancelEdit();
        dispatch({ type: "UPDATE_CONTRACTS", payload: contracts.map((c) => (c.id === contract.id ? contract : c)) });
        toggleCar(contract.carId, !contract.getStatus());
        message.open({
          className: "text-success",
          content: "All changes are saved",
          duration: 3,
          icon: <CircleCheckBig size={16} className="mr-1" />,
        });
      })
      .catch((error) => console.error("Error updating contract:", error));
  }

  function toggleCar(carId, isAvailable) {
    const car = cars.find((c) => c.id === carId);
    const updatedCars = cars.map((c) => (c.id === carId ? { ...c, available: isAvailable } : c));

    axios
      .put(`http://localhost:3001/cars/${carId}`, { ...car, available: isAvailable })
      .then(() => {
        dispatch({ type: "UPDATE_CARS", payload: updatedCars });
      });
  }

  if (!cars.length || !clients.length || !contract.id) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="px-4">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl text-center">Edit Contract</h1>
          <span className="badge badge-outline badge-lg mt-2">{contract.id}</span>
        </div>
      </div>

      <form className="space-y-4 flex flex-col">
        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Client</span>
          </div>
          <select
            value={contract.clientId ?? ""}
            onChange={(e) => setContract({ ...contract, clientId: e.target.value })}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.getInfo()}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Car</span>
          </div>
          <select
            value={contract.carId ?? ""}
            onChange={(e) => setContract({ ...contract, carId: e.target.value })}
            className="select select-bordered w-full"
            required
          >
            <option value={contract.carId}>{contract.getCar(cars).getInfo()}</option>
            {cars.filter((car) => car.available).map((car) => (
              <option key={car.id} value={car.id}>
                {car.getInfo()}
              </option>
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
            value={contract.startDate ?? ""}
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
            value={contract.endDate ?? ""}
            onChange={(e) => setContract({ ...contract, endDate: e.target.value })}
            min={contract.startDate}
            required
          />
        </label>

        <div className="flex justify-between mt-4">
          <button type="button" onClick={cancelEdit} className="btn btn-outline">
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </button>
          <Popconfirm
            placement="topLeft"
            title="Save Changes?"
            description="Are you sure you want to save the changes?"
            onConfirm={handleEdit}
            okText="Yes"
            cancelText="No"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            icon={<CircleHelp size={16} className="m-1" />}
          >
            <div className="btn btn-primary">
              <FontAwesomeIcon icon={faCheck} /> Save
            </div>
          </Popconfirm>
        </div>
      </form>
    </div>
  );
}

export default EditContract;