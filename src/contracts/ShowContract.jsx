import { useNavigate, useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

export default function ShowContract() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const contract = useSelector((state) => state.contracts.find((contract) => contract.id.toString() === id));
  const cars = useSelector(state => state.cars);
  const clients = useSelector(state => state.clients);
  const car = contract.getCar(cars)
  const client = contract.getClient(clients)


  return (
    <div className="flex justify-center mt-4">
      <div className="card max-w-lg w-full border-sh">
        <div className="card-body p-6">
          <div className="flex gap-4 justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <h1 className="text-3xl text-center">Contract ID</h1>
              <span className="badge badge-outline badge-lg mt-1">{contract.id}</span>
            </div>
            <button onClick={() => { navigate(-1) }} className="btn btn-sm w-11 btn-outline btn-square mt-1">
              <FontAwesomeIcon icon={faArrowLeftLong} />
            </button>
          </div>
          <div className="flex gap-3 text-lg justify-between">
            <div className="font-semibold">Car ID<span className="badge badge-outline mb-1.5 ml-3">{car.id}</span></div>
            <Link className="link link-primary" to={`/cars/${car.id}`} >{car.getName()}</Link>
          </div>
          <div className="flex gap-3 text-lg justify-between">
            <div className="font-semibold">Client ID<span className="badge badge-outline mb-1.5 ml-3">{client.id}</span></div>
            <Link className="link link-primary" to={`/clients/${client.id}`} >{client.getFullName()}</Link>
          </div>
          <div className="flex gap-3 text-lg justify-between">
            <div className="font-semibold">Start Date</div>
            <div>{contract.startDate}</div>
          </div>
          <div className="flex gap-3 text-lg justify-between">
            <div className="font-semibold">End Date</div>
            <div>{contract.endDate}</div>
          </div>
          <div className="flex gap-3 text-lg justify-between">
            <div className="font-semibold">Duration</div>
            <div>{contract.getDuration()}&nbsp;Day</div>
          </div>
          <div className="flex gap-3 text-lg justify-between">
            <div className="font-semibold">Price</div>
            <div>{car.price}&nbsp;€ / Day</div>
          </div>
          <div className="flex gap-3 text-lg justify-between">
            <div className="font-semibold">Total Price</div>
            <div>{contract.getTotalPrice(cars)}&nbsp;€</div>
          </div>
          <div className="flex gap-3 text-lg justify-between">
            <div className="font-semibold">Status</div>
            <span className={`badge badge-soft badge-lg w-32 ${contract.getStatus() ? "badge-success" : "badge-secondary"}`}>{contract.getStatus() ? "Active" : "Expired"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
