import { useNavigate, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

export default function ShowCar() {
  const navigate = useNavigate();

  const { id } = useParams();
  const car = useSelector((state) =>
    state.cars.find((car) => car.id.toString() === id)
  );


  return (
    <div className="flex justify-center mt-4">
      <div className="card flex-col-reverse lg:card-side  max-w-[1020px] w-full border-sh">
        <figure className="rounded-b-2xl rounded-t-none">
          <img src={car.image} alt="Car Image" />
        </figure>
        <div className="card-body p-6 min-w-[360px] gap-3">
          <div className="flex gap-4 justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <h1 className="text-3xl text-center">Car ID</h1>
              <span className="badge badge-outline badge-lg mt-1">
                {car.id}
              </span>
            </div>
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="btn btn-sm w-11 btn-outline  btn-square mt-1"
            >
              <FontAwesomeIcon icon={faArrowLeftLong} />
            </button>
          </div>
          <div className="flex gap-3 text-lg justify-between">
            <div className="font-semibold capitalize">Brand</div>
            <span className="badge badge-outline badge-lg mt-1">
              {car.brand}
            </span>
          </div>
          <div className="flex gap-3 text-lg justify-between capitalize">
            <div className="font-semibold">model</div>
            <div>{car.model}</div>
          </div>
          <div className="flex gap-3 text-lg justify-between">
            <div className="font-semibold">Price</div>
            <div>{car.price}&nbsp;€</div>
          </div>
          <div className="flex gap-3 text-lg justify-between">
            <div className="font-semibold">Year</div>
            <div>{car.year}</div>
          </div>
          <div className="flex gap-3 text-lg justify-between capitalize">
            <div className="font-semibold">Type</div>
            <div>{car.type}</div>
          </div>
          <div className="flex gap-3 text-lg justify-between capitalize">
            <div className="font-semibold">status</div>
            <span
              className={`badge badge-soft badge-lg w-32 ${
                car.available ? "badge-success" : "badge-secondary"
              }`}
            >
              {car.available ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
