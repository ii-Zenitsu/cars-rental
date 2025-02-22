import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { DatePicker} from "antd";
import dayjs from 'dayjs';


function AddCar({ cars, nextId }) {
  const dispatch = useDispatch();

  const [car, setCar] = useState({
    id: nextId,
    brand: "",
    model: "",
    year: Date(),
    price: "",
    type: "",
    available: true,
    image: "",
    getName : function() { return this.brand + " " + this.model; },
    getInfo : function() { return this.id + " : " + this.getName(); },
    getContracts : function(contracts) { return contracts.filter(c => c.carId === this.id)},
  });

  function cancelAdd() {
    document.getElementById("addModal").close();
    setCar({...car, brand: "", model: "", year: Date(), price: "", type: "", image: ""});
  }

  function handleAdd(e) {
    e.preventDefault();
    const newCar = { ...car, id: nextId };
    axios.post("http://localhost:3001/cars", newCar).then((res) => {
        cancelAdd();
        dispatch({ type: "UPDATE_CARS", payload: [...cars, newCar] });
      })
      .catch((error) => console.error("Error adding car:", error));
  }

  return (
    <div className="px-4">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl text-center">Add Car</h1>
          <span className="badge badge-outline badge-lg mt-2">{nextId}</span>
        </div>
      </div>

      <form onSubmit={handleAdd} className="space-y-4 flex flex-col">
        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Brand</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full"
            value={car.brand}
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
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Year</span>
          </div>
          <DatePicker
          picker="year"
          required
          minDate={dayjs('1886', "YYYY")}
          maxDate={dayjs()}
          className="input! input-bordered! w-full! text-neutral-400! focus-within:outline-none!"
          popupClassName="text-red-400!"
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          // onChange={(date, dateString) => setCar({ ...car, year: dateString })}
          onSelect={(date, dateString) => setCar((prevCar) => ({ ...prevCar, year: dateString }))}
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Price</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full"
            value={car.price}
            onChange={(e) => setCar({ ...car, price: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Type</span>
          </div>
          <select
            value={car.type}
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
            value={car.image}
            onChange={(e) => setCar({ ...car, image: e.target.value })}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Image</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={`/images/car${n}.png`}>
                Car {n}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Available</span>
          </div>
          <input
            type="checkbox"
            checked={car.available}
            onChange={(e) => setCar({ ...car, available: e.target.checked })}
            className="toggle toggle-primary mx-4"
          />
        </label>

        {/* <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Image</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="file"
              name="image"
              className="file-input file-input-bordered w-full"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Car Preview"
                className="w-1/6 h-1/6 rounded-lg shadow-lg"
              />
            )}
          </div>
        </label> */}

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

export default AddCar;
