import { useContext } from "react";
import { ProductsContext } from "../context/ProductsContext.jsx";

export function useProducts(){
  const productsContext = useContext(ProductsContext);
  if (!productsContext) {
    throw new Error("useProducts must be used inside ProductsProvider");
  }
  return productsContext;
}