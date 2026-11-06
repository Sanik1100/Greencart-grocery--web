
// =============================================================================
// IMPORTS SECTION - Bringing in all the tools we need
// =============================================================================

// Importing necessary hooks and functions from React and React Router
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import axios from 'axios'; 


// CONTEXT CREATION - Setting up the global state container
axios.defaults.withCredentials= true;
axios.defaults.baseURL= import.meta.env.VITE_BACKEND_URL || '';

// Creating a new context called AppContext
// This allows different components to share global state/data without prop drilling
export const AppContext = createContext();

// =============================================================================
// CONTEXT PROVIDER COMPONENT - The wrapper that provides shared state to all children
// =============================================================================

// Creating a provider component to wrap the app or parts of it that need access to shared context
export const AppContextProvider = ({ children }) => {

    // =============================================================================
    // NAVIGATION SETUP - For programmatic page navigation
    // =============================================================================
    
    // useNavigate hook lets us navigate programmatically (e.g., redirect users after login/logout)
    const navigate = useNavigate();

    // =============================================================================
    // ENVIRONMENT CONFIGURATION - Reading app settings from environment variables
    // =============================================================================
    
    // Reading currency from environment variable
    const currency = import.meta.env.VITE_CURRENCY;

    // =============================================================================
    // USER AUTHENTICATION STATE - Managing logged-in user information
    // =============================================================================
    
    // State to hold the logged-in user's data; initially null (no user logged in)
    const [user, setUser] = useState(null);

    // Boolean state to track if the user is a seller; used to show/hide seller-specific features
    const [isSeller, setIsSeller] = useState(false);

    // =============================================================================
    // UI CONTROL STATE - Managing interface visibility and behavior
    // =============================================================================
    
    // State to control visibility of navbar when the user is logged in
    const [showUserLogin, setShowUserLogin] = useState(false);

    // =============================================================================
    // PRODUCT MANAGEMENT STATE - Handling product data and search functionality
    // =============================================================================
    
    // State to store the list of available products
    const [products, setProducts] = useState([]);

    // State to store search query for filtering products
    const [searchQuery, setSearchQuery] = useState("");

    // =============================================================================
    // SHOPPING CART STATE - Managing cart items and quantities
    // =============================================================================
    
    // State to store items added to the shopping cart; key = item ID, value = quantity
    const [cartItems, setCartItems] = useState({});


    // fetch Seller Status
    const fetchSeller= async () => {
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true)
            }else{
                setIsSeller(false)
            }
        } catch (error) {
            console.error(error.message);
            setIsSeller(false)
            
        }
        
    }
    //fetch User Auth Status, User Data and Cart Items
    const fetchUser= async () => {
        try {
            const {data}= await axios.get('/api/user/is-auth');
            if(data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            }else{
                // Only reset user if server explicitly says unauthorized
                setUser(null);
                setCartItems({});
            }
        }catch (error) {
          console.error('Fetch user error:', error);

           if (error.response?.status === 401) {
            setUser(null);
            setCartItems({});
        }
            
        }
        
    };


    
    
    // Function to simulate fetching products (here, using dummy data for now)
    const fetchProducts = async () => {
try {
    const {data}= await axios.get('/api/product/list')
    if(data.success){
        setProducts(data.products)
    }else{
        toast.error(data.message)
    }
} catch (error) {
    toast.error(error.message)
    
}
    };

    // =============================================================================
    // CART MANAGEMENT FUNCTIONS - Adding, updating, and removing cart items
    // =============================================================================
    
    // Function to add an item to the cart (or increase its quantity if it already exists)
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems); // Deep clone current cart data to avoid mutation

        // If item already exists, increment quantity; otherwise, add it with quantity 1
        if (cartData[itemId]) {
            cartData[itemId] += 1; // Increment existing item quantity
        } else {
            cartData[itemId] = 1; // Add new item with quantity 1
        }

        setCartItems(cartData); // Update cart state with new data
        toast.success("Added to cart"); // Show success toast notification to user
    };

    // Function to update the quantity of a specific item in the cart
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems); // Clone current cart to avoid direct mutation

        cartData[itemId] = quantity; // Set the new quantity for the specified item
        setCartItems(cartData); // Update state with modified cart
        toast.success("Cart Updated"); // Notify user of successful update
    };

    // Function to remove an item (or reduce quantity) from the cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems); // Clone cart to avoid direct state mutation

        // Check if the item exists in cart before attempting to modify
        if (cartData[itemId]) {
            cartData[itemId] -= 1; // Decrease quantity by 1

            // If quantity becomes 0, remove the item completely from cart
            if (cartData[itemId] === 0) {
                delete cartData[itemId]; // Remove item from cart object
            }
        }

        toast.success("Removed from cart"); // Notify user of successful removal
        setCartItems(cartData); // Update state with modified cart
    };
    // get Cart Item Count
    const getCartCount=()=>{
        let totalCount=0;
        for(const item in cartItems){
            totalCount+=cartItems[item];
        }
        return totalCount;
    }
    //get Cart Total Amount
    const getCartAmount=()=>{
        let totalAmount=0;
        for(const items in cartItems){
            let itemInfo=products.find((product)=>
                product._id === items);
            if(cartItems[items] > 0 && itemInfo){
                totalAmount+= itemInfo.offerPrice * cartItems[items]
            }       
        }
        return Math.floor(totalAmount* 100) /100;
    }




    // =============================================================================
    // SIDE EFFECTS - Running code when component mounts or dependencies change
    // =============================================================================
    
    // useEffect to run once on component mount and fetch products
    useEffect(() => {
        fetchUser();
        fetchSeller();
        fetchProducts(); // Load product list when app starts
    }, []); // Empty dependency array means this runs only once on mount

    // Update Database Cart Items
    useEffect(()=>{
        const updateCart= async () => {
            try {
                const {data}=await axios.post('/api/cart/update',{cartItems})
                if(!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
              console.error('Cart update error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to update cart');
                
            }
        };
            
        // Only update cart if user is logged in and cartItems exist
    if (user) {
        updateCart();
    }
}, [cartItems, user]); // Added user to dependencies

    // =============================================================================
    // CONTEXT VALUE OBJECT - Packaging all shared state and functions
    // =============================================================================
    
    // The value object that holds all state and functions we want to share across the app
    const value = {
        navigate,        // For page navigation throughout the app
        user,            // Logged-in user information and authentication state
        setUser,         // Function to update user info (login/logout)
        isSeller,        // Boolean flag indicating if user has seller privileges
        setIsSeller,     // Function to toggle seller status
        showUserLogin,   // Controls navbar visibility based on login state
        setShowUserLogin,// Function to update navbar visibility
        products,        // Array of all available products in the store
        currency,        // App's currency setting from environment
        addToCart,       // Function to add products to shopping cart
        updateCartItem,  // Function to modify quantity of items in cart
        removeFromCart,  // Function to remove products from cart
        cartItems,       // Current shopping cart state (item IDs and quantities)
        searchQuery,     // Used in product filtering and search functionality
        setSearchQuery,  // Function to update search parameters
        getCartCount,
        getCartAmount,
        axios,
        fetchProducts,
        setCartItems
    };

    // =============================================================================
    // PROVIDER RETURN - Wrapping children with context access
    // =============================================================================
    
    // Returning the Provider with our value object
    // All children components wrapped in this provider can access this context
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// =============================================================================
// CUSTOM HOOK - Simplified context consumption
// =============================================================================

// Creating a custom hook for easier usage of the AppContext in other components
// This helps avoid importing useContext and AppContext manually everywhere
export const useAppContext = () => {
    return useContext(AppContext); // Returns the entire context value object
};
