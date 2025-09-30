"use client"
import ShotCard from "../useable/ShotCard";
import { useState } from "react";

export default function ShotsDesign({ shots }) {
  // Debug the shots data structure
  console.log("ShotsDesign received shots:", shots);
  console.log("Type of shots:", typeof shots);
  console.log("Is shots an array?", Array.isArray(shots));

  // Handle different data structures
  let shotsArray = [];
  
  if (Array.isArray(shots)) {
    shotsArray = shots;
  } else if (shots?.data && Array.isArray(shots.data)) {
    shotsArray = shots.data;
  } else if (shots && typeof shots === 'object') {
    // If shots is a single object, wrap it in an array
    shotsArray = [shots];
  }

  return (
    <section className="max-w-[1800px] w-full mx-auto px-2 md:px-8 py-12 font-sans">
      <div className="flex items-baseline justify-between mb-8">
        {/* Headers commented out */}
      </div>

      {/* Debug output */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-gray-100 rounded text-xs">
          <p>Debug Info:</p>
          <p>Original shots type: {typeof shots}</p>
          <p>Is shots array: {Array.isArray(shots).toString()}</p>
          <p>Processed array length: {shotsArray.length}</p>
          <p>First item keys: {shotsArray[0] ? Object.keys(shotsArray[0]).join(', ') : 'No items'}</p>
        </div>
      )} */}

      <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shotsArray.length > 0 ? (
          shotsArray.map((shot, index) => {
            console.log(`Processing shot ${index}:`, shot);
            
            // Ensure shot has required properties
            if (!shot || !shot._id) {
              console.warn(`Shot at index ${index} is missing required properties:`, shot);
              return null;
            }

            return (
              <FigmaShotCard
                type="shots"
                key={shot._id || index}
                shot={{
                  id: shot._id,
                  image: shot.images?.[0] || 'https://via.placeholder.com/400x320?text=No+Image',
                  title: shot.description?.substring(0, 50) || shot.name || "No description",
                  user: {
                    name: shot.name || "Unknown",
                    avatar: shot.avatar || "https://cdn.dribbble.com/users/6567474/avatars/small/b849c692c6c9fc9cfdca178b90e354d2.png?1607746416",
                    badge: shot.badge || "",
                  },
                  likes: shot.likes || 0,
                  views: shot.views || 0,
                  pro: shot.pro || false,
                  team: shot.team || false,
                  href: `/nightmarket/view/${shot.slug || shot._id}`,
                }}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No items to display</p>
            <p className="text-gray-400 text-sm mt-2">
              {shots ? 'Data structure might be different than expected' : 'No data received'}
            </p>
          </div>
        )}
      </ol>

      {shots?.hasMore && (
        <div className="flex justify-center mt-12">
          <button className="px-8 py-3 bg-white border border-gray-200 text-gray-900 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow">
            Load more
          </button>
        </div>
      )}
    </section>
  );
}

// Keep the same FigmaShotCard component with error handling
const FigmaShotCard = ({ shot, type }) => {
  console.log("FigmaShotCard received shot:", shot);
  
  const [likes, setLikes] = useState(shot?.likes || 0);

  // Validate shot object
  if (!shot || !shot.id) {
    console.error('FigmaShotCard: Invalid shot object:', shot);
    return (
      <div className="w-full h-80 rounded-[20px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Invalid item data</p>
      </div>
    );
  }

  const handleLike = async () => {
    let endpoint;
    switch (type) {
      case "services":
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/services/${shot.id}/like`;
        break;
      case "shots":
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/shots/${shot.id}/like`;
        break;
      case "nightmarket":
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/nightmarkets/${shot.id}/like`;
        break;
      case "blog":
        endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${shot.id}/like`;
        break;
      default:
        console.error("Invalid shot type:", type);
        alert("Error: Invalid shot type");
        return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to like the item");
      }

      const data = await response.json();
      setLikes(data.likes || likes + 1);
    } catch (error) {
      console.error("Error liking item:", error);
      // Optimistically update the likes count
      setLikes(prev => prev + 1);
    }
  };

  return (
    <div className="w-full inline-flex flex-col justify-start items-start gap-2">
      {/* Image Container */}
      <div className="self-stretch h-80 relative rounded-[20px] overflow-hidden group cursor-pointer">
        <a href={shot.href} className="absolute inset-0 z-10">
          <img 
            className="w-full h-80 left-0 top-0 absolute object-cover transition-transform duration-300 group-hover:scale-105" 
            src={shot.image}
            alt={shot.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x320?text=Image+Not+Found';
            }}
          />
          <div className="w-full h-80 left-0 top-0 absolute bg-gradient-to-b from-black/0 via-black/0 to-black/5" />
        </a>
        
        {/* Hover overlay with like button */}
        <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/70 to-transparent z-20 pointer-events-none">
          <div className="w-full flex items-center justify-between px-5 pb-4">
            <span className="text-white text-base md:text-lg font-semibold drop-shadow line-clamp-2">
              {shot.title}
            </span>
            <button
              type="button"
              className="bg-white/90 hover:bg-white text-pink-600 rounded-full p-2 shadow transition flex items-center justify-center pointer-events-auto flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLike();
              }}
            >
              <svg
                viewBox="0 0 16 16"
                width="20"
                height="20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M8 14s-5.5-3.3-5.5-7.2C2.5 4.3 4.2 2.5 6.2 2.5c1.1 0 2.1.6 2.8 1.6C9.7 3.1 10.7 2.5 11.8 2.5c2 0 3.7 1.8 3.7 4.3C13.5 10.7 8 14 8 14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="self-stretch inline-flex justify-between items-center">
        {/* User Info */}
        <div className="flex-1 flex justify-start items-center gap-2 min-w-0">
          <img 
            className="w-6 h-6 relative rounded-xl object-cover flex-shrink-0" 
            src={shot.user?.avatar}
            alt={shot.user?.name || "User"}
            onError={(e) => {
              e.target.src = 'https://cdn.dribbble.com/users/6567474/avatars/small/b849c692c6c9fc9cfdca178b90e354d2.png?1607746416';
            }}
          />
          <div className="text-gray-900 text-sm font-normal font-['Inter'] truncate">
            {shot.user?.name || "Unknown"}
          </div>
        </div>

        {/* Badge */}
        {shot.user?.badge && (
          <div className="h-4 p-[3px] bg-stone-300 rounded-[3px] inline-flex flex-col justify-start items-start mx-2">
            <div className="text-white text-[10px] font-bold font-['Arial'] uppercase leading-[10px]">
              {shot.user.badge}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-end items-start gap-5 flex-shrink-0">
          {/* Likes */}
          <div className="flex justify-start items-center gap-1">
            <div className="w-4 h-4 relative">
              <svg
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="currentColor"
                className="w-4 h-4 text-pink-600"
              >
                <path d="M8 14s-5.5-3.3-5.5-7.2C2.5 4.3 4.2 2.5 6.2 2.5c1.1 0 2.1.6 2.8 1.6C9.7 3.1 10.7 2.5 11.8 2.5c2 0 3.7 1.8 3.7 4.3C13.5 10.7 8 14 8 14z" />
              </svg>
            </div>
            <div className="text-gray-700 text-xs font-normal font-['Inter']">
              {likes}
            </div>
          </div>

          {/* Views */}
          <div className="flex justify-start items-center gap-1">
            <div className="w-4 h-4 relative">
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                className="w-4 h-4"
              >
                <path
                  d="M8 3C4.37 3 1.99 6.22 1.19 7.49c-.1.15-.15.23-.18.35-.02.09-.02.23 0 .32.03.12.08.2.18.35C1.99 9.78 4.37 13 8 13s6.01-3.22 6.81-4.49c.1-.15.15-.23.18-.35.02-.09.02-.23 0-.32-.03-.12-.08-.2-.18-.35C14.01 6.22 11.63 3 8 3Z"
                  fill="currentColor"
                  className="text-zinc-400"
                />
                <path d="M8 10a2 2 0 100-4 2 2 0 000 4Z" fill="white" />
              </svg>
            </div>
            <div className="text-gray-700 text-xs font-normal font-['Inter']">
              {shot.views || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
