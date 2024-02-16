import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { login, register, resetAuth } from "../features/auth/authSlice";
import { toast } from "react-hot-toast";
import Spinner from "../components/Spinner";
const authHeadphones = require("../assets/images/auth-headphones.jpg");

export interface RegisterData {
    fullName: string;
    email: string;
    password: string;
}

function Register() {
    const [formData, setFormData] = useState<RegisterData>({
        fullName: "",
        email: "",
        password: ""
    });
    const {
        loadingAuth,
        successAuth,
        errorAuth,
        messageAuth
    } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (successAuth) {
            navigate("/");
            toast.success(messageAuth);
        }

        if (errorAuth) {
            toast.error(messageAuth);
        }

        dispatch(resetAuth());
    }, [successAuth, errorAuth, messageAuth, navigate, dispatch]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(register(formData));
        setFormData({
            fullName: "",
            email: "",
            password: ""
        });
    }

    return (
        <div className="auth">
            {loadingAuth ? (
                <Spinner />
            ) : (
                <>
                    <div className="auth__image">
                        <img
                            src={authHeadphones}
                            alt="Headphones"
                        />
                    </div>
                    <div className="auth__details">
                        <div className="auth__details-container">
                            <h1 className="auth__details-title">Register</h1>
                            <p className="auth__details-description">
                                Create an account now!
                            </p>
                            <form onSubmit={onSubmit} className="auth__details-form">
                                <div className="auth__details-form__field">
                                    <label htmlFor="full-name">Full Name</label>
                                    <input onChange={onChange} value={formData.fullName} name="fullName" type="text" placeholder="Enter full name" id="full-name" required />
                                </div>
                                <div className="auth__details-form__field">
                                    <label htmlFor="email">Email</label>
                                    <input onChange={onChange} value={formData.email} name="email" type="email" placeholder="Enter email" id="email" required />
                                </div>
                                <div className="auth__details-form__field">
                                    <label htmlFor="password">Password</label>
                                    <input onChange={onChange} value={formData.password} name="password" type="password" placeholder="Enter password" id="password" required />
                                </div>
                                <button type="submit" className="auth__details-form__btn">Sign up</button>
                            </form>
                            <p className="auth__details-or">or</p>
                            <div onClick={() => {
                                const email: string = `${process.env.REACT_APP_DEMO_EMAIL}`;
                                const password: string = `${process.env.REACT_APP_DEMO_PASSWORD}`;

                                dispatch(login({
                                    email,
                                    password
                                }));
                            }} className="auth__details-demo">
                                <svg fill="#000000" viewBox="0 0 24 24" id="curve-arrow-right-9" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="secondary" d="M21.71,8.29l-3-3a1,1,0,0,0-1.42,1.42L18.59,8H16.71a11.78,11.78,0,0,0-10.6,6.55,1,1,0,0,0,.44,1.34A.93.93,0,0,0,7,16a1,1,0,0,0,.89-.55A9.81,9.81,0,0,1,16.71,10h1.88l-1.3,1.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l3-3A1,1,0,0,0,21.71,8.29Z" style={{ fill: "#f6a192" }}></path><path id="primary" d="M20,21H4a2,2,0,0,1-2-2V5A2,2,0,0,1,4,3h8a1,1,0,0,1,0,2H4V19H20V16a1,1,0,0,1,2,0v3A2,2,0,0,1,20,21Z" style={{ fill: "#f6a192000000" }}></path></g></svg>
                                <p>Continue with demo</p>
                            </div>
                            <p className="auth__details-switch">
                                Already have an account?
                                <span>
                                    <Link to="/login">Login</Link>
                                </span>
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Register