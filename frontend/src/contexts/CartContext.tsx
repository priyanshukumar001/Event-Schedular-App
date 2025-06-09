import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    eventId: string;
    eventName: string;
    packageId: string;
    packageName: string;
    slotId: string;
    date: string;
    startTime: string;
    endTime: string;
    basePrice: number;
    facilities: Array<{
        id: string;
        name: string;
        price: number;
    }>;
    totalPrice: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        // Load cart items from localStorage on initial render
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart items to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (item: CartItem) => {
        setItems(prev => {
            // Check if item already exists in cart
            const existingItemIndex = prev.findIndex(
                cartItem => cartItem.eventId === item.eventId && cartItem.slotId === item.slotId
            );

            if (existingItemIndex >= 0) {
                // Update existing item
                const updatedItems = [...prev];
                updatedItems[existingItemIndex] = item;
                return updatedItems;
            } else {
                // Add new item
                return [...prev, item];
            }
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems(prev => prev.filter(item => item.eventId !== itemId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.totalPrice, 0);
    };

    const value: CartContextType = {
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}; 