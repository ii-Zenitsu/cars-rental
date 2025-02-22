import { useState } from "react";
import axios from "axios";
import EditContract from "./EditContract";
import AddContract from "./AddContract";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import Fuse from "fuse.js";

function ContractsList() {
  const [contract, setContract] = useState({});
  const [nextId, setNextId] = useState("1");
  const [query, setQuery] = useState("");
  
  const dispatch = useDispatch();
  const cars = useSelector(state => state.cars);
  const clients = useSelector(state => state.clients);
  const contracts = useSelector((state) => state.contracts);

  const contractsFuse = contracts.map(c => ({...c , clientName: c.getClient(clients)?.getInfo(), carName: c?.getCar(cars).getInfo()}))
  const fuse = new Fuse(contractsFuse, {keys: ["id", "clientName", "carName"], threshold: 0.2})
  
  const results = query ? fuse.search(query).map(r => r.item) : contractsFuse;


  const deleteContract = (contract) => {
    if (confirm("Are you sure you want to delete this client?")) {
      axios.delete(`http://localhost:3001/contracts/${contract.id}`).then(() => {
        dispatch({ type: "UPDATE_CONTRACTS", payload: contracts.filter(c => c.id !== contract.id) });
        (contract.getStatus() && toggleCar(contract.carId))
      });
    }
  };

  function handleAddContract() {
    setNextId( contracts.length > 0 ? String(Math.max(...contracts.map((contract) => contract.id)) + 1) : "1" );
    document.getElementById("addModal").showModal();
  }

  function handleModifyContract(id) {
    setContract(contracts.find((contract) => contract.id === id));
    document.getElementById("modifyModal").showModal();
  }

  function toggleCar(carId) {
    const car = cars.find(c => c.id === carId)
    car.available = true
    axios.put(`http://localhost:3001/cars/${car.id}`, car).then(() => {
      dispatch({ type: "UPDATE_CARS", payload: cars.map((c) => (c.id === car.id ? car : c)) });
    })
  }

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4">
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-4xl text-center">Contract List</h1>
          <span className="badge badge-outline badge-lg m-3 count">{results.length}</span>
        </div>
        <button className="join-item btn btn-outline btn-info btn-sm" onClick={handleAddContract}>
          <FontAwesomeIcon icon={faPlus} /> New Contract
        </button>
      </div>
      <div className="flex justify-end p-3 gap-3">
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
              <th>Client</th>
              <th>Car</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Total Price</th>
              <th>status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((contract, i) => (
              <tr key={i} className="hover:bg-base-300">
                <td>
                  <div className="font-bold">{contract.id}</div>
                </td>
                <td>
                  <div className="font-bold capitalize">{contract.clientName}</div>
                </td>
                <td>
                  <div className="font-bold capitalize">{contract.carName}</div>
                </td>
                <td>
                  <div className="font-bold">{contract.getDuration()} Days</div>
                </td>
                <td>
                  <div className="font-bold">{contract.getCar(cars).price}&nbsp;€</div>
                </td>
                <td>
                  <div className="font-bold">{contract.getTotalPrice(cars)}&nbsp;€</div>
                </td>
                <td>
                <span className={`badge badge-soft badge-lg w-32 ${contract.getStatus() ? "badge-success" : "badge-secondary"}`}>{contract.getStatus() ? "Active" : "Expired"}</span>
                </td>
                <th>
                  <div className="join">
                    <Link className="join-item btn btn-outline btn-info btn-sm" to={`/contracts/${contract.id}`}>
                      <FontAwesomeIcon icon={faCircleInfo} /> Details
                    </Link>
                    {/* <button className="join-item btn btn-outline btn-warning btn-sm" onClick={() => handleModifyContract(contract.id)} >
                      <FontAwesomeIcon icon={faPenToSquare} /> Edit
                    </button> */}
                    <button className="join-item btn btn-outline btn-secondary btn-sm" onClick={() => deleteContract(contract)} >
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
            <EditContract contract={contract} setContract={setContract} contracts={contracts} />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <dialog id="addModal" className="modal">
          <div className="modal-box">
            <AddContract contracts={contracts} nextId={nextId}/>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
}

export default ContractsList;