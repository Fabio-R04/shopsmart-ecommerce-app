import React from "react";
import { IUser } from "../features/auth/authInterfaces";

interface UserTableProps {
    adminUsers: IUser[];
}

function UserTable({ adminUsers }: UserTableProps) {
    return (
        <div className="profile__content-orders">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">User ID</th>
                        <th scope="col">Full Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">isAdmin</th>
                    </tr>
                </thead>
                <tbody>
                    {adminUsers?.map((u: IUser) => {
                        return (
                            <tr key={u._id}>
                                <th className="profile__content-orders__order-id" scope="row">{u._id}</th>
                                <td>{u.fullName}</td>
                                <td>{u.email}</td>
                                <td>{u.isAdmin ? "True" : "False"}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default UserTable