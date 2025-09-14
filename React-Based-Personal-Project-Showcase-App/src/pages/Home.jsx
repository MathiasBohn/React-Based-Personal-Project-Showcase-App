import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:4000";

export default function Home(){
  const [storeInfo, setStoreInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);

  useEffect(() => {
    let isComponentMounted = true;

    async function loadStoreInfo() {
      try {
        const response = await fetch(`${BASE_URL}/store_info`);
        if (!response.ok) throw new Error("Failed to load store info");
        const data = await response.json();
        if (isComponentMounted) setStoreInfo(data?.[0] ?? null);
      } finally {
        if (isComponentMounted) setIsLoadingInfo(false);
      }
    }

    loadStoreInfo();
    return () => { isComponentMounted = false; };
  }, []);

  return (
    <section className="hero section">
      <div>
        <h1>{isLoadingInfo ? "Loading..." : (storeInfo?.name || "Coffee R Us")}</h1>
        <p>{storeInfo?.description || "The go to store for your coffee needs"}</p>
        {storeInfo?.phone_number && <p>Phone: {storeInfo.phone_number}</p>}
      </div>
    </section>
  );
}