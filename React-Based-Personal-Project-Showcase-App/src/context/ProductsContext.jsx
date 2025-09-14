import { createContext, useEffect, useState } from "react";

export const ProductsContext = createContext(null);

const BASE_URL = "http://localhost:4000";

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let isComponentMounted = true;

    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        const response = await fetch(`${BASE_URL}/coffee`);
        if (!response.ok) throw new Error("Failed to load products");
        const data = await response.json();
        if (isComponentMounted) setProducts(data);
      } catch (error) {
        if (isComponentMounted) setLoadErrorMessage(error.message || "Error");
      } finally {
        if (isComponentMounted) setIsLoadingProducts(false);
      }
    }

    loadProducts();
    return () => { isComponentMounted = false; };
  }, []);

  async function addProduct(newProduct) {
    const response = await fetch(`${BASE_URL}/coffee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    if (!response.ok) throw new Error("Create failed");
    const savedProduct = await response.json();
    setProducts((previousProducts) => [...previousProducts, savedProduct]);
    return savedProduct;
  }

  async function updateProductPrice(productId, newPrice) {
    const response = await fetch(`${BASE_URL}/coffee/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: newPrice }),
    });
    if (!response.ok) throw new Error("Update failed");
    const savedProduct = await response.json();
    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === productId ? { ...product, ...savedProduct } : product
      )
    );
    return savedProduct;
  }

  async function deleteProduct(productId) {
    const response = await fetch(`${BASE_URL}/coffee/${productId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Delete failed");
    setProducts((previousProducts) => previousProducts.filter((product) => product.id !== productId));
    return true;
  }

  const contextValue = {
    products,
    isLoadingProducts,
    loadErrorMessage,
    searchText,
    setSearchText,
    addProduct,
    updateProductPrice,
    deleteProduct,
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}