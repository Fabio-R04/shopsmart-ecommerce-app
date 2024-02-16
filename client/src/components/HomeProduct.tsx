import React from "react";
import { IProduct } from "../features/product/productInterfaces";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../features/product/productSlice";

interface HomeProductProps {
    product: IProduct;
}

function HomeProduct({ product }: HomeProductProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <div key={product._id} className="home-product">
            <div onClick={() => navigate(`/product/${product._id}`)} className="home-product__image">
                <img
                    src={`${process.env.REACT_APP_SERVER_URL}/product/image/${product._id}`}
                    alt="Product Image"
                />
            </div>
            <div className="home-product__details">
                <div className="home-product__details-heading">
                    <p>{product.productName}</p>
                    <p>${product.productPrice}</p>
                </div>
                <p className="home-product__details-description">
                    {product.productDescription.length > 36 ? (
                        `${product.productDescription.slice(0, 33)}...`
                    ) : (
                        product.productDescription
                    )}
                </p>
                <div className="home-product__details-rating">
                    <div className="home-product__details-rating__ratings">
                        {[...Array(5)].map((_, i) => {
                            if ((i + 1) <= product.rating) {
                                return (
                                    <svg className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#f6a192" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                )
                            } else {
                                return (
                                    <svg className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#b8b8b8" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                )
                            }
                        })}
                    </div>
                    <p className="home-product__details-reviews">
                        {`(${product.reviews?.length})`}
                    </p>
                </div>
                <button onClick={() => {
                    dispatch(addToCart({
                        _id: product._id,
                        productName: product.productName,
                        productDescription: product.productDescription,
                        productPrice: product.productPrice,
                        productStock: product.productStock,
                        quantity: 1
                    }));
                }} className="home-product__details-btn">
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default HomeProduct