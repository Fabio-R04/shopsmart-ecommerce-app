import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { filterProducts, getProductColors, getSearchedProducts, getSectionProducts, resetProduct } from "../features/product/productSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toTitleCase } from "../reuseable";
import Rating, { RatingComponentProps } from "react-rating";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import HomeProduct from "../components/HomeProduct";
import { toast } from "react-hot-toast";

export interface ProductFilterData {
    color: string;
    price: number;
    rating: number;
}

function Search() {
    const [color, setColor] = useState<string>("all");
    const [price, setPrice] = useState<number>(0);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [rating, setRating] = useState<number>(5);
    const { query } = useParams();
    const {
        searchedProducts,
        filterResults,
        productColors,
        loadingProductSearch,
        loadingProductColors,
        errorProduct,
        messageProduct
    } = useAppSelector((state) => state.product);

    const ReactRating = Rating as unknown as React.FC<RatingComponentProps>;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getSearchedProducts(query as string));
        dispatch(getProductColors(""));
    }, [query]);

    useEffect(() => {
        if (searchedProducts) {
            const min: number = Math.min(...searchedProducts.map((product) => {
                return product.productPrice;
            }));
            const max: number = Math.max(...searchedProducts.map((product) => {
                return product.productPrice;
            }));

            setMinPrice(min);
            setMaxPrice(max);
            setPrice(max);
        }
    }, [query, searchedProducts]);

    useEffect(() => {
        if (errorProduct) {
            toast.error(messageProduct);
            navigate("/");
        }

        dispatch(resetProduct());
    }, [errorProduct, messageProduct, navigate, dispatch]);

    const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setColor(event.target.value);
        dispatch(filterProducts({
            color: event.target.value,
            price,
            rating,
            type: "search"
        }));
    }

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(Number(event.target.value));
        dispatch(filterProducts({
            color,
            price: Number(event.target.value),
            rating,
            type: "search"
        }));
    }

    const handleRatingChange = (event: number) => {
        setRating(event);
        dispatch(filterProducts({
            color,
            price,
            rating: Number(event),
            type: "search"
        }));
    }

    return (
        <div className="main-container">
            <Navbar />
            {(loadingProductSearch || loadingProductColors) ? (
                <Spinner />
            ) : (
                <div className="section">
                    <div className="section__heading">
                        <h1>
                            Search
                        </h1>
                        <p>
                            Section | Search
                        </p>
                    </div>
                    <div className="section__content">
                        <div className="section__filter">
                            <p className="section__filter-heading">
                                Filter by Specs
                            </p>
                            <div className="section__filter-field">
                                <label htmlFor="color">Color</label>
                                <select onChange={handleColorChange} id="color">
                                    <option value="all">All</option>
                                    {productColors?.map((color, index) => (
                                        <option key={index} value={color}>{toTitleCase(color)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="section__filter-field">
                                <label htmlFor="price">Filter by Price</label>
                                <p>${minPrice} to ${price}</p>
                                <input
                                    onChange={handlePriceChange}
                                    type="range"
                                    min={minPrice}
                                    max={maxPrice}
                                    value={price}
                                    name='price'
                                    className="slider"
                                    id="price" />
                            </div>
                            <div className="section__filter-field">
                                <label htmlFor="rating">Filter by Rating</label>
                                <ReactRating
                                    onChange={handleRatingChange}
                                    initialRating={rating}
                                    readonly={false}
                                    emptySymbol={
                                        <svg style={{ height: "2.5rem", width: "2.5rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#b8b8b8" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                    }
                                    fullSymbol={
                                        <svg style={{ height: "2.5rem", width: "2.5rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#f6a192" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                    }
                                />
                            </div>
                        </div>
                        <div className="section__products home__products-section__products">
                            {filterResults?.map((p) => (
                                <HomeProduct
                                    key={p?._id}
                                    product={p}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Search;