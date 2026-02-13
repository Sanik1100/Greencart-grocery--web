
// Importing React and necessary modules/hooks/assets
import React from "react";
import { assets } from "../assets/assets"; // Importing icons/images used in product cards
import { useAppContext } from "../context/AppContext"; // Importing custom context hook for global state

// Functional component for displaying a single product card
const ProductCard = ({product}) => { // Receiving product as a prop from parent
    const [count, setCount] = React.useState(0); // Local state (not used here but initialized)

    // Destructuring context values from the global AppContext
    const {currency, addToCart, removeFromCart, cartItems, navigate} = useAppContext();

    // If product exists, render the card
    return product && (
        // Main container for the card
        <div onClick={()=> 
        {navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}}
         className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
            
            {/* Product Image Section */}
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img 
                    className="group-hover:scale-105 transition max-w-26 md:max-w-36" 
                    src={product.image[0]} 
                    alt={product.name} 
                />
            </div>

            {/* Product Details Section */}
            <div className="text-gray-500/60 text-sm">
                {/* Product Category */}
                <p>{product.category}</p>

                {/* Product Name */}
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>

                {/* Star Rating (Static 4 stars filled, 1 dull star) */}
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                        <img
                            key={i}
                            className="md:w-3.5 w-3"
                            src={i < 4 ? assets.star_icon : assets.star_dull_icon} 
                            alt=""
                        />
                    ))}
                    <p>(4)</p> {/* Static review count */}
                </div>

                {/* Price & Add-to-Cart Section */}
                <div className="flex items-end justify-between mt-3">
                    {/* Price with Offer and Original Price */}
                    <p className="md:text-xl text-base font-medium text-orange-500">
                        {currency}{product.offerPrice}{""} 
                        <span className="text-green-400 md:text-sm text-xs line-through">
                            {currency}{product.price}
                        </span>
                    </p>

                    {/* Cart Actions */}
                    <div onClick={(e)=>{e.stopPropagation(); }} className="text-indigo-500">
                        {!cartItems[product._id] ? (
                            // If product not in cart, show 'Add' button
                            <button 
                                className="flex items-center justify-center gap-1 bg-orange-100 border border-orange-300 md:w-[80px] w-[64px] h-[34px] rounded text-orange-600 font-medium cursor-pointer" 
                                onClick={() => addToCart(product._id)} 
                            >
                                <img src={assets.cart_icon} alt="cart_icon" />
                                Add
                            </button>
                        ) : (
                            // If already in cart, show quantity control (+/-)
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-orange-500/25 rounded select-none">
                                <button 
                                    onClick={() => {removeFromCart(product._id)}} 
                                    className="cursor-pointer text-md px-2 h-full"
                                >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button 
                                    onClick={() => {addToCart(product._id)}} 
                                    className="cursor-pointer text-md px-2 h-full"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard; // Exporting the component for use elsewhere
