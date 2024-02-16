import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { addToCart, filterReviews, getProductDetails, getSimilarProducts } from "../features/product/productSlice";
import { createReview, dislikeReview, likeReview, resetReview } from "../features/review/reviewSlice";
import { toTitleCase } from "../reuseable";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import HomeProduct from "../components/HomeProduct";
import Rating, { RatingComponentProps } from "react-rating";
import toast from "react-hot-toast";
import ProgressBar from "@ramonak/react-progress-bar";
import moment from "moment";

export interface ReviewFilterData {
    ratingFilter: string;
}

export interface ReviewData {
    productId: string;
    rating: number;
    description: string;
}

interface StatsData {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
}

function Product() {
    const [ratingFilter, setRatingFilter] = useState<string>("all");
    const [stats, setStats] = useState<StatsData>({
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0
    });
    const [refresh, setRefresh] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const { productId } = useParams();
    const {
        product,
        similarProducts,
        reviewsFilterResults,
        loadingProductDetails,
        loadingProductSimilar
    } = useAppSelector((state) => state.product);
    const {
        loadingReviewCreation,
        successReview,
        errorReview,
        messageReview
    } = useAppSelector((state) => state.review);
    const { user } = useAppSelector((state) => state.auth);

    const ReactRating = Rating as unknown as React.FC<RatingComponentProps>;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getSimilarProducts(productId as string));
    }, [productId]);

    useEffect(() => {
        if (product) {
            let fiveStar: number = 0;
            let fourStar: number = 0;
            let threeStar: number = 0;
            let twoStar: number = 0;
            let oneStar: number = 0;

            for (const review of product.reviews) {
                switch (review.rating) {
                    case 5:
                        fiveStar += 1;
                        break;
                    case 4:
                        fourStar += 1;
                        break;
                    case 3:
                        threeStar += 1;
                        break;
                    case 2:
                        twoStar += 1;
                        break;
                    case 1:
                        oneStar += 1;
                        break;
                    default:
                        break;
                }
            }

            setStats({
                fiveStar,
                fourStar,
                threeStar,
                twoStar,
                oneStar
            });
        }
    }, [product]);

    useEffect(() => {
        dispatch(getProductDetails(productId as string));
    }, [productId, refresh]);

    useEffect(() => {
        if (successReview) {
            toast.success(messageReview);
            if (messageReview === "Review Added") {
                setRefresh((prevValue) => !prevValue);
            }
        }

        if (errorReview) {
            toast.error(messageReview);
        }

        dispatch(resetReview());
    }, [successReview, errorReview, messageReview, dispatch]);

    const handleQuantityIncrement = (): void => {
        if (quantity < product?.productStock!) {
            setQuantity((prevValue) => prevValue + 1);
        }
    }

    const handleQuantityDecrement = (): void => {
        if (quantity > 1) {
            setQuantity((prevValue) => prevValue - 1);
        }
    }

    const handleRatingChange = (event: number): void => {
        setRating(event);
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setDescription(event.target.value);
    }

    const handleReviewSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (rating !== 0) {
            dispatch(createReview({
                productId: (productId as string),
                description,
                rating
            }));
            setDescription("");
            setRating(0);
        } else {
            toast.error("Please provide a rating.");
        }
    }

    const handleRatingFilterChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setRatingFilter(event.target.value);
        dispatch(filterReviews({
            ratingFilter: event.target.value
        }));
    }

    return (
        <div className="main-container">
            <Navbar />
            <div className="product">
                {(loadingProductDetails || loadingProductSimilar) ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="product__content">
                            <div className="product__content-image">
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}/product/image/${productId}`}
                                    alt="Product Image"
                                />
                            </div>
                            <div className="product__content-details">
                                <div className="product__content-details__heading">
                                    <h1 className="product__content-details__heading-name">
                                        {product?.productName}
                                    </h1>
                                    <p className="product__content-details__heading-description">
                                        {product?.productDescription}
                                    </p>
                                    <div onClick={() => document.querySelector("#reviews-section")?.scrollIntoView()} className="product__content-details__heading-rating">
                                        <div className="product__content-details__heading-rating__ratings">
                                            {[...Array(5)].map((_, i) => {
                                                if ((i + 1) <= product?.rating!) {
                                                    return (
                                                        <svg key={i} className="product__content-details__heading-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#f6a192" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                    )
                                                } else {
                                                    return (
                                                        <svg key={i} className="product__content-details__heading-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#b8b8b8" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                    )
                                                }
                                            })}
                                        </div>
                                        <p className="product__content-details__heading-rating__reviews">
                                            {`(${product?.reviews?.length})`}
                                        </p>
                                    </div>
                                </div>
                                <div className="product__content-details__financing">
                                    <h1>${product?.productPrice?.toFixed(2)} or {Math.floor(product?.productPrice! / 6).toFixed(2)}/month</h1>
                                    <p>Suggested payments with 6 months special financing</p>
                                </div>
                                <div className="product__content-details__color">
                                    <h1>Product Color</h1>
                                    <div className="product__content-details__color-div">
                                        <div>
                                            <div style={{ backgroundColor: product?.productColor }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="product__content-details__quantity">
                                    <div className="product__content-details__quantity-change">
                                        <svg onClick={handleQuantityDecrement} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                        <p>{quantity}</p>
                                        <svg onClick={handleQuantityIncrement} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M12 6V18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                    </div>
                                    {product?.productStock! <= 15 && (
                                        <p className="product__content-details__quantity-stock">
                                            Only <span>{product?.productStock} Items</span> Left!<br />
                                            Don't miss it
                                        </p>
                                    )}
                                </div>
                                <div className="product__content-details__checkout">
                                    <button onClick={() => {
                                        dispatch(addToCart({
                                            _id: product?._id!,
                                            productName: product?.productName!,
                                            productDescription: product?.productDescription!,
                                            productPrice: product?.productPrice!,
                                            productStock: product?.productStock!,
                                            quantity
                                        }));
                                        navigate("/cart");
                                    }} className="product__content-details__checkout-buy">
                                        Buy Now
                                    </button>
                                    <button onClick={() => {
                                        dispatch(addToCart({
                                            _id: product?._id!,
                                            productName: product?.productName!,
                                            productDescription: product?.productDescription!,
                                            productPrice: product?.productPrice!,
                                            productStock: product?.productStock!,
                                            quantity
                                        }));
                                    }} className="product__content-details__checkout-cart">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="product__similar">
                            <div className="home__products-section">
                                <h1 className="home__products-section__heading">
                                    Similar Products
                                </h1>
                                <div className="home__products-section__products">
                                    {similarProducts?.map((p) => (
                                        <HomeProduct
                                            key={p?._id}
                                            product={p}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="product__add-review">
                            <h1 className="product__add-review__heading">
                                Add Review
                            </h1>
                            <div className="product__add-review__content">
                                <form onSubmit={handleReviewSubmit} className="product__add-review__form">
                                    {loadingReviewCreation ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            <div className="product__add-review__form-field">
                                                <label htmlFor="rating">Rating</label>
                                                <ReactRating
                                                    onChange={handleRatingChange}
                                                    initialRating={rating}
                                                    readonly={false}
                                                    emptySymbol={
                                                        <svg style={{ height: "3.7rem", width: "3.7rem", marginRight: "5px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#b8b8b8" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                    }
                                                    fullSymbol={
                                                        <svg style={{ height: "3.7rem", width: "3.7rem", marginRight: "5px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#f6a192" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                    }
                                                />
                                            </div>
                                            <div className="product__add-review__form-field">
                                                <label htmlFor="name">Full Name</label>
                                                <input
                                                    disabled
                                                    value={user ? user.fullName : "Enter name"}
                                                    type="text"
                                                    placeholder="Enter review description"
                                                    id="name"
                                                />
                                            </div>
                                            <div className="product__add-review__form-field">
                                                <label htmlFor="description">Description</label>
                                                <input
                                                    onChange={handleDescriptionChange}
                                                    value={description}
                                                    type="text"
                                                    placeholder="Enter review description"
                                                    id="description"
                                                    required
                                                />
                                            </div>
                                            <button type="submit" className="product__add-review__form-btn">
                                                Add Review
                                            </button>
                                        </>
                                    )}
                                </form>
                                <div className="product__add-review__stats">
                                    <div className="product__add-review__stats-heading">
                                        <p className="product__add-review__stats-heading__rating">
                                            <span>{Math.round(product?.rating! * 10) / 10} out of 5</span>
                                        </p>
                                        <ReactRating
                                            initialRating={Math.floor(product?.rating!)}
                                            readonly={true}
                                            emptySymbol={
                                                <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="rgb(210, 210, 210)" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                            }
                                            fullSymbol={
                                                <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#000" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                            }
                                        />
                                    </div>
                                    <div className="product__add-review__stats-content">
                                        <div className="product__add-review__stats-content__field">
                                            <ReactRating
                                                initialRating={5}
                                                readonly={true}
                                                emptySymbol={
                                                    <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="rgb(210, 210, 210)" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                }
                                                fullSymbol={
                                                    <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#000" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                }
                                            />
                                            <ProgressBar
                                                completed={stats.fiveStar}
                                                maxCompleted={product?.reviews?.length}
                                                customLabel=" "
                                            />
                                            <p>{stats.fiveStar}</p>
                                        </div>
                                        <div className="product__add-review__stats-content__field">
                                            <ReactRating
                                                initialRating={4}
                                                readonly={true}
                                                emptySymbol={
                                                    <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="rgb(210, 210, 210)" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                }
                                                fullSymbol={
                                                    <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#000" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                }
                                            />
                                            <ProgressBar
                                                completed={stats.fourStar}
                                                maxCompleted={product?.reviews?.length}
                                                customLabel=" "
                                            />
                                            <p>{stats.fourStar}</p>
                                        </div>
                                        <div className="product__add-review__stats-content__field">
                                            <ReactRating
                                                initialRating={3}
                                                readonly={true}
                                                emptySymbol={
                                                    <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="rgb(210, 210, 210)" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                }
                                                fullSymbol={
                                                    <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#000" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                }
                                            />
                                            <ProgressBar
                                                completed={stats.threeStar}
                                                maxCompleted={product?.reviews?.length}
                                                customLabel=" "
                                            />
                                            <p>{stats.threeStar}</p>
                                        </div>
                                        <div className="product__add-review__stats-content__field">
                                            <ReactRating
                                                initialRating={2}
                                                readonly={true}
                                                emptySymbol={
                                                    <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="rgb(210, 210, 210)" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                }
                                                fullSymbol={
                                                    <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#000" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                }
                                            />
                                            <ProgressBar
                                                completed={stats.twoStar}
                                                maxCompleted={product?.reviews?.length}
                                                customLabel=" "
                                            />
                                            <p>{stats.twoStar}</p>
                                        </div>
                                        <div className="product__add-review__stats-content__field">
                                            <ReactRating
                                                initialRating={1}
                                                readonly={true}
                                                emptySymbol={
                                                    <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="rgb(210, 210, 210)" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                }
                                                fullSymbol={
                                                    <svg style={{ height: "3rem", width: "3rem", marginRight: "3px" }} className="home-product__details-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#000" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                }
                                            />
                                            <ProgressBar
                                                completed={stats.oneStar}
                                                maxCompleted={product?.reviews?.length}
                                                customLabel=" "
                                            />
                                            <p>{stats.oneStar}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="product__reviews" id="reviews-section">
                            <h1 className="product__reviews-heading">
                                Reviews
                            </h1>
                            <div className="product__reviews-container">
                                <div className="section__filter" style={{paddingBottom: "2.5rem"}}>
                                    <p className="section__filter-heading">
                                        Filter Reviews
                                    </p>
                                    <div className="section__filter-field">
                                        <label htmlFor="rating-filter">Filter by Rating</label>
                                        <select value={ratingFilter} onChange={handleRatingFilterChange} id="likes">
                                            <option value="all">All</option>
                                            <option value="5">5 Star</option>
                                            <option value="4">4 Star</option>
                                            <option value="3">3 Star</option>
                                            <option value="2">2 Star</option>
                                            <option value="1">1 Star</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="product__reviews-content">
                                    {reviewsFilterResults.map((r) => (
                                        <div key={r._id} className="product__reviews-content__review">
                                            <div className="product__reviews-content__review-heading">
                                                <div>
                                                    <p>by {toTitleCase(r.user?.fullName?.split(" ")[0])}</p>
                                                    <p>Written: {moment(r.createdAt).format("MM/DD/YYYY")}</p>
                                                </div>
                                                <div>
                                                    <svg onClick={() => dispatch(likeReview(r._id))} fill={r.likes?.includes(user?._id!) ? "#f6a192" : "#000000"} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)matrix(-1, 0, 0, 1, 0, 0)" stroke="#000000" strokeWidth="0.00016"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.032"></g><g id="SVGRepo_iconCarrier"> <g id="Layer_2" data-name="Layer 2"> <g id="Layer_1-2" data-name="Layer 1"> <path d="M16,7a2,2,0,0,0-1.34-1.89A1.94,1.94,0,0,0,15,4a2,2,0,0,0-1.16-1.82A1.51,1.51,0,0,0,14,1.5,1.5,1.5,0,0,0,12.5,0h-7A3.47,3.47,0,0,0,2.89,1.2.49.49,0,0,0,2.5,1H.5a.5.5,0,0,0-.5.5v8a.5.5,0,0,0,.5.5h2A.51.51,0,0,0,3,9.67l1.2,1.2A4.59,4.59,0,0,1,5.35,13L6,15.62A.49.49,0,0,0,6.5,16h.44a2.5,2.5,0,0,0,2-1,2.47,2.47,0,0,0,.45-2.15L9.14,12H14a2,2,0,0,0,2-2,2,2,0,0,0-.68-1.5A2,2,0,0,0,16,7ZM2,9H1V2H2V9ZM12.5,9H14a1,1,0,0,1,0,2H7.5a.5.5,0,0,0,0,1h.61l.28,1.14a1.44,1.44,0,0,1-.27,1.28A1.49,1.49,0,0,1,6.94,15H6.89l-.57-2.28a5.44,5.44,0,0,0-1.45-2.55L3,8.29V3.5A2.5,2.5,0,0,1,5.5,1h7a.5.5,0,0,1,0,1h-1a.5.5,0,0,0,0,1H13a1,1,0,0,1,0,2h-.5a.5.5,0,0,0,0,1H14a1,1,0,0,1,0,2H12.5a.5.5,0,0,0,0,1Z"></path> </g> </g> </g></svg>
                                                    <svg onClick={() => dispatch(dislikeReview(r._id))} fill={r.dislikes?.includes(user?._id!) ? "#f6a192" : "#000000"} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)" stroke="#000000" strokeWidth="0.00016"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.032"></g><g id="SVGRepo_iconCarrier"> <g id="Layer_2" data-name="Layer 2"> <g id="Layer_1-2" data-name="Layer 1"> <path d="M16,7a2,2,0,0,0-1.34-1.89A1.94,1.94,0,0,0,15,4a2,2,0,0,0-1.16-1.82A1.51,1.51,0,0,0,14,1.5,1.5,1.5,0,0,0,12.5,0h-7A3.47,3.47,0,0,0,2.89,1.2.49.49,0,0,0,2.5,1H.5a.5.5,0,0,0-.5.5v8a.5.5,0,0,0,.5.5h2A.51.51,0,0,0,3,9.67l1.2,1.2A4.59,4.59,0,0,1,5.35,13L6,15.62A.49.49,0,0,0,6.5,16h.44a2.5,2.5,0,0,0,2-1,2.47,2.47,0,0,0,.45-2.15L9.14,12H14a2,2,0,0,0,2-2,2,2,0,0,0-.68-1.5A2,2,0,0,0,16,7ZM2,9H1V2H2V9ZM12.5,9H14a1,1,0,0,1,0,2H7.5a.5.5,0,0,0,0,1h.61l.28,1.14a1.44,1.44,0,0,1-.27,1.28A1.49,1.49,0,0,1,6.94,15H6.89l-.57-2.28a5.44,5.44,0,0,0-1.45-2.55L3,8.29V3.5A2.5,2.5,0,0,1,5.5,1h7a.5.5,0,0,1,0,1h-1a.5.5,0,0,0,0,1H13a1,1,0,0,1,0,2h-.5a.5.5,0,0,0,0,1H14a1,1,0,0,1,0,2H12.5a.5.5,0,0,0,0,1Z"></path> </g> </g> </g></svg>
                                                </div>
                                            </div>
                                            <div className="product__reviews-content__review-content">
                                                {[...Array(5)].map((_, i) => {
                                                    if ((i + 1) <= r.rating) {
                                                        return (
                                                            <svg key={i} className="product__content-details__heading-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#f6a192" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                        )
                                                    } else {
                                                        return (
                                                            <svg key={i} className="product__content-details__heading-rating__ratings-svg" version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#b8b8b8" d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25 c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657 C63.951,25.771,64.131,24.987,63.893,24.277z"></path> </g></svg>
                                                        )
                                                    }
                                                })}
                                                <p>{r.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Product