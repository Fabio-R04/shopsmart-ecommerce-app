import React from "react";
import { useAppSelector } from "../app/hooks";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutesUser() {
    const { user } = useAppSelector((state) => state.auth);

    return (
        user ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutesUser