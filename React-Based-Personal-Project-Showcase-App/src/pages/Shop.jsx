import { useMemo, useState } from "react";
import { useProducts } from "../hooks/useProducts.js";
import ProductCard from "../components/ProductCard.jsx";
import SearchBox from "../components/SearchBox.jsx";

export default function Shop() {
  const { products, isLoadingProducts, loadErrorMessage, searchText, setSearchText } = useProducts();
  const [selectedOrigins, setSelectedOrigins] = useState([]); 

  const originOptions = useMemo(
    () => [...new Set(products.map((product) => product.origin).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return products.filter((product) => {
      const combinedText = `${product.name} ${product.description} ${product.origin}`.toLowerCase();
      const matchesSearch = !query || combinedText.includes(query);
      const matchesOrigin = selectedOrigins.length === 0 || selectedOrigins.includes(product.origin);
      return matchesSearch && matchesOrigin;
    });
  }, [products, searchText, selectedOrigins]);

  function toggleOrigin(originName) {
    setSelectedOrigins((current) =>
      current.includes(originName)
        ? current.filter((name) => name !== originName)
        : [...current, originName]
    );
  }

  function clearAllFilters() {
    setSearchText("");
    setSelectedOrigins([]);
  }

  const nothingToClear = selectedOrigins.length === 0 && searchText.trim() === "";

  if (isLoadingProducts) {
    return <p className="section" style={{ color: "#fff" }}>Loading products...</p>;
  }
  if (loadErrorMessage) {
    return <p className="section" style={{ color: "#fff" }}>Error: {loadErrorMessage}</p>;
  }

  return (
    <section className="shop">
      <aside className="sidebar">
        <label className="title">Search</label>
        <SearchBox
          value={searchText}
          onChange={setSearchText}
          autoFocus
          placeholder="Search coffee..."
        />

        <strong style={{ display: "block", margin: "8px 0" }}>Origin</strong>
        {originOptions.map((originName) => (
          <label key={originName} style={{ display: "flex", gap: 8, margin: "4px 0" }}>
            <input
              type="checkbox"
              checked={selectedOrigins.includes(originName)}
              onChange={() => toggleOrigin(originName)}
            />
            <span>{originName}</span>
          </label>
        ))}

        <button
          className="btn"
          onClick={clearAllFilters}
          disabled={nothingToClear}
          style={{ marginTop: 10 }}
        >
          Clear all
        </button>
      </aside>

      <div className="section">
        <h2 style={{ color: "#fff", marginTop: 0 }}>Shop</h2>
        {filteredProducts.length ? (
          <div className="grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p style={{ color: "#fff" }}>No products match your filters.</p>
        )}
      </div>
    </section>
  );
}