import { useState } from "react";
import axios from "axios";
import EditClient from "./EditClient";
import AddClient from "./AddClient";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo,faPenToSquare,faPlus,faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";

import Fuse from "fuse.js";

export default function ClientsList() {
  const [client, setClient] = useState({});
  const [nextId, setNextId] = useState("1");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");

  const clients = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  
  const getRes = () => filter ? clients.filter(c => c.city === filter) : clients
  const clientsFuse = new Fuse(getRes(), {keys: ["firstName", "lastName", "email", "city", "address"], threshold: 0.3})
  const results = query ? clientsFuse.search(query).map(r => r.item) : getRes();


  const deleteClient = (id) => {
    if (confirm("Are you sure you want to delete this client?")) {
      axios.delete(`http://localhost:3001/clients/${id}`).then(() => {
        dispatch({ type: "UPDATE_CLIENTS", payload: clients.filter(c => c.id !== id) });
      });
    }
  };

  function handleAdd() {
    setNextId( clients.length > 0 ? String(Math.max(...clients.map((client) => client.id)) + 1) : "1" );
    document.getElementById("addModal").showModal();
  }

  function handleModify(id) {
    setClient(clients.find((client) => client.id === id));
    document.getElementById("modifyModal").showModal();
  }


  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4">
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-4xl text-center">Client List</h1>
          <span className="badge badge-outline badge-lg m-3 count">{results.length}</span>
        </div>
        <button className="join-item btn btn-outline btn-info btn-sm" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} /> New Client</button>
      </div>
      <div className="flex justify-end px-3 gap-3">
        <select className="select select-sm w-1/8 focus-within:outline-none" onChange={(e) => setFilter(e.target.value)}>
            <option value="" >All Cities</option>
            <option value="New York" >New York</option>
            <option value="Chicago" >Chicago</option>
            <option value="Houston" >Houston</option>
        </select>
        <label className="input input-sm w-1/6 focus-within:outline-none">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
          <input type="search" className="grow" onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Birthday</th>
              <th>Age</th>
              <th>City</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((client, i) => (
              <tr key={i} className="hover:bg-base-300">
                <td>
                  <div className="font-bold">{client.id}</div>
                </td>
                <td>
                  <div className="font-bold capitalize">{client.getFullName()}</div>
                </td>
                <td>
                  <div className="font-bold">{client.email}</div>
                </td>
                <td>
                  <div className="font-bold">{client.date_birthday}</div>
                </td>
                <td>
                  <div className="font-bold">{client.getAge()}</div>
                </td>
                <td>
                  <div className="font-bold capitalize">{client.city}</div>
                </td>
                <td>
                  <div className="font-bold capitalize">{client.address}</div>
                </td>
                <th>
                  <div className="join">
                    <Link
                      className="join-item btn btn-outline btn-info btn-sm"
                      to={`/clients/${client.id}`}
                    >
                      <FontAwesomeIcon icon={faCircleInfo} /> Details
                    </Link>
                    <button
                      className="join-item btn btn-outline btn-warning btn-sm"
                      onClick={() => handleModify(client.id)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} /> Edit
                    </button>
                    <button
                      className="join-item btn btn-outline btn-secondary btn-sm"
                      onClick={() => deleteClient(client.id)}
                    >
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
            <EditClient
              client={client}
              setClient={setClient}
              clients={clients}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <dialog id="addModal" className="modal">
          <div className="modal-box">
            <AddClient
              clients={clients}
              nextId={nextId}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
}
