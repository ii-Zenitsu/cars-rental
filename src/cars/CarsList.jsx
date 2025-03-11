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
import { message, Popconfirm } from 'antd';
import { CircleCheckBig, CircleHelp, CircleX } from "lucide-react";



function CarsList() {
  useUpdateCarAvailability();
  const cars = useSelector(state => state.cars);
  
  const [car, setCar] = useState({});
  const [nextId, setNextId] = useState("1");
  
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [types, setTypes] = useState([]);
  
  const dispatch = useDispatch()

  const carsFuse = new Fuse(getRes(), {keys: ["brand", "model", "year", "type"], threshold: 0.3})
  const items = query ? carsFuse.search(query).map(r => r.item) : getRes();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const results = items.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      message.open({
        className: "text-success",
        content: `Car with ID ${id} is deleted`,
        duration: 3,
        icon: <CircleCheckBig size={16} className="mr-1" />,
      });
      dispatch({ type: "UPDATE_CARS", payload: cars.filter(c => c.id !== id) });
    });
  };

  const cancelDelete = () => {
    message.open({
      className: "text-secondary",
      content: "Delete canceled",
      duration: 3,
      icon: <CircleX size={16} className="mr-1" />,
    });
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
        <div className="flex gap-1.5">
          <button className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize ${types.includes("petrol") ? "btn-active" : ""}`} onClick={() => toggleType("petrol")}>petrol</button>
          <button className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize ${types.includes("diesel") ? "btn-active" : ""}`} onClick={() => toggleType("diesel")}>diesel</button>
          <button className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize ${types.includes("electric") ? "btn-active" : ""}`} onClick={() => toggleType("electric")}>electric</button>
          <button className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize ${types.includes("hybrid") ? "btn-active" : ""}`} onClick={() => toggleType("hybrid")}>hybrid</button>
          {/* <button className={`btn btn-outline btn-primary btn-sm rounded-full capitalize ${types.includes("petrol") ? "btn-active" : ""}`} onClick={() => toggleType("petrol")}>petrol {getTotalOf("petrol")} - {getPerOf("petrol")}%</button>
          <button className={`btn btn-outline btn-primary btn-sm rounded-full capitalize ${types.includes("diesel") ? "btn-active" : ""}`} onClick={() => toggleType("diesel")}>diesel {getTotalOf("diesel")} - {getPerOf("diesel")}%</button>
          <button className={`btn btn-outline btn-primary btn-sm rounded-full capitalize ${types.includes("electric") ? "btn-active" : ""}`} onClick={() => toggleType("electric")}>electric {getTotalOf("electric")} - {getPerOf("electric")}%</button>
          <button className={`btn btn-outline btn-primary btn-sm rounded-full capitalize ${types.includes("hybrid") ? "btn-active" : ""}`} onClick={() => toggleType("hybrid")}>hybrid {getTotalOf("hybrid")} - {getPerOf("hybrid")}%</button> */}
        </div>
        <select className="select select-sm w-1/8" onChange={(e) => setFilter(e.target.value)}>
          <option value="" >All Brands</option>
            {getAllBrands(cars).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
        </select>
        <label className="input input-sm w-1/6">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
          <input type="search" className="grow" onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
        </label>
      </div>
      <div className="divider after:bg-gray-700 before:bg-gray-700 my-0 mx-4"></div>
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
                    <Popconfirm placement="topLeft" title="Delete the Car?" description={`Are you sure you want to delete this Car ID ${car.getInfo()}?`}
                      onConfirm={() => deleteCar(car.id)} onCancel={cancelDelete} okText="Yes" cancelText="No"
                      icon={<CircleHelp size={16} className="m-1" />}>
                      <button className="join-item btn btn-outline btn-secondary btn-sm">
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </Popconfirm>
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
      </div>
      <div className="flex justify-center gap-2 my-4">
        <button className="btn btn-sm btn-outline btn-primary transition-colors duration-300" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>❮</button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button key={page} className={`btn btn-sm btn-outline btn-primary transition-colors duration-300 ${currentPage === page ? "btn-active" : ""}`} onClick={() => paginate(page)}>{page}</button>
        ))}

        <button className="btn btn-sm btn-outline btn-primary transition-colors duration-300" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>❯</button>
      </div>
    </div>
  );
}

export default CarsList;
