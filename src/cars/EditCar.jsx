import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";

import { useDispatch } from "react-redux";

function EditCar({ car, setCar, cars}) {
  const dispatch = useDispatch();

  function cancelEdit() {
    document.getElementById("modifyModal").close();
  }

  function handleEdit(e) {
    e.preventDefault();
    axios.put(`http://localhost:3001/cars/${car.id}`, car).then(() => {
      cancelEdit();
      // use axios.get insted of map for multi users
      dispatch({ type: "UPDATE_CARS", payload: cars.map((c) => (c.id === car.id ? car : c)) });
    })
  }

  return (
    <div className="px-4">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl text-center">Edit Car</h1>
          <span className="badge badge-outline badge-lg mt-2">{car.id}</span>
        </div>
      </div>

      <form onSubmit={handleEdit} className="space-y-4 flex flex-col">
        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Brand</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full"
            value={car.brand || ""}
            onChange={(e) => setCar({ ...car, brand: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Model</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full"
            value={car.model || ""}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Year</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full"
            value={car.year || ""}
            onChange={(e) => setCar({ ...car, year: e.target.value })}
            min="1886"
            max={new Date().getFullYear()}
            step="1"
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Price</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full"
            value={car.price || ""}
            onChange={(e) => setCar({ ...car, price: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Type</span>
          </div>
          <select
            value={car.type || ""}
            onChange={(e) => setCar({ ...car, type: e.target.value })}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select type</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Image</span>
          </div>
          <select
            value={car.image || ""}
            onChange={(e) => setCar({ ...car, image: e.target.value })}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Image</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={`/images/car${n}.png`}>Car {n}</option>
            ))}
          </select>
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Available</span>
          </div>
          <input
            type="checkbox"
            checked={car.available || false}
            onChange={(e) => setCar({ ...car, available: e.target.checked })}
            className="toggle toggle-primary mx-4"
          />
        </label>

        <div className="flex justify-between mt-4">
          <button type="button" onClick={cancelEdit} className="btn btn-outline">
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

export default EditCar;
