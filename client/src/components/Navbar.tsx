import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { clearProductStorage } from "../features/product/productSlice";

function Navbar() {
    const [query, setQuery] = useState<string>("");
    const { user } = useAppSelector((state) => state.auth);
    const { cartItems } = useAppSelector((state) => state.product);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/search/${query}`);
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar__brand">
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M882.7 305.3c11.6 14.7 15.7 33.5 11.3 51.6l-43.4 179.9c-8.1 33.5-37.8 56.9-72.3 56.9H454.2v-20.1h324.1c25.1 0 46.8-17.1 52.8-41.5l43.4-179.9c2.9-12.1 0.2-24.7-7.5-34.5s-19.3-15.4-31.8-15.4H336.4v-20.1H835.3c18.5 0 35.8 8.4 47.4 23.1z" fill="#8B7B5E"></path><path d="M800.5 701.8v20.1H415.1c-28.3 0-53.1-19.1-60.4-46.5L233 215.7c-4.9-18.6-21.8-31.5-40.9-31.5h-84.2v-20.1H192c28.3 0 53.1 19.1 60.4 46.5l121.8 459.7c4.9 18.5 21.8 31.5 41 31.5h385.3zM750.2 757.1c38.1 0 69.1 31 69.1 69.1 0 38.1-31 69.1-69.1 69.1s-69.1-31-69.1-69.1c0-38.1 31-69.1 69.1-69.1z m49 69.1c0-27-22-49-49-49s-49 22-49 49 22 49 49 49 49-22 49-49z" fill="#8B7B5E"></path><path d="M765.5 199.4V248c0 10.6-8.6 19.1-19.2 19.1h-1.6v15h-8.9v-15h-93.7v15h-10.4v-91c-0.9 0-1.7 0.1-2.5 0.1-7.1 0-14.6-0.2-22.5-0.7h-2.2c-3.1 0.2-6.1 0.3-9.1 0.4v91.2H585v-15h-96.3v15h-8.9v-15h-4.2c-10.6 0-19.2-8.6-19.2-19.1v-48.7c0-10.6 8.6-19.1 19.2-19.1h42.8c-7.4-3.9-13-8.7-16.3-14.6-10.3-18.2 3-37.9 3.6-38.7 9.6-11.6 20.3-16.7 32.3-15.3 30.3 3.4 58.3 48.9 67.6 65.5 9.3-16.6 37.3-62.1 67.6-65.5 11.9-1.3 22.7 3.7 32 14.9 0.9 1.2 14.1 21 3.9 39.1-3.3 5.9-8.9 10.7-16.3 14.6h53.6c10.6 0 19.1 8.6 19.1 19.2zM755.2 248v-48.7c0-4.8-3.9-8.8-8.8-8.8h-98.3c-1.9 0.1-3.9 0.3-5.9 0.4v65.9h104.2c4.8 0 8.8-3.9 8.8-8.8zM700 160.5c7.1-12.5-3-27.7-3.1-27.8-6.7-8.1-14.3-11.8-22.5-10.8-22.4 2.5-47 37.9-58.6 58.3h33.4c33.1-2.5 46.1-11.4 50.8-19.7z m-138.2 19.7h33.7c-11.6-20.4-36.2-55.8-58.6-58.3-8.3-0.9-15.8 2.7-22.8 11.2 0 0-9.8 15-2.8 27.4 4.7 8.2 17.6 17.2 50.5 19.7z m23.3 76.6v-65.6h-3c-6.8 0-13-0.3-18.9-0.7h-87.5c-4.8 0-8.8 3.9-8.8 8.8V248c0 4.8 3.9 8.8 8.8 8.8h109.4z" fill="#EF4668"></path><path d="M755.2 199.4V248c0 4.8-3.9 8.8-8.8 8.8H642.2V191c2-0.1 4-0.2 5.9-0.4h98.3c4.8 0 8.8 3.9 8.8 8.8z" fill="#FFF0C2"></path><path d="M642.2 267.2h93.7v15h-93.7z" fill="#FFE085"></path><path d="M696.9 132.7c0.1 0.2 10.2 15.3 3.1 27.8-4.7 8.2-17.7 17.2-50.8 19.7h-33.4c11.6-20.4 36.2-55.8 58.6-58.3 8.3-1 15.8 2.7 22.5 10.8zM606.7 190.6c7.9 0.5 15.4 0.7 22.5 0.7 0.9 0 1.7-0.1 2.5-0.1v91h-36.4V191c3-0.1 6-0.2 9.1-0.4h2.3zM595.5 180.2h-33.7c-32.9-2.5-45.9-11.5-50.5-19.7-7.1-12.4 2.8-27.4 2.8-27.4 7-8.5 14.5-12.1 22.8-11.2 22.4 2.5 47 37.9 58.6 58.3z" fill="#F59A9B"></path><path d="M488.8 267.2h96.3v15h-96.3z" fill="#FFE085"></path><path d="M585.1 191.2v65.6H475.7c-4.8 0-8.8-3.9-8.8-8.8v-48.7c0-4.8 3.9-8.8 8.8-8.8h87.5c5.9 0.4 12.1 0.7 18.9 0.7 0.9 0.1 2 0 3 0z" fill="#FFF0C2"></path><path d="M435.7 757.1c38.1 0 69.1 31 69.1 69.1 0 38.1-31 69.1-69.1 69.1s-69.1-31-69.1-69.1c0-38.1 31-69.1 69.1-69.1z m49 69.1c0-27-22-49-49-49s-49 22-49 49 22 49 49 49 49-22 49-49z" fill="#8B7B5E"></path></g></svg>
                <h1>Shopsmart</h1>
            </Link>
            <form onSubmit={handleSearchSubmit} className="navbar__form">
                <input
                    onChange={handleQueryChange}
                    value={query}
                    type="text"
                    placeholder="Search Product"
                    required
                />
                <button type="submit" style={{ border: "none" }}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M17.0392 15.6244C18.2714 14.084 19.0082 12.1301 19.0082 10.0041C19.0082 5.03127 14.9769 1 10.0041 1C5.03127 1 1 5.03127 1 10.0041C1 14.9769 5.03127 19.0082 10.0041 19.0082C12.1301 19.0082 14.084 18.2714 15.6244 17.0392L21.2921 22.707C21.6828 23.0977 22.3163 23.0977 22.707 22.707C23.0977 22.3163 23.0977 21.6828 22.707 21.2921L17.0392 15.6244ZM10.0041 17.0173C6.1308 17.0173 2.99087 13.8774 2.99087 10.0041C2.99087 6.1308 6.1308 2.99087 10.0041 2.99087C13.8774 2.99087 17.0173 6.1308 17.0173 10.0041C17.0173 13.8774 13.8774 17.0173 10.0041 17.0173Z" fill="#0F0F0F"></path> </g></svg>
                </button>
            </form>
            <div className="navbar__navigation">
                <div className="dropdown">
                    <button style={{ backgroundColor: "transparent", padding: "1rem" }} className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <div className="navbar__navigation-link navbar__navigation-categories">
                            <p>Categories</p>
                            <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 404.257 404.257"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon points="386.257,114.331 202.128,252.427 18,114.331 0,138.331 202.128,289.927 404.257,138.331 "></polygon> </g></svg>
                        </div>
                    </button>
                    <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to="/section/headphones">Headphones</Link></li>
                        <li><Link className="dropdown-item" to="/section/watches">Watches</Link></li>
                        <li><Link className="dropdown-item dropdown-item__last-child" to="/section/earphones">Earphones</Link></li>
                    </ul>
                </div>
                {user ? (
                    <div className="dropdown">
                        <button style={{ backgroundColor: "transparent", padding: "1rem" }} className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <div className="navbar__navigation-link">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="User / User_02"> <path id="Vector" d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21M12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                                <p>Account</p>
                            </div>
                        </button>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                            {user?.isAdmin && (
                                <li><Link className="dropdown-item" to="/admin/dashboard">Admin Dashboard</Link></li>
                            )}
                            <li><Link onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                                event.preventDefault();
                                dispatch(clearProductStorage());
                                dispatch(logout());
                            }} className="dropdown-item dropdown-item__last-child" to="#">Logout</Link></li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="navbar__navigation-link">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9m6-9-4-4m4 4-4 4m4-4H5"></path></g></svg>
                        <p>Login</p>
                    </Link>
                )}
                <Link to="/cart" className="navbar__navigation-link">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M6.01 16.136L4.141 4H3a1 1 0 0 1 0-2h1.985a.993.993 0 0 1 .66.235.997.997 0 0 1 .346.627L6.319 5H14v2H6.627l1.23 8h9.399l1.5-5h2.088l-1.886 6.287A1 1 0 0 1 18 17H7.016a.993.993 0 0 1-.675-.248.999.999 0 0 1-.332-.616zM10 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm9 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0-18a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0V6h-1a1 1 0 1 1 0-2h1V3a1 1 0 0 1 1-1z" fill="#0D0D0D"></path></g></svg>
                    <p>Cart</p>
                    {cartItems.length > 0 && (
                        <div className="navbar__navigation-link__cart-number">
                            <p>{cartItems.length}</p>
                        </div>
                    )}
                </Link>
            </div>
        </nav>
    )
}

export default Navbar