import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts.js";

export default function ProductDetail(){
  const { id } = useParams();
  const { products } = useProducts();

  const product = useMemo(
    () => products.find((p) => String(p.id) === String(id)),
    [products, id]
  );

  if (!product) {
    return <p className="section" style={{ color: "#fff" }}>Product not found.</p>;
  }

  return (
    <section className="section" style={{ color: "#fff", maxWidth: 720 }}>
      <h2 style={{ marginTop: 0 }}>{product.name}</h2>
      <p>{product.description}</p>
      <p><strong>Origin:</strong> {product.origin}</p>
      <p><strong>Price:</strong> ${Number(product.price).toFixed(2)}</p>
    </section>
  );
}