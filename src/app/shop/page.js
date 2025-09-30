// app/services/page.jsx (or wherever your page file is)
import AllServices from "../../../components/service/allservices/AllServices";

export default async function Page({ searchParams }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

  // Convert searchParams to a plain object, then to query string
  const query =
    searchParams && typeof searchParams === "object"
      ? new URLSearchParams(
          Object.fromEntries(
            Object.entries(searchParams).filter(
              ([key, value]) =>
                typeof value === "string" || typeof value === "number"
            )
          )
        ).toString()
      : "";

  let servicesData = null;

  try {
    const res = await fetch(`${baseUrl}/shops${query ? `?${query}` : ""}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch services");
    servicesData = await res.json();
    console.log("SHOP DATA",servicesData)
  } catch (err) {
    servicesData = { success: false, data: [], error: err.message };
    console.log("SHOP ERROR",servicesData)
  }

  return (
    <div>
      <AllServices services={servicesData} />
    </div>
  );
}

