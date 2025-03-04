import React, { useState } from "react";
import axios from "axios";
import { Tabs } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function FormTabs() {
    const [activeTab, setActiveTab] = useState("Sign Up");
    const tabsContent = [
        { label: "Sign Up", child: <SignupForm setActiveTab={setActiveTab} /> },
        { label: "Login", child: <LoginForm setActiveTab={setActiveTab} /> }
    ];
    return (
        <div className="max-w-lg w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input">
            <Tabs
                activeKey={activeTab}
                animated
                centered
                onTabClick={(key) => setActiveTab(key)}
                items={tabsContent.map((t, i) => ({ label: t.label, key: t.label, children: t.child }))}
            />
        </div>
    );
}

export function SignupForm({ setActiveTab }) {
    const clients = useSelector(state => state.clients);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [confirmPass, setConfirmPass] = useState("");
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "client",
    });

    const [errors, setErrors] = useState({email: "", confirmPass: ""});

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (clients.find(c => c.email === user.email)) {
            newErrors.email = "Email already registered";
        }
        if (user.password !== confirmPass) {
            newErrors.confirmPass = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        axios.post("http://localhost:3001/clients", user)
            .then(res => {
                const newUser = createUser(res.data)
                dispatch({ type: "UPDATE_CLIENTS", payload: [...clients, newUser] });
                localStorage.setItem("user_email", user.email);
                dispatch({ type: "UPDATE_USER", payload: newUser });
                navigate("/");
            })
            .catch(error => console.error("Error adding user:", error));
    };

    return (
        <fieldset className="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend">Sign Up</legend>
            <h2 className="font-bold text-xl">Welcome to Med Cars</h2>
            <p className="text-sm max-w-sm mt-2">
                Create an account and rent a car
            </p>
            <form className="mt-6" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-1">
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="firstname">First name</label>
                        <input id="firstname" className="input w-full validator" placeholder="First name" type="text" onChange={e => setUser({ ...user, firstName: e.target.value.trim() })} value={user.firstName} required />
                        <div className="validator-hint visible">Enter valid name</div>
                    </div>
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="lastname">Last name</label>
                        <input id="lastname" className="input w-full validator" placeholder="Durden" type="text" onChange={e => setUser({ ...user, lastName: e.target.value.trim() })} value={user.lastName} required />
                        <div className="validator-hint visible">Enter valid name</div>
                    </div>
                </div>

                <div className="mb-1">
                    <label className="fieldset-label" htmlFor="email">Email</label>
                    <input id="email" type="email" className={`input validator w-full ${errors.email && "input-error!"}`} placeholder="rentacar@ex.com" onChange={e => setUser({ ...user, email: e.target.value.trim() })} value={user.email} required />
                    {errors.email ? (<div className="text-error mt-2 text-xs">{errors.email}</div>) : (<div className="validator-hint visible">Enter valid email address</div>)}
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-3">
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="password">Password</label>
                        <input id="password" className={`input validator w-full ${errors.password && "input-error!"}`} placeholder="••••••••" type="password" onChange={e => setUser({ ...user, password: e.target.value })} value={user.password} required />
                        {errors.password ? (<div className="text-error mt-2 text-xs">{errors.password}</div>) : (<div className="validator-hint visible">Enter valid password</div>)}
                        </div>
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="cpassword">Confirm Password</label>
                        <input id="cpassword" className={`input w-full ${errors.confirmPass ? "input-error" : ""}`} placeholder="••••••••" type="password" onChange={e => setConfirmPass(e.target.value)} value={confirmPass} required />
                        {errors.confirmPass && <div className="text-error mt-2 text-xs">{errors.confirmPass}</div>}
                    </div>
                </div>

                <button className="btn btn-primary w-full" type="submit"> Sign Up <FontAwesomeIcon className="mt-1" icon={faArrowRight} /></button>
            </form>
            <div className="divider">Already have an account?</div>
            <button className="btn btn-accent btn-soft" onClick={() => setActiveTab("Login")}>Login</button>
        </fieldset>
    );
}

export function LoginForm({ setActiveTab }) {
    const clients = useSelector(state => state.clients);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const client = clients.find(c => c.email === email);

        if (client && client.password === password) {
            localStorage.setItem("user_email", email);
            dispatch({ type: "UPDATE_USER", payload: client });
            navigate("/");
        } else {
            setError("Invalid email or password");
        }
    };

    return (
        <fieldset className="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend">Login</legend>
            <h2 className="font-bold text-xl">Welcome to Med Cars</h2>
            <p className="text-sm max-w-sm mt-2">
                Login to your account and rent a car
            </p>
            <form className="mt-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="fieldset-label" htmlFor="email">Email</label>
                    <input id="email" type="email" className={`input w-full ${error ? "input-error" : ""}`} placeholder="rentacar@ex.com" onChange={e => setEmail(e.target.value)} value={email} required />
                </div>

                <div className="mb-3">
                    <label className="fieldset-label" htmlFor="password">Password</label>
                    <input id="password" className={`input w-full ${error ? "input-error" : ""}`} placeholder="••••••••" type="password" onChange={e => setPassword(e.target.value)} value={password} required/>
                </div>
                <div className={`text-error text-center mb-3 text-xs ${error ? "opacity-100" : "opacity-0"}`} >{error ? error : "..."}</div>

                <button className="btn btn-primary w-full" type="submit"> Login <FontAwesomeIcon className="mt-1" icon={faArrowRight} /></button>
            </form>
            <div className="divider">You don't have an account yet?</div>
            <button className="btn btn-accent btn-soft" onClick={() => setActiveTab("Sign Up")}>Sign Up</button>
        </fieldset>
    );
}

function createUser(user) {
    return ({...user,
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
          
          return age;
        }
      })
}