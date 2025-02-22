import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";

function AddClient({ clients, nextId }) {
  const dispatch = useDispatch();

  const [client, setClient] = useState({
    id: nextId,
    firstName: "",
    lastName: "",
    email: "",
    date_birthday: "",
    city: "",
    address: "",
    getFullName : function() { return this.firstName + " " + this.lastName; },
    getInfo : function() { return this.id + " : " + this.getFullName(); },
    getContracts : function(contracts) { return contracts.filter(c => c.clientId === this.id)},
    getAge : function() {
      const birthDate = new Date(this.date_birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) { age--;}
      return age;}
  });

  function cancelAdd() {
    document.getElementById("addModal").close();
    setClient({...client,
      id: nextId,
      firstName: "",
      lastName: "",
      email: "",
      date_birthday: "",
      city: "",
      address: "",
    });
  }

  function handleAdd(e) {
    e.preventDefault();
  
    const newClient = { ...client, id: nextId };
  
    axios.post("http://localhost:3001/clients", newClient)
      .then(response => {
        cancelAdd();
        dispatch({ type: "UPDATE_CLIENTS", payload: [...clients, newClient] });
      })
      .catch(error => console.error("Error adding client:", error));
  }

  return (
    <div className="px-4">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl text-center">Add Client</h1>
          <span className="badge badge-outline badge-lg mt-2">{nextId}</span>
        </div>
      </div>

      <form onSubmit={handleAdd} className="space-y-4 flex flex-col">
        <label className="form-control w-full max-w-2xl">
          <span className="label-text">First Name</span>
          <input
            type="text"
            className="input input-bordered w-full"
            value={client.firstName}
            onChange={(e) => setClient({ ...client, firstName: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <span className="label-text">Last Name</span>
          <input
            type="text"
            className="input input-bordered w-full"
            value={client.lastName}
            onChange={(e) => setClient({ ...client, lastName: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <span className="label-text">Email</span>
          <input
            type="email"
            className="input input-bordered w-full"
            value={client.email}
            onChange={(e) => setClient({ ...client, email: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <span className="label-text">Birthday</span>
          <input
            type="date"
            className="input input-bordered w-full"
            value={client.date_birthday}
            onChange={(e) => setClient({ ...client, date_birthday: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <span className="label-text">City</span>
          <input
            type="text"
            className="input input-bordered w-full"
            value={client.city}
            onChange={(e) => setClient({ ...client, city: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <span className="label-text">Address</span>
          <input
            type="text"
            className="input input-bordered w-full"
            value={client.address}
            onChange={(e) => setClient({ ...client, address: e.target.value })}
            required
          />
        </label>

        <div className="flex justify-between mt-4">
          <button type="button" onClick={cancelAdd} className="btn btn-outline"><FontAwesomeIcon icon={faTimes} /> Cancel</button>
          <button type="submit" className="btn btn-primary"><FontAwesomeIcon icon={faCheck} /> Save</button>
        </div>
      </form>
    </div>
  );
}

export default AddClient;
