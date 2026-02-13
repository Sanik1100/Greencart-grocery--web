// =============================================================================
// IMPORTS SECTION - Bringing in all the necessary dependencies
// =============================================================================

import React, { useEffect, useState } from 'react' // React core and hooks for state and side effects
import { useAppContext } from '../context/AppContext' // Custom hook to access global app state
import ProductCard from '../components/ProductCard'; // Component to display individual product cards

// =============================================================================
// MAIN COMPONENT - AllProducts page component
// =============================================================================

const AllProducts = () => {

    // =============================================================================
    // CONTEXT DATA EXTRACTION - Getting shared state from AppContext
    // =============================================================================
    
    // Destructuring products array and searchQuery from global context
    // products: array of all available products
    // searchQuery: current search term entered by user
    const {products, searchQuery} = useAppContext();

    // =============================================================================
    // LOCAL STATE MANAGEMENT - Component-specific state for filtered results
    // =============================================================================
    
    // State to store products after applying search filter
    // Initially empty array, will be populated based on search query
    const [filteredProducts, setFilteredProducts] = useState([])

    // =============================================================================
    // SEARCH FILTERING LOGIC - Effect hook to filter products based on search query
    // =============================================================================
    
    // useEffect runs whenever products or searchQuery changes
    useEffect(() => {
        // Check if user has entered a search query
        if (searchQuery.length > 0) {
            // Filter products where product name contains the search query (case-insensitive)
            setFilteredProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        } else {
            // If no search query, show all products
            setFilteredProducts(products)
        }
    }, [products, searchQuery]) // Dependencies: re-run when products or searchQuery changes

    // =============================================================================
    // COMPONENT RENDER - JSX structure for the AllProducts page
    // =============================================================================
    
    return (
        <div className='mt-16 flex flex-col'> {/* Main container with top margin and flex layout */}
            
            {/* =============================================================================
                PAGE HEADER SECTION - Title and decorative underline
                ============================================================================= */}
            
            <div className='flex flex-col items-end w-max'> {/* Header container aligned to the right */}
                <p className='text-xl font-medium uppercase'>All Products</p> {/* Page title */}
                <div className='w-16 h-0.5 bg-orange-400 rounded-full'></div> {/* Decorative orange underline */}
            </div>

            {/* =============================================================================
                PRODUCTS GRID SECTION - Display filtered products in responsive grid
                ============================================================================= */}
            
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-8 lg:grid-cols-4 mt-8'>
                {/* Responsive grid layout:
                    - 2 columns on mobile
                    - 3 columns on small screens
                    - 4 columns on medium and large screens
                    - Variable gap spacing based on screen size */}
                
                {/* Filter and map through products to display only in-stock items */}
                {filteredProducts.filter((product) =>
                    product.inStock // Only show products that are in stock
                ).map((product, index) => (
                    // Render ProductCard component for each in-stock product
                    <ProductCard key={index} product={product}/> 
                    // key={index}: React key for efficient re-rendering
                    // product={product}: Pass entire product object as prop to ProductCard
                ))}
            </div>
        </div>
    )
}

// =============================================================================
// COMPONENT EXPORT - Making component available for import in other files
// =============================================================================

export default AllProducts;