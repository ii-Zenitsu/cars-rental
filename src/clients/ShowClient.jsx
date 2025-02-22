import { Link, useNavigate, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

export default function ShowClient() {
  const navigate = useNavigate();
  
  const { id } = useParams();
  const client = useSelector((state) => state.clients.find((client) => client.id.toString() === id));
  const contracts = useSelector((state) => state.contracts);


  return (
    <div className="flex justify-center mt-4">
      <div className="card max-w-xl w-full border-sh">
      <div className="card-body p-6">
        <div className="flex gap-4 justify-between items-center mb-6">
          <div className="flex gap-2 items-center">
            <h1 className="text-3xl text-center">Client ID</h1>
            <span className="badge badge-outline badge-lg mt-1">{client.id}</span>
          </div>
          <button onClick={() => { navigate(-1) }} className="btn btn-sm w-11 btn-outline btn-square mt-1">
              <FontAwesomeIcon icon={faArrowLeftLong} />
            </button>
        </div>
        <div className="flex gap-3 text-lg justify-between">
          <div className="font-semibold">First Name</div>
          <div>{client.firstName}</div>
        </div>

        <div className="flex gap-3 text-lg justify-between">
          <div className="font-semibold">Last Name</div>
          <div>{client.lastName}</div>
        </div>

        <div className="flex gap-3 text-lg justify-between">
          <div className="font-semibold">Email</div>
          <div>{client.email}</div>
        </div>

        <div className="flex gap-3 text-lg justify-between">
          <div className="font-semibold">Birthday</div>
          <div>{client.date_birthday}</div>
        </div>

        <div className="flex gap-3 text-lg justify-between">
          <div className="font-semibold">Age</div>
          <div>{client.getAge()}&nbsp;Years</div>
        </div>

        <div className="flex gap-3 text-lg justify-between">
          <div className="font-semibold">City</div>
          <div>{client.city}</div>
        </div>

        <div className="flex gap-3 text-lg justify-between">
          <div className="font-semibold">Address</div>
          <div>{client.address}</div>
        </div>
        <div className="collapse collapse-arrow" onClick={(e) => e.currentTarget.classList.toggle('collapse-open')}>
          <div className="collapse-title text-2xl font-semibold px-0">Client's Contracts</div>
          <div className="collapse-content px-0">
            <div className="overflow-x-auto text-lg rounded-lg">
              <table className="table text-center">
                <thead>
                  <tr className="bg-base-300">
                    <th>Id</th>
                    <th>Car id</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>status</th>
                  </tr>
                </thead>
                <tbody>
                  {client.getContracts(contracts).map( c => (
                    <tr key={c.id} className="hover:bg-base-200 hover:cursor-pointer" onClick={() => { navigate(`/contracts/${c.id}`) }}>
                      <td>{c.id}</td>
                      <td>{c.carId}</td>
                      <td>{c.startDate}</td>
                      <td>{c.endDate}</td>
                      <td><span className={`badge badge-soft badge-lg w-32 ${c.getStatus() ? "badge-success" : "badge-secondary"}`}>{c.getStatus() ? "Active" : "Expired"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    </div>
  )
}
