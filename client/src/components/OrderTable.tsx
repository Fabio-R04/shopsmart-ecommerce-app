import React from "react";
import { IOrder, ProductOrder } from "../features/order/orderInterfaces";
import { ViewProducts } from "../pages/Profile";
import moment from "moment";

interface OrderTableProps {
    orders: IOrder[];
    viewAllActive: ViewProducts;
    setViewAllActive: (data: ViewProducts) => void;
}

function OrderTable({ orders, viewAllActive, setViewAllActive }: OrderTableProps) {
    return (
        <div className="profile__content-orders">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Product{"(s)"}</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Total Paid</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map((o: IOrder) => {
                        const totalPrice: number = o.products?.reduce((accumulator: number, product: ProductOrder): number => {
                            return accumulator + (product.details?.productPrice * product.quantity);
                        }, 0);
                        return (
                            <tr key={o._id}>
                                <th className="profile__content-orders__order-id" scope="row">{o._id}</th>
                                <td>{o.user?.fullName}</td>
                                <td className="profile__content-orders__view-orders">
                                    {o.products?.length > 1 ? (
                                        <>
                                            {`${o.products[0]?.details?.productName.slice(0, 5)}...`}
                                            <p onClick={() => setViewAllActive({
                                                active: true,
                                                products: o.products.map((p) => {
                                                    return {
                                                        ...p.details,
                                                        quantity: p.quantity
                                                    }
                                                })
                                            })}>View All</p>
                                        </>
                                    ) : (
                                        `${o.products[0]?.details?.productName} (x${o.products[0]?.quantity})`
                                    )}
                                </td>
                                <td>{moment(o.createdAt).format("MMM DD, YYYY")}</td>
                                <td>{o.status}</td>
                                <td>${totalPrice}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {viewAllActive.active && (
                <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    const target = event.target as HTMLDivElement;
                    if (target.id === "profile__content-orders__view-all") {
                        setViewAllActive({
                            active: false,
                            products: []
                        });
                    }
                }} className="profile__content-orders__view-all" id="profile__content-orders__view-all">
                    <svg onClick={() => setViewAllActive({
                        active: false,
                        products: []
                    })} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#ffffff"></path> </g></svg>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Product Name</th>
                                <th scope="col">Product Category</th>
                                <th scope="col">Product Color</th>
                                <th scope="col">Product Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewAllActive.products.map((p) => (
                                <tr key={p._id}>
                                    <td>{p.productName}</td>
                                    <td>{p.productCategory}</td>
                                    <td>{p.productColor}</td>
                                    <td>${p.productPrice}</td>
                                    <td>{p.quantity}</td>
                                    <td>{p.rating.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default OrderTable