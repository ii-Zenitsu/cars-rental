import { useEffect, useState } from "react";
import axios from "axios";
import EditCar from "./EditCar";
import AddCar from "./AddCar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateCarAvailability } from "../service/FetchData";
import Fuse from "fuse.js";
import { Button, Modal } from 'antd';



function CarsList() {
  useUpdateCarAvailability();
  const cars = useSelector(state => state.cars);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [car, setCar] = useState({});
  const [nextId, setNextId] = useState("1");
  
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [types, setTypes] = useState([]);
  
  const dispatch = useDispatch()

 

  const carsFuse = new Fuse(getRes(), {keys: ["brand", "model", "year", "type"], threshold: 0.3})
  const results = query ? carsFuse.search(query).map(r => r.item) : getRes();
  
  const petrol = cars.filter(c => c.type === "petrol").length
  const diesel = cars.filter(c => c.type === "diesel").length
  const electric = cars.filter(c => c.type === "electric").length
  const hybrid = cars.filter(c => c.type === "hybrid").length

  function toggleType(type) {
    types.includes(type) ? setTypes(types.filter(t => t !== type)) : setTypes([...types, type])
  }

  function getRes() {
    let res = filter ? cars.filter(c => c.brand === filter) : cars
    res = types.length ? res.filter(c => types.includes(c.type)) : res
    return res
  }

  function getTotalOf(type) {
    return cars.filter(c => c.type === type).length
  }

  function getPerOf(type) {
    return (100/cars.length * getTotalOf(type)).toFixed(0)
  }

  function getAllBrands(cars) {
    const uniqueBrands = new Set();
    cars.forEach(car => {
      uniqueBrands.add(car.brand);
    });
    return Array.from(uniqueBrands);
  }

  const deleteCar = (id) => {
    axios.delete(`http://localhost:3001/cars/${id}`).then(() => {
      dispatch({ type: "UPDATE_CARS", payload: cars.filter(c => c.id !== id) });
    });
  };

  
  const showDeleteModal = (id) => {
    setCar(cars.find((car) => car.id === id));
    setIsModalOpen(true);
  }

  const handleCancel = () => {setIsModalOpen(false);};

  const handleOk = () => {
    deleteCar(car.id)
    setIsModalOpen(false);
  };


  function handleAdd() {
    setNextId(cars.length > 0 ? String(Math.max(...cars.map(car => car.id)) + 1) : "1");
    document.getElementById("addModal").showModal();
  }

  function handleModify(id) {
    setCar(cars.find((car) => car.id === id));
    document.getElementById("modifyModal").showModal();
  }

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4">
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-4xl text-center">Car List</h1>
          <span className="badge badge-outline badge-lg m-3 count">{results.length}</span>
        </div>
        <button className="join-item btn btn-outline btn-info btn-sm" onClick={() => handleAdd()}><FontAwesomeIcon icon={faPlus} />New car</button>
      </div>
      <div className="flex justify-end p-3 gap-3">
        <div className="flex gap-1.5 mr-auto">
          <button className={`btn btn-outline btn-primary btn-sm rounded-full capitalize ${types.includes("petrol") ? "btn-active" : ""}`} onClick={() => toggleType("petrol")}>petrol {getTotalOf("petrol")} - {getPerOf("petrol")}%</button>
          <button className={`btn btn-outline btn-primary btn-sm rounded-full capitalize ${types.includes("diesel") ? "btn-active" : ""}`} onClick={() => toggleType("diesel")}>diesel {getTotalOf("diesel")} - {getPerOf("diesel")}%</button>
          <button className={`btn btn-outline btn-primary btn-sm rounded-full capitalize ${types.includes("electric") ? "btn-active" : ""}`} onClick={() => toggleType("electric")}>electric {getTotalOf("electric")} - {getPerOf("electric")}%</button>
          <button className={`btn btn-outline btn-primary btn-sm rounded-full capitalize ${types.includes("hybrid") ? "btn-active" : ""}`} onClick={() => toggleType("hybrid")}>hybrid {getTotalOf("hybrid")} - {getPerOf("hybrid")}%</button>
        </div>
        <select className="select select-sm w-1/8" onChange={(e) => setFilter(e.target.value)}>
          <option value="" >All Brands</option>
            {getAllBrands(cars).map(b => (
              <option value={b}>{b}</option>
            ))}
        </select>
        <label className="input input-sm w-1/6">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
          <input type="search" className="grow" onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr>
              <th>Id</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Price</th>
              <th>Fuel</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((car, i) => (
              <tr key={i} className="hover:bg-base-300">
                <td>
                  <div className="font-bold">{car.id}</div>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <Link to={`/cars/${car.id}`}>
                          <img src={car.image} alt="Car Image" />
                        </Link>
                      </div>
                    </div>
                    <div className="font-bold capitalize">{car.brand}</div>
                  </div>
                </td>
                <td>
                  <div className="font-bold capitalize">{car.model}</div>
                </td>
                <td>
                  <div className="font-bold">{car.year}</div>
                </td>
                <td>
                  <div className="font-bold">{car.price}&nbsp;€</div>
                </td>
                <td>
                  <div className="font-bold capitalize">{car.type}</div>
                </td>
                <td>
                <span className={`badge badge-soft badge-lg w-32 ${car.available ? "badge-success" : "badge-secondary"}`}>{car.available ? "Available" : "Unavailable"}</span>
                </td>
                <th>
                  <div className="join">
                    <Link className="join-item btn btn-outline btn-info btn-sm" to={`/cars/${car.id}`} >
                      <FontAwesomeIcon icon={faCircleInfo} /> Details
                    </Link>
                    <button className="join-item btn btn-outline btn-warning btn-sm" onClick={() => handleModify(car.id)}>
                      <FontAwesomeIcon icon={faPenToSquare} /> Edit
                    </button>
                    <button className="join-item btn btn-outline btn-secondary btn-sm" onClick={() => showDeleteModal(car.id)}>
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        <dialog id="modifyModal" className="modal">
          <div className="modal-box">
            <EditCar car={car} setCar={setCar} cars={cars} />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <dialog id="addModal" className="modal">
          <div className="modal-box">
            <AddCar cars={cars} nextId={nextId} />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <Modal title="Confirm Delete" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Are you sure you want to delete this Car ID {car.id && car.getInfo()}?</p>
        </Modal>
      </div>
    </div>
  );
}

export default CarsList;
