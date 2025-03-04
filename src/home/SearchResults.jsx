import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../components/hooks/outsideClick";

import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import Fuse from "fuse.js"
import CarCard from "../components/CarCard"

function SearchResults() {
  const location = useLocation()
  const cars = useSelector((state) => state.cars)
  const contracts = useSelector((state) => state.contracts)
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const query = searchParams.get("q")

    if (query) {
      const fuse = new Fuse(cars, {
        keys: ["brand", "model", "year", "type"],
        threshold: 0.3,
      })
      const results = fuse.search(query).map((result) => result.item)
      setSearchResults(results)
    }
  }, [location.search, cars])




    const [active, setActive] = useState(null);
    const id = useId();
    const ref = useRef(null);
  
    useEffect(() => {
      function onKeyDown(event) {
        if (event.key === "Escape") {
          setActive(false);
        }
      }
  
      if (active && typeof active === "object") {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
  
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);
  
    useOutsideClick(ref, () => setActive(null));

    const cards = searchResults.map(c => ({
      ...c,
      title: c.getName() + " " + c.year,
      src: c.image,
      ctaText: "rent now",
      ctaLink: "https://ui.aceternity.com/templates",
      content: <UserInfo/>
    })
  )
  
    return (<>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10" />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.id}-${id}`}
              layout
              initial={{opacity: 0,}}
              animate={{opacity: 1,}}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}>
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-full my-4 max-w-fit max-h-[90%] h-fit flex flex-col gap-4 p-4 bg-base-300 rounded-xl outline-primary outline-2 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
              <motion.div layoutId={`car-${active.id}-${id}`} className="flex md:flex-row flex-col gap-2">
                <motion.div layoutId={`image-${active.id}-${id}`}>
                  <img
                    src={active.src}
                    alt={active.title}
                    className="w-full h-60 rounded-xl sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center" />
                </motion.div>

                <div className="flex justify-between items-start p-4">
                  <div className="flex flex-col w-full my-auto items-center gap-2 px-2">
                    <motion.div className="flex flex-col w-full gap-2 items-center">
                      <motion.span
                        layoutId={`title-${active.id}-${id}`}
                        className="font-medium text-xl mb-1 text-neutral-800 dark:text-neutral-200 text-center md:text-left">
                        {active.title}
                      </motion.span>
                      <motion.span
                        layoutId={`type-${active.id}-${id}`}
                        className="badge badge-soft badge-accent badge-lg capitalize">
                        {active.type}
                      </motion.span>
                      <motion.span
                        layoutId={`available-${active.id}-${id}`}
                        className={`badge badge-soft badge-lg ${active.available ? "badge-success" : "badge-secondary"}`}>
                        {active.available ? "Available Now" : `Available in ${active.getDaysLeft(contracts)} Days`}
                      </motion.span>
                    </motion.div>
                      <motion.div
                        layoutId={`price-${active.id}-${id}`}
                        className="flex justify-center items-center mt-3 px-2 gap-2 w-full">
                        <span className="text-primary font-bold text-3xl border-r pr-2">{active.price}&nbsp;€</span>
                        <span className="text-sm">Per Day</span>
                      </motion.div>
                  </div>
  
                  {/* <motion.a
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 btn capitalize btn-primary">
                    {active.ctaText}
                  </motion.a> */}
                </div>
              </motion.div>
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                {typeof active.content === "function"
                  ? active.content()
                  : active.content}
              </motion.div>
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                {typeof active.content === "function"
                  ? active.content()
                  : active.content}
              </motion.div>
  
              {/* <div>
              
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div> */}
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div
        className="mx-auto p-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.id}-${id}`}
            key={index}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col outline-transparent outline-2 transition-colors duration-300 hover:bg-base-300 hover:outline-primary rounded-xl cursor-pointer">
            <div className="flex gap-4 flex-col items-center w-full">
              <motion.div layoutId={`image-${card.id}-${id}`}>
                <img
                  src={card.src}
                  alt={card.title}
                  className="h-60 w-full rounded-lg object-cover object-center" />
              </motion.div>
              <div className="flex w-full justify-between items-center gap-2">
                <motion.div className="flex flex-col w-full px-2 gap-2 items-start">
                  <motion.span
                    layoutId={`title-${card.id}-${id}`}
                    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base">
                    {card.title}
                  </motion.span>
                  <motion.span
                    layoutId={`available-${card.id}-${id}`}
                    className={`badge badge-soft badge-lg ${card.available ? "badge-success" : "badge-secondary"}`}>
                    {card.available ? "Available Now" : `Available in ${card.getDaysLeft(contracts)} Days`}
                  </motion.span>
                </motion.div>
                  <motion.div
                    layoutId={`price-${card.id}-${id}`}
                    className="flex flex-col gap-1 w-1/3 text-center">
                    <span className="text-primary font-bold text-2xl border-b">{card.price}&nbsp;€</span>
                    <span className="text-sm">Per Day</span>
                  </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {searchResults.length === 0 && <p className="text-center text-lg">No results found.</p>}
    </>);
  }
  
  export const CloseIcon = () => {
    return (
      (<motion.svg
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.05,
          },
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-black">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </motion.svg>)
    );
  };

  export const UserInfo = () => {
    const user = useSelector((state) => state.user)
    return (
      <div className="p-4 flex flex-col gap-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg  mx-auto">
        {/* User Avatar and Full Name */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
              {user.getFullName()}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {user.email}
            </p>
          </div>
        </div>
  
        {/* Additional User Info */}
        <div className="flex md:flex-row flex-col justify-between gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-neutral-600 dark:text-neutral-400">
                {user.getAge()} years old
              </p>
            </div>
    
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-neutral-600 dark:text-neutral-400">
                {user.city}, {user.address}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
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
              <p className="text-neutral-600 dark:text-neutral-400">
                CIN: {user.cin}
              </p>
            </div>
    
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-neutral-600 dark:text-neutral-400">
                Driving License: {user.drivingLicenseId}
              </p>
            </div>
          </div>
  

        </div>
      </div>
    );
  }
  
  
  











//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold mb-6">Search Results</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {searchResults.map((car) => (
//           <CarCard key={car.id} car={car} />
//         ))}
//       </div>
//       {searchResults.length === 0 && <p className="text-center text-lg">No results found.</p>}
//     </div>
//   )
// }

export default SearchResults

