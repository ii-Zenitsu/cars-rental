import { useState } from "react";
import axios from "axios";
import EditClient from "./EditClient";
import AddClient from "./AddClient";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import Fuse from "fuse.js";
import { message, Popconfirm } from "antd";
import { CircleCheckBig, CircleHelp, CircleX } from "lucide-react";

export default function ClientsList() {
  const [client, setClient] = useState({});
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");

  const clients = useSelector((state) => state.clients);
  const dispatch = useDispatch();

  const getRes = () => (filter ? clients.filter((c) => c.city === filter) : clients);
  const clientsFuse = new Fuse(getRes(), { keys: ["firstName", "lastName", "email", "city", "address"], threshold: 0.3 });
  const items = query ? clientsFuse.search(query).map((r) => r.item) : getRes();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const results = items.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteClient = (id) => {
    axios.delete(`http://localhost:3001/clients/${id}`).then(() => {
      message.open({
        className: "text-success",
        content: `Client with ID ${id} is deleted`,
        duration: 3,
        icon: <CircleCheckBig size={16} className="mr-1" />,
      });
      dispatch({ type: "UPDATE_CLIENTS", payload: clients.filter((c) => c.id !== id) });
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
        <button className="join-item btn btn-outline btn-info btn-sm" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} /> New Client
        </button>
      </div>
      <div className="flex justify-end px-3 gap-3">
        <select className="select select-sm w-1/8 focus-within:outline-none" onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Cities</option>
          <option value="New York">New York</option>
          <option value="Chicago">Chicago</option>
          <option value="Houston">Houston</option>
        </select>
        <label className="input input-sm w-1/6 focus-within:outline-none">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
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
                    <Link className="join-item btn btn-outline btn-info btn-sm" to={`/clients/${client.id}`}>
                      <FontAwesomeIcon icon={faCircleInfo} /> Details
                    </Link>
                    <button className="join-item btn btn-outline btn-warning btn-sm" onClick={() => handleModify(client.id)}>
                      <FontAwesomeIcon icon={faPenToSquare} /> Edit
                    </button>
                    <Popconfirm
                      placement="topLeft"
                      title="Delete the Client?"
                      description={`Are you sure you want to delete this Client ID ${client.id}?`}
                      onConfirm={() => deleteClient(client.id)}
                      onCancel={cancelDelete}
                      okText="Yes"
                      cancelText="No"
                      icon={<CircleHelp size={16} className="m-1" />}
                    >
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
            <EditClient client={client} setClient={setClient} clients={clients} />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <dialog id="addModal" className="modal">
          <div className="modal-box">
            <AddClient clients={clients} />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
      <div className="flex justify-center gap-2 my-4">
        <button
          className="btn btn-sm btn-outline btn-primary transition-colors duration-300"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ❮
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`btn btn-sm btn-outline btn-primary transition-colors duration-300 ${currentPage === page ? "btn-active" : ""}`}
            onClick={() => paginate(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="btn btn-sm btn-outline btn-primary transition-colors duration-300"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          ❯
        </button>
      </div>
    </div>
  );
}