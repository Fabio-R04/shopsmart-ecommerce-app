import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import Navbar from "../components/Navbar";
import { deleteCartItem, updateQuantity } from "../features/product/productSlice";
import { createCheckoutSession } from "../features/order/orderSlice";
import Spinner from "../components/Spinner";

function Cart() {
    const [total, setTotal] = useState<number>(0);
    const { cartItems } = useAppSelector((state) => state.product);
    const { loadingOrderCheckout } = useAppSelector((state) => state.order);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (cartItems) {
            let total: number = 0;
            for (const item of cartItems) {
                const itemPrice: number = item.productPrice * item.quantity;
                total += itemPrice;
            }
            setTotal(total);
        }
    }, [cartItems]);

    const removeCartItem = (productId: string): void => {
        dispatch(deleteCartItem({ productId }));
    }

    const handleCheckout = () => {
        dispatch(createCheckoutSession(cartItems));
    }

    return (
        <div className="main-container">
            <Navbar />
            <div className="cart">
                {loadingOrderCheckout ? (
                    <Spinner />
                ) : (
                    <div className="cart__content">
                        <div className="cart__content-products">
                            {cartItems.length > 0 ? (
                                cartItems.map((p) => (
                                    <div key={p._id} className="cart__content-products__product">
                                        <div className="cart__content-products__product-image">
                                            <img
                                                src={`${process.env.REACT_APP_SERVER_URL}/product/image/${p._id}`}
                                                alt="Product Image"
                                            />
                                        </div>
                                        <div className="cart__content-products__product-details">
                                            <div className="cart__content-products__product-details__heading">
                                                <p className="cart__content-products__product-details__name">
                                                    {p.productName?.length > 19 ? `${p.productName?.slice(0, 16)}...` : p.productName}
                                                </p>
                                                <p className="cart__content-products__product-details__description">
                                                    {p.productDescription?.length > 60 ? `${p.productDescription.slice(0, 57)}...` : p.productDescription}
                                                </p>
                                            </div>
                                            <div className="cart__content-products__product-details__content">
                                                <div className="cart__content-products__product-details__quantity">
                                                    <p>Qty:</p>
                                                    <input
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            dispatch(updateQuantity({
                                                                productId: p._id,
                                                                productQuantity: Number(event.target.value)
                                                            }));
                                                        }}
                                                        type="number"
                                                        value={p.quantity}
                                                        min={1}
                                                        max={p.productStock}
                                                    />
                                                    <p>${p.productPrice.toFixed(2)}</p>
                                                </div>
                                                <p className="cart__content-products__product-details__full-price">
                                                    ${(p.productPrice * p.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <svg onClick={() => removeCartItem(p._id)} className="cart__content-products__product-close" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clipRule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#000000"></path> </g></svg>
                                    </div>
                                ))
                            ) : (
                                <div style={{ width: "51rem", justifyContent: "center", alignItems: "center", padding: "4rem" }} className="cart__content-products__product">
                                    <h1 style={{ fontWeight: 700, fontSize: "3.5rem" }}>No Items</h1>
                                </div>
                            )}
                        </div>
                        <div className="cart__content-summary">
                            <p className="cart__content-summary__title">
                                Summary
                            </p>
                            <div className="cart__content-summary__details">
                                <div className="cart__content-summary__details-subtotal">
                                    <p>Subtotal:</p>
                                    <p>${total.toFixed(2)}</p>
                                </div>
                                <div className="cart__content-summary__details-subtotal">
                                    <p>Delivery:</p>
                                    <p>$0.00</p>
                                </div>
                            </div>
                            <div className="cart__content-summary__total">
                                <p>Total:</p>
                                <p>${total.toFixed(2)}</p>
                            </div>
                            <button onClick={handleCheckout} disabled={cartItems.length < 1 ? true : false} className="cart__content-summary__checkout">
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart