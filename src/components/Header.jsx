"use client"

import { Link, NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { message } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

function Header() {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const logout = () => {
    localStorage.removeItem("user_email")
    dispatch({ type: "UPDATE_USER", payload: null })
    message.open({
      type: "success",
      content: "logged out",
      duration: 2,
      icon: <FontAwesomeIcon className="mr-2" icon={faCheckCircle} />,
    })
    navigate("/")
  }

  const handleSearch = () => {
    if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`)}
  }

  return (
    <div className="navbar bg-base-100 mb-4">
      <div className="navbar-start">
        <Link className="btn btn-primary border-2 text-xl font-bold" to="/">
          Med Cars
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal px-1">
          {user?.role === "admin" && (
            <>
              <li><NavLink className={({ isActive }) => `btn btn-sm btn-outline btn-accent mx-2 ${isActive ? "btn-active font-bold text-base" : ""}`} to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink className={({ isActive }) => `btn btn-sm btn-outline btn-accent mx-2 ${isActive ? "btn-active font-bold text-base" : ""}`} to="/cars">Cars</NavLink></li>
              <li><NavLink className={({ isActive }) => `btn btn-sm btn-outline btn-accent mx-2 ${isActive ? "btn-active font-bold text-base" : ""}`} to="/clients">Clients</NavLink></li>
              <li><NavLink className={({ isActive }) => `btn btn-sm btn-outline btn-accent mx-2 ${isActive ? "btn-active font-bold text-base" : ""}`} to="/contracts">Contracts</NavLink></li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        <div className="w-1/2 join">
          <label className="join-item input input-sm input-accent">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
            <input type="search" className="grow" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
          </label>
          <button onClick={handleSearch} className="join-item btn btn-sm btn-accent"><FontAwesomeIcon className="text-[16px]" icon={faArrowRight} /></button>
        </div>
        {user ? (
          <button className="btn btn-sm btn-outline btn-accent mx-2" onClick={logout}>
            Logout
          </button>
        ) : (
          <NavLink
            className={({ isActive }) =>
              `btn btn-sm btn-outline btn-accent mx-2 ${isActive ? "btn-active font-bold text-base" : ""}`
            }
            to="/sign"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </div>
  )
}

export default Header

