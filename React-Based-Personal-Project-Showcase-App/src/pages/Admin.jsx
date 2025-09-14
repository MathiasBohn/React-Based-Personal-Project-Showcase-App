import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts.js";

export default function Admin(){
  // Add Product form
  const inputIdName = useId();
  const inputIdDescription = useId();
  const inputIdOrigin = useId();
  const inputIdPrice = useId();

  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [originValue, setOriginValue] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { products, addProduct, updateProductPrice, deleteProduct } = useProducts();
  const navigate = useNavigate();

  const nameInputRef = useRef(null);
  useEffect(() => { nameInputRef.current?.focus(); }, []);

  function validateForm(){
    const newErrors = {};
    if (!nameValue.trim()) newErrors.name = "Name is required.";
    if (!descriptionValue.trim()) newErrors.description = "Description is required.";
    if (!originValue.trim()) newErrors.origin = "Origin is required.";
    const numericPrice = Number(priceValue);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) newErrors.price = "Enter a positive price.";
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event){
    event.preventDefault();
    if (!validateForm()) return;
    setIsSaving(true);
    try{
      await addProduct({
        name: nameValue.trim(),
        description: descriptionValue.trim(),
        origin: originValue.trim(),
        price: Number(priceValue),
      });
      setNameValue(""); setDescriptionValue(""); setOriginValue(""); setPriceValue("");
      navigate("/products");
    } finally {
      setIsSaving(false);
    }
  }

  // Manage Products list (edit price + delete)
  const productsSortedByName = useMemo(
    () => [...products].sort((a, b) => String(a.name).localeCompare(String(b.name))),
    [products]
  );

  return (
    <>
      {/* Add New Product */}
      <div className="form-wrap">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Add New Product</h2>

          <label htmlFor={inputIdName}>
            Name
            <input
              id={inputIdName}
              ref={nameInputRef}
              value={nameValue}
              onChange={(event) => setNameValue(event.target.value)}
            />
            {formErrors.name && <div className="error">{formErrors.name}</div>}
          </label>

          <label htmlFor={inputIdDescription}>
            Description
            <input
              id={inputIdDescription}
              value={descriptionValue}
              onChange={(event) => setDescriptionValue(event.target.value)}
            />
            {formErrors.description && <div className="error">{formErrors.description}</div>}
          </label>

          <label htmlFor={inputIdOrigin}>
            Origin
            <input
              id={inputIdOrigin}
              value={originValue}
              onChange={(event) => setOriginValue(event.target.value)}
            />
            {formErrors.origin && <div className="error">{formErrors.origin}</div>}
          </label>

          <label htmlFor={inputIdPrice}>
            Price
            <input
              id={inputIdPrice}
              type="number"
              step="0.01"
              value={priceValue}
              onChange={(event) => setPriceValue(event.target.value)}
            />
            {formErrors.price && <div className="error">{formErrors.price}</div>}
          </label>

          <button className="btn" disabled={isSaving}>
            {isSaving ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>

      {/* Manage Products */}
      <section className="section" style={{ color:"#fff", marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Manage Products</h2>
        {!productsSortedByName.length ? (
          <p>No products yet.</p>
        ) : (
          <div style={{ display:"grid", gap: 10 }}>
            {productsSortedByName.map((product) => (
              <ManageRow
                key={product.id}
                product={product}
                onSavePrice={updateProductPrice}
                onDeleteProduct={deleteProduct}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function ManageRow({ product, onSavePrice, onDeleteProduct }){
  const [priceInputValue, setPriceInputValue] = useState(String(product.price));
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rowErrorMessage, setRowErrorMessage] = useState("");

  async function handleSavePrice(){
    const numericPrice = Number(priceInputValue);
    if (Number.isNaN(numericPrice) || numericPrice <= 0){
      setRowErrorMessage("Enter a positive price.");
      return;
    }
    setRowErrorMessage("");
    setIsSavingPrice(true);
    try{
      await onSavePrice(product.id, numericPrice);
    } finally {
      setIsSavingPrice(false);
    }
  }

  async function handleDeleteProduct(){
    setIsDeleting(true);
    try{
      await onDeleteProduct(product.id); // no confirm, per your preference
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      style={{
        display:"grid",
        gridTemplateColumns:"1fr auto auto",
        gap: 8,
        alignItems:"center",
        background:"rgba(0,0,0,0.05)",
        padding: 10,
        borderRadius: 8
      }}
    >
      <div>
        <div style={{ fontWeight: 700 }}>{product.name}</div>
        <div style={{ fontSize: 13, color:"#ddd" }}>
          {product.origin} • ${Number(product.price).toFixed(2)}
        </div>
      </div>

      <div>
        <input
          className="input"
          type="number"
          step="0.01"
          value={priceInputValue}
          onChange={(event) => setPriceInputValue(event.target.value)}
          style={{ maxWidth: 140 }}
        />
        {rowErrorMessage && <div className="error">{rowErrorMessage}</div>}
      </div>

      <div style={{ display:"flex", gap: 8, justifyContent:"flex-end" }}>
        <button className="btn" onClick={handleSavePrice} disabled={isSavingPrice}>
          {isSavingPrice ? "Saving..." : "Save Price"}
        </button>
        <button className="btn" onClick={handleDeleteProduct} disabled={isDeleting} style={{ background:"#8b1e1e" }}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}