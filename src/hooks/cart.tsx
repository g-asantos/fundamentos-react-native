import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const getProducts = await AsyncStorage.getItem('products');

      if (getProducts) {
        setProducts(JSON.parse(getProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const existingProduct = products.find(
        foundProduct => foundProduct.id === product.id,
      );

      if (existingProduct) {
        setProducts(
          products.map(p =>
            p.id === existingProduct.id
              ? {
                  ...existingProduct,
                  quantity: existingProduct.quantity + 1 || 1,
                }
              : p,
          ),
        );

        await AsyncStorage.setItem('products', JSON.stringify(products));
      }
    },

    [products],
  );

  const increment = useCallback(
    async id => {
      const existingProduct = products.find(
        foundProduct => foundProduct.id === id,
      );

      if (existingProduct) {
        const incrementedProducts = products.map(p =>
          p.id === existingProduct.id
            ? {
                ...existingProduct,
                quantity: existingProduct.quantity + 1 || 1,
              }
            : p,
        );

        setProducts(incrementedProducts);
        await AsyncStorage.setItem(
          'products',
          JSON.stringify(incrementedProducts),
        );
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const existingProduct = products.find(
        foundProduct => foundProduct.id === id,
      );

      if (existingProduct && existingProduct.quantity) {
        const decreasedProducts = products.map(p =>
          p.id === existingProduct.id
            ? {
                ...existingProduct,
                quantity: existingProduct.quantity - 1,
              }
            : p,
        );

        setProducts(decreasedProducts);
        await AsyncStorage.setItem(
          'products',
          JSON.stringify(decreasedProducts),
        );
      }

      if (existingProduct && !existingProduct.quantity) {
        const decreasedProducts = products.map(p =>
          p.id === existingProduct.id
            ? {
                ...existingProduct,
                quantity: 0,
              }
            : p,
        );

        setProducts(decreasedProducts);
        await AsyncStorage.setItem(
          '@products',
          JSON.stringify(decreasedProducts),
        );
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
