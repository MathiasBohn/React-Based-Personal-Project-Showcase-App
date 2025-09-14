import { Link } from "react-router-dom";

export default function ProductCard({ product }){
  return (
    <article className="card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p><strong>Origin:</strong> {product.origin}</p>
      <p><strong>Price:</strong> ${Number(product.price).toFixed(2)}</p>
      <Link to={`/products/${product.id}`}>View</Link>
    </article>
  );
}