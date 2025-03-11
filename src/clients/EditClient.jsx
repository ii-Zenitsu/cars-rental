import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { message, Popconfirm } from "antd";
import { CircleCheckBig, CircleHelp } from "lucide-react";

function EditClient({ client, setClient, clients }) {
  const dispatch = useDispatch();

  function cancelEdit() {
    document.getElementById("modifyModal").close();
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
    
    function handleEdit() {
    if (!validate()) return;
    axios
      .put(`http://localhost:3001/clients/${client.id}`, client)
      .then(() => {
        cancelEdit();
        dispatch({ type: "UPDATE_CLIENTS", payload: clients.map((c) => (c.id === client.id ? client : c)) });
        message.open({
          className: "text-success",
          content: "All changes are saved",
          duration: 3,
          icon: <CircleCheckBig size={16} className="mr-1" />,
        });
      })
      .catch((error) => console.error("Error updating client:", error));
  }

  return (
    <div className="px-4">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl text-center">Edit Client</h1>
          <span className="badge badge-outline badge-lg mt-2">{client.id}</span>
        </div>
      </div>

      <form className="space-y-4 flex flex-col">
        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">First Name</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full"
            value={client.firstName || ""}
            onChange={(e) => setClient({ ...client, firstName: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Last Name</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full"
            value={client.lastName || ""}
            onChange={(e) => setClient({ ...client, lastName: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Email</span>
          </div>
          <input
            type="email"
            className="input input-bordered w-full"
            value={client.email || ""}
            onChange={(e) => setClient({ ...client, email: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Date of Birth</span>
          </div>
          <input
            type="date"
            className="input input-bordered w-full"
            value={client.date_birthday || ""}
            onChange={(e) => setClient({ ...client, date_birthday: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">City</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full"
            value={client.city || ""}
            onChange={(e) => setClient({ ...client, city: e.target.value })}
            required
          />
        </label>

        <label className="form-control w-full max-w-2xl">
          <div className="label">
            <span className="label-text">Address</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full"
            value={client.address || ""}
            onChange={(e) => setClient({ ...client, address: e.target.value })}
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

export default EditClient;