// app/blogs/page.jsx
import AllBlogs from "../../../components/blog/allblogs/AllBlogs";

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

  let blogsData = null;

  try {
    const res = await fetch(`${baseUrl}/menuitems${query ? `?${query}` : ""}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch blogs");
    blogsData = await res.json();
    console.log("BLOGS DATA LENGTH", blogsData);
  } catch (err) {
    blogsData = { success: false, data: [], error: err.message };
  }

  return (
    <div>
      <AllBlogs blogs={blogsData} />
    </div>
  );
}
