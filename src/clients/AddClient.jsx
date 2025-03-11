import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { createClient } from "../service/FetchData";
import { message, Popconfirm } from "antd";
import { CircleCheckBig, CircleHelp } from "lucide-react";

function AddClient({ clients }) {
  const dispatch = useDispatch();

  const [client, setClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    date_birthday: "",
    city: "",
    address: "",
    getFullName: function () {
      return this.firstName + " " + this.lastName;
    },
    getInfo: function () {
      return this.id + " : " + this.getFullName();
    },
    getContracts: function (contracts) {
      return contracts.filter((c) => c.clientId === this.id);
    },
    getAge: function () {
      const birthDate = new Date(this.date_birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }
      return age;
    },
  });

  function cancelAdd() {
    document.getElementById("addModal").close();
    setClient({
      ...client,
      firstName: "",
      lastName: "",
      email: "",
      date_birthday: "",
      city: "",
      address: "",
    });
  }

  function validate() {
    for (const [key, value] of Object.entries(client)) {
      if (!value) {
        alert(`Please fill in the ${key.replace("Id", "")} field.`)
        return false;
      }
    }
    return true;
  }

  function handleAdd() {
    if (!validate()) return;
    axios
      .post("http://localhost:3001/clients", { ...client })
      .then((res) => {
        cancelAdd();
        dispatch({ type: "UPDATE_CLIENTS", payload: [...clients, createClient(res.data)] });
        message.open({
          className: "text-success",
          content: "Client added successfully",
          duration: 3,
          icon: <CircleCheckBig size={16} className="mr-1" />,
        });
      })
      .catch((error) => console.error("Error adding client:", error));
  }

  return (
    <div className="px-4">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl text-center">Add Client</h1>
        </div>
      </div>

      <form className="space-y-4 flex flex-col">
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
          <button type="button" onClick={cancelAdd} className="btn btn-outline">
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </button>
          <Popconfirm
            placement="topLeft"
            title="Add Client?"
            description="Are you sure you want to add this client?"
            onConfirm={handleAdd}
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

export default AddClient;