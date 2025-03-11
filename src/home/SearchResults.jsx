import axios from "axios";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../components/hooks/outsideClick";
import { HoverEffect } from "../components/ui/card-hover-effect";
import { createContract, useUpdateCarAvailability } from "../service/FetchData";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { AlertTriangle, CircleX, SearchX } from "lucide-react";

function SearchResults() {
  useUpdateCarAvailability();

  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cars = useSelector((state) => state.cars);
  const contracts = useSelector((state) => state.contracts);

  const [contract, setContract] = useState(createContract({ clientId: user?.id }));
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  const total = contract.endDate && active ? ((new Date(contract.endDate) - new Date(contract.startDate)) / (1000 * 3600 * 24) ) * active.price : "0.00"

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [types, setTypes] = useState([]);
  
  const carsFuse = new Fuse(getRes(), { keys: ["brand", "model", "year", "type"], threshold: 0.3 });
  const searchResults = query ? carsFuse.search(query).map((r) => r.item) : getRes();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  function toggleType(type) {
    types.includes(type) ? setTypes(types.filter((t) => t !== type)) : setTypes([...types, type]);
  }

  function getRes() {
    let res = filter ? cars.filter((c) => c.brand === filter) : cars;
    res = types.length ? res.filter((c) => types.includes(c.type)) : res;
    return res;
  }

  function getTotalOf(type) {
    return cars.filter((c) => c.type === type).length;
  }

  function getPerOf(type) {
    return ((100 / cars.length) * getTotalOf(type)).toFixed(0);
  }

  function getAllBrands(cars) {
    const uniqueBrands = new Set();
    cars.forEach((car) => {
      uniqueBrands.add(car.brand);
    });
    return Array.from(uniqueBrands);
  }

  function toggleCar(carId, isAvailable) {
    const car = cars.find((c) => c.id === carId);
    axios.put(`http://localhost:3001/cars/${car.id}`, { ...car, available: isAvailable }).then(() => {
      dispatch({ type: "UPDATE_CARS", payload: cars.map((c) => (c.id === car.id ? { ...car, available: isAvailable } : c)) });
    });
  }

  function submiteContract() {
    setActive(false);
    axios.post("http://localhost:3001/contracts", contract)
      .then((res) => {
        dispatch({ type: "UPDATE_CONTRACTS", payload: [...contracts, createContract(res.data)] });
        toggleCar(contract.carId, !contract.getStatus());
      })
      .catch((error) => console.error("Error adding contract:", error));
  }

  function isRented(car) {
    if (user) {
      const ids = user.getActiveContracts(contracts).map((c) => c.carId);
      return ids.includes(car.id);
    } else return false;
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
      setContract({ ...contract, carId: active.id });
    } else {
      document.body.style.overflow = "auto";
      setContract({ ...contract, carId: "", startDate: "", endDate: "" });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const cards = currentItems.map((c) => ({
    ...c,
    title: c.getName() + " " + c.year,
    content: <UserInfo user={user} />,
  })).map((c) => (
    <motion.div
      layoutId={`card-${c.id}-${id}`}
      key={c.id}
      onClick={() => setActive(c)}
      className="p-4 flex flex-col border-sh color-scale-trans duration-300 hover:bg-base-300 hover:border-primary hover:scale-95 rounded-xl cursor-pointer"
    >
      <div className="flex gap-4 flex-col items-center w-full">
        <motion.div layoutId={`image-${c.id}-${id}`}>
          <img
            src={c.image}
            alt={c.title}
            className="h-60 w-full rounded-lg object-cover object-center"
          />
        </motion.div>
        <div className="flex w-full justify-between items-center gap-2">
          <motion.div className="flex flex-col w-full px-2 gap-2 items-start">
            <motion.span
              layoutId={`title-${c.id}-${id}`}
              className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
            >
              {c.title}
            </motion.span>
            <motion.span
              layoutId={`available-${c.id}-${id}`}
              className={`badge font-medium badge-lg ${isRented(c) ? "badge-primary" : c.available ? " badge-soft badge-success" : " badge-soft badge-secondary"}`}
            >
              {isRented(c) ? "Rented" : c.available ? "Available Now" : `Available in ${c.getDaysLeft(contracts)} Days`}
            </motion.span>
          </motion.div>
          <motion.div
            layoutId={`price-${c.id}-${id}`}
            className="flex flex-col gap-1 w-1/3 text-center"
          >
            <span className="text-primary font-bold text-2xl border-b">{c.price}&nbsp;€</span>
            <span className="text-sm">Per Day</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  ));


  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <motion.div><CircleX size={28} stroke="#ff865b" fill={"#0e171e"} /></motion.div>
            </motion.button>
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-full my-4 max-w-fit max-h-[90%] h-fit flex flex-col gap-6 p-4 bg-base-300 rounded-xl outline-primary outline-2 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
            >
              <motion.div layoutId={`car-${active.id}-${id}`} className="flex md:flex-row flex-col gap-2">
                <motion.div layoutId={`image-${active.id}-${id}`}>
                  <img
                    src={active.image}
                    alt={active.title}
                    className="w-full h-60 rounded-xl sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center"
                  />
                </motion.div>
                <div className="flex justify-between items-start p-4">
                  <div className="flex flex-col w-full my-auto items-center gap-2 px-2">
                    <motion.div className="flex flex-col w-full gap-2 items-center">
                      <motion.span
                        layoutId={`title-${active.id}-${id}`}
                        className="font-medium text-xl mb-1 text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                      >
                        {active.title}
                      </motion.span>
                      <motion.span
                        layoutId={`type-${active.id}-${id}`}
                        className="badge badge-soft badge-accent badge-lg capitalize"
                      >
                        {active.type}
                      </motion.span>
                      <motion.span
                        layoutId={`available-${active.id}-${id}`}
                        className={`badge font-medium badge-lg ${isRented(active) ? "badge-primary" : active.available ? " badge-soft badge-success" : " badge-soft badge-secondary"}`}
                      >
                        {isRented(active) ? "Rented" : active.available ? "Available Now" : `Available in ${active.getDaysLeft(contracts)} Days`}
                      </motion.span>
                    </motion.div>
                    <motion.div
                      layoutId={`price-${active.id}-${id}`}
                      className="flex justify-center items-center mt-3 px-2 gap-2 w-full"
                    >
                      <span className="text-primary font-bold text-3xl border-r pr-2">{active.price}&nbsp;€</span>
                      <span className="text-sm">Per Day</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              <div className="flex flex-col gap-3">
                <label className="input w-full gap-0 pr-1">
                  <span className="label">Duration</span>
                  <RangePicker
                    className="input! rounded-none! border-x-0! w-full! text-neutral-400! focus-within:outline-none!"
                    popupClassName="text-red-400!"
                    placeholder={['From', 'To']}
                    minDate={dayjs(active.getAvailabilityDate(contracts))}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode.parentNode}
                    onChange={(date, dateString) => setContract({ ...contract, startDate: dateString[0], endDate: dateString[1] })}
                    format={'YYYY-MM-DD'}
                  />
                </label>
                <div className="flex flex-col w-full md:flex-row gap-3">
                  <div className="input w-full md:w-1/2">
                    <span>Total</span>
                    <span className="border-l text-lg font-bold text-primary pl-2">{total}&nbsp;€</span>
                  </div>
                  <button className={`btn btn-primary w-full md:w-1/2 ${(!user || !contract.endDate || !active.available) && "btn-disabled"}`} onClick={submiteContract}>Rent Now</button>
                </div>
              </div>
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {typeof active.content === "function" ? active.content() : active.content}
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="m-4 border-sh rounded-2xl">
        <div className="flex justify-end mt-4 p-3 gap-3">
          <div className="flex gap-1.5">
            <button className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize ${types.includes("petrol") ? "btn-active" : ""}`} onClick={() => toggleType("petrol")}>petrol</button>
            <button className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize ${types.includes("diesel") ? "btn-active" : ""}`} onClick={() => toggleType("diesel")}>diesel</button>
            <button className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize ${types.includes("electric") ? "btn-active" : ""}`} onClick={() => toggleType("electric")}>electric</button>
            <button className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize ${types.includes("hybrid") ? "btn-active" : ""}`} onClick={() => toggleType("hybrid")}>hybrid</button>
          </div>
          <select className="select select-sm w-1/8 rounded-2xl" onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Brands</option>
            {getAllBrands(cars).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <label className="input input-sm w-1/6 rounded-2xl">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" className="grow" onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
          </label>
        </div>
        <div className="divider m-0 mx-6"></div>
        <HoverEffect items={cards} hoverClassName="bg-primary/[0.5]" className="mx-auto p-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start gap-4" />
        {searchResults.length === 0 && (
          <div className="flex gap-1 items-center justify-center text-warning text-lg mb-4">
            <SearchX className="pt-0.5" />
            <span>No results found</span>
          </div>
        )}

        <div className="flex justify-center gap-2 my-4">
          <button className="btn btn-sm btn-outline btn-primary transition-colors duration-300" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>❮</button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} className={`btn btn-sm btn-outline btn-primary transition-colors duration-300 ${currentPage === page ? "btn-active" : ""}`} onClick={() => paginate(page)}>{page}</button>
          ))}

          <button className="btn btn-sm btn-outline btn-primary transition-colors duration-300" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>❯</button>
        </div>
      </div>
    </>
  );
}

function UserInfo({ user }) {
  if (!user)
    return (
      <div className="flex gap-1 items-center justify-center text-warning text-lg mb-4">
        <AlertTriangle className="pt-0.5" />
        <Link className="link link-secondary" to="/sign">Sign in</Link>
        <span> to rent a car</span>
      </div>
    );
  return (
    <div className="p-4 flex flex-col gap-2 bg-gradient-to-bl from-primary/10 from-10% via-base-300 via-50% to-accent/10 to-90% rounded-lg shadow-lg mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">{user.getFullName()}</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</p>
        </div>
      </div>
      <div className="flex md:flex-row flex-col justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-neutral-600 dark:text-neutral-200"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-neutral-600 dark:text-neutral-200">{user.getAge()} years old</p>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-neutral-600 dark:text-neutral-200"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-neutral-600 dark:text-neutral-200">
              {user.city}, {user.address}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-neutral-600 dark:text-neutral-200"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-neutral-600 dark:text-neutral-200">CIN: {user.cin}</p>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-neutral-600 dark:text-neutral-200"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-neutral-600 dark:text-neutral-200">Driving License: {user.drivingLicenseId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;