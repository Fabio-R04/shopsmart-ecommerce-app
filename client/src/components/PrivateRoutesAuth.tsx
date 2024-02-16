import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

function PrivateRoutesAuth() {
    const { user } = useAppSelector((state) => state.auth);

    return (
        user ? <Navigate to="/" /> : <Outlet />
    )
}

export default PrivateRoutesAuth