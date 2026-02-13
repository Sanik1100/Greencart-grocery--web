// Import React hooks and necessary modules
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext"; // Global context (e.g., cart, products, currency)
import { useParams, Link } from "react-router-dom";    // For route params and navigation
import { assets } from "../assets/assets";              // Image assets like star icons
import ProductCard from "../components/ProductCard";    // Reusable component for displaying a product card

const ProductDetails = () => {
    // Access shared values/functions from context
    const { products, navigate, currency, addToCart } = useAppContext();

    // Extract `id` param from the current URL (e.g., /products/123)
    const { id } = useParams();

    // Local state to store:
    const [relatedProducts, setRelatedProducts] = useState([]); // Related products for this item
    const [thumbnail, setThumbnail] = useState(null);           // Currently selected product image

    // Find the product that matches the route ID
    const product = products.find((item) => item._id === id); 
    

    // useEffect ①: When products are loaded, find related products of same category
    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice(); // Clone to avoid mutation
            if(!product) return null;
         productsCopy = productsCopy.filter((item) => product && product.category === item.category)
            setRelatedProducts(productsCopy.slice(0, 5)); // Limit to 5 related items
        }
    }, [products]);

    // useEffect ②: When product is loaded, set its first image as default thumbnail
    useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : null);
    }, [product]);

    // Return JSX only when the product is found (non-null)
    return product && (
        <div className="mt-12">

            {/* ---------- Breadcrumb Navigation ---------- */}
            <p>
                <Link to={'/'}>Home</Link> /
                <Link to={'/products'}> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-indigo-500"> {product.name}</span>
            </p>

            {/* ---------- Main Section: Images & Details ---------- */}
            <div className="flex flex-col md:flex-row gap-16 mt-4">

                {/* ---------- Image Selection Panel ---------- */}
                <div className="flex gap-3">

                    {/* Thumbnail List - Click to select as main image */}
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setThumbnail(image)} // Set selected image
                                className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                            >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    {/* Display selected thumbnail image */}
                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" />
                    </div>
                </div>

                {/* ---------- Product Info and Actions ---------- */}
                <div className="text-sm w-full md:w-1/2">

                    {/* Product Name */}
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    {/* Static Star Ratings (hardcoded 4 stars out of 5) */}
                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img
                                key={i}
                                src={i < 4 ? assets.star_icon : assets.star_dull_icon} // First 4 stars filled, last one empty
                                alt="Rating Star"
                                className="md:w-4 w-3.5"
                            />
                        ))}
                        <p className="text-base ml-2">(4)</p> {/* Static rating number */}
                    </div>

                    {/* Price and Offer Price */}
                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">
                            MRP: {currency}{product.price}
                        </p>
                        <p className="text-2xl font-medium">
                            MRP: {currency}{product.offerPrice}
                        </p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    {/* Product Description */}
                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li> // Each line item in description
                        ))}
                    </ul>

                    {/* Buttons: Add to Cart and Buy Now */}
                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button
                            onClick={() => addToCart(product._id)} // Add to cart only
                            className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => {
                                addToCart(product._id);  // Add to cart
                                navigate("/cart");       // Redirect to cart page
                            }}
                            className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
                        >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>

            {/* ---------- Related Products Section ---------- */}
            <div className="flex flex-col items-center mt-20">

                {/* Title and underline bar */}
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium">Related Products</p>
                    <div className="w-20 h-0.5 bg-orange-400 rounded-full mt-2"></div>
                </div>

                {/* Related products grid (only in-stock items) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                    {relatedProducts.filter((product) => product.inStock).map((product, index) => (
                        <ProductCard key={index} product={product} /> // Reuse ProductCard
                    ))}
                </div>

                {/* "See More" button navigates to /products */}
                <button
                    onClick={() => {
                        navigate('/products');
                        scrollTo(0, 0); // Scroll to top of page
                    }}
                    className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded-2xl text-orange-400 hover:bg-orange-600 transition"
                >
                    See More
                </button>
            </div>
        </div>
    );
};

// Export the component to be used in routes
export default ProductDetails;
