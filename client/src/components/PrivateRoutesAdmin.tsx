import React from "react";
import { useAppSelector } from "../app/hooks";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutesAdmin() {
    const { user } = useAppSelector((state) => state.auth);

    return (
        user?.isAdmin ? <Outlet /> : <Navigate to="/" />
    )
}

export default PrivateRoutesAdmin