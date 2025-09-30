"use client";
import React, { useState } from "react";
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import map components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Fixed SVG Icons with proper styling
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
  </svg>
);

const StallIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const ChefHatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const PriceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

// Menu Item Component with View Button
const MenuItemCard = ({ item, shopName, onOrderClick }) => {
  const formatPrice = (price) => {
    return `Rs. ${price?.toLocaleString() || '0'}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Item Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <ChefHatIcon />
              <p className="text-sm mt-2">No Image</p>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          {item.category || 'Food'}
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
          <div className="text-white">
            <PriceIcon />
          </div>
          {formatPrice(item.price)}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-3">
            <Link 
              href={`/menuitems/view/${item._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold transition-colors shadow-lg transform scale-90 group-hover:scale-100 transition-transform flex items-center gap-2"
            >
              <EyeIcon />
              View Item
            </Link>
            <button
              onClick={() => onOrderClick(item)}
              className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg transform scale-90 group-hover:scale-100 transition-transform flex items-center gap-2"
            >
              <div className="text-green-600">
                <WhatsAppIcon />
              </div>
              Order
            </button>
          </div>
        </div>
      </div>

      {/* Item Details */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {item.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {item.description || "Deliciously prepared with fresh ingredients and authentic flavors."}
          </p>
        </div>

        {/* Rating & Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <StarIcon />
            <span className="text-sm font-medium text-gray-700">4.5</span>
          </div>
          <div className="text-sm text-gray-500">•</div>
          <div className="text-sm text-gray-500">Popular</div>
        </div>

        {/* Price and Actions Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col flex-1">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(item.price)}
            </span>
            <span className="text-xs text-gray-500">per item</span>
          </div>
          
          <div className="flex gap-2">
            <Link 
              href={`/menuitems/view/${item._id}`}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <EyeIcon />
              View
            </Link>
            <button
              onClick={() => onOrderClick(item)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <WhatsAppIcon />
              Order
            </button>
          </div>
        </div>

        {/* Item Info */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Added: {new Date(item.createdAt).toLocaleDateString()}</span>
            <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {item.category || 'Food'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to extract coordinates
const getCoordinates = (location) => {
  if (!location) return null;
  if (location.coordinates && location.coordinates.lat && location.coordinates.lng) {
    return { lat: location.coordinates.lat, lng: location.coordinates.lng };
  }
  return null;
};

// Map Component
const ShopMap = ({ location }) => {
  const coords = getCoordinates(location);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  React.useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        await import('leaflet/dist/leaflet.css');
        const L = await import('leaflet');
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        setLeafletLoaded(true);
      }
    };
    loadLeaflet();
  }, []);

  if (!coords) {
    return (
      <div className="w-full h-64 rounded-xl border border-gray-200 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-500">Location not available</p>
      </div>
    );
  }

  if (!leafletLoaded) {
    return (
      <div className="w-full h-64 rounded-xl border border-gray-200 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
      <MapContainer center={[coords.lat, coords.lng]} zoom={17} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coords.lat, coords.lng]}>
          <Popup>
            <div className="text-center">
              <strong>Shop Location</strong>
              {location.stallNumber && <div>Stall {location.stallNumber.trim()}</div>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default function ShopDescription({ service: shop }) {
  // Handle the direct shop object (not wrapped in success/data)
  if (!shop || !shop.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-12 md:px-12 lg:px-24">
        <div className="bg-white rounded-3xl p-6 md:p-10 mb-10 shadow-xl border border-gray-100">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop Not Found
          </h1>
        </div>
      </div>
    );
  }

  const s = shop; // Direct access since it's not wrapped
  const [selectedImage, setSelectedImage] = useState(s.images?.[0] || "");
  const [likes, setLikes] = useState(0);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/${s._id}/like`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to like the shop");
      const data = await response.json();
      setLikes(data.likes || 0);
    } catch (error) {
      alert("Error liking the shop");
    } finally {
      setLiking(false);
    }
  };

  const handleOrderItem = (item) => {
    if (s.contact?.whatsapp) {
      const phone = s.contact.whatsapp.replace(/\s+/g, '').replace(/^\+/, '');
      const message = `Hi! I'd like to order ${item.name} (Rs. ${item.price}) from ${s.name}. Please let me know the availability and pickup/delivery details.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      alert('WhatsApp contact not available for this shop.');
    }
  };

  const coords = getCoordinates(s.location);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-12 md:px-12 lg:px-24">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl p-6 md:p-10 mb-10 border border-blue-200 shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-full text-white">
                <StallIcon />
              </div>
              <span className="text-blue-700 font-bold text-lg bg-blue-100 px-3 py-1 rounded-full">
                {s.location?.stallNumber ? `Stall ${s.location.stallNumber.trim()}` : 'Food Stall'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              {s.name}
            </h1>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {s.description || "Delicious food awaits you!"}
            </p>
            
            {/* Stats Row */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                <StarIcon />
                <span className="font-semibold text-gray-900">4.5</span>
                <span className="text-gray-600 text-sm">(250+ reviews)</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                <div className="text-orange-600">
                  <MenuIcon />
                </div>
                <span className="font-semibold text-gray-900">{s.menu ? s.menu.length : 0}</span>
                <span className="text-gray-600 text-sm">items</span>
              </div>
            </div>
            
            {/* Night Market Badge */}
            {s.nightMarket && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                <div className="text-blue-600">
                  <LocationIcon />
                </div>
                <span>Located in {s.nightMarket.name}</span>
              </div>
            )}
          </div>
          
          {/* Like Button */}
          <button
            className="p-4 bg-white rounded-2xl border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={handleLike}
            disabled={liking}
          >
            <svg
              className={`w-7 h-7 ${liking ? 'text-red-400' : 'text-red-500'} transition-colors`}
              fill={likes > 0 ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
            {likes > 0 && <span className="text-sm text-gray-600 mt-1 block font-medium">{likes}</span>}
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-10">
        {/* Left Column - Images and Details */}
        <div className="flex-1 flex flex-col gap-10">
          {/* Main Image Display */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-3xl shadow-2xl">
            <div className="rounded-2xl overflow-hidden bg-white flex items-center justify-center min-h-[300px] shadow-inner">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={s.name}
                  className="w-full object-contain max-h-[400px] md:max-h-[600px] rounded-2xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <ChefHatIcon />
                  <p className="mt-4 text-lg">No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* Image Thumbnails */}
          {s.images && s.images.length > 0 && (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {s.images.map((img, index) => (
                <button
                  key={img}
                  className={`w-20 h-20 sm:w-24 sm:h-28 p-1 rounded-2xl overflow-hidden border-3 transition-all duration-300 ${
                    selectedImage === img 
                      ? "border-blue-500 shadow-xl scale-110 ring-4 ring-blue-200" 
                      : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
                  } bg-gradient-to-br from-gray-900 to-black cursor-pointer flex-shrink-0`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${s.name} ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}

          {/* Menu Section */}
          {s.menu && s.menu.length > 0 && (
            <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-8 md:p-10 rounded-3xl border border-orange-200 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                    <div className="bg-orange-600 p-3 rounded-2xl text-white">
                      <ChefHatIcon />
                    </div>
                    {s.name}'s Menu
                  </h2>
                  <p className="text-gray-700 text-lg">
                    Discover their delicious offerings - {s.menu.length} item{s.menu.length !== 1 ? 's' : ''} available
                  </p>
                </div>
                <div className="text-right bg-white p-6 rounded-2xl shadow-lg">
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{s.menu.length}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Items</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {s.menu.map((item) => (
                  <MenuItemCard 
                    key={item._id} 
                    item={item} 
                    shopName={s.name}
                    onOrderClick={handleOrderItem}
                  />
                ))}
              </div>

              {/* Menu Footer */}
              <div className="mt-10 pt-8 border-t-2 border-orange-200 text-center bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Order?</h3>
                <p className="text-gray-700 mb-6 text-lg">
                  Contact {s.name} via WhatsApp for quick service and fresh food!
                </p>
                {s.contact?.whatsapp && (
                  <button
                    onClick={() => {
                      const phone = s.contact.whatsapp.replace(/\s+/g, '').replace(/^\+/, '');
                      const message = `Hi! I'd like to see the full menu and place an order from ${s.name}. What's available today?`;
                      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center gap-3 mx-auto shadow-2xl hover:shadow-3xl transform hover:scale-105"
                  >
                    <WhatsAppIcon />
                    Contact {s.name} via WhatsApp
                  </button>
                )}
              </div>
            </div>
          )}

          {/* About Section */}
          <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 md:p-10 rounded-3xl border border-gray-200 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-2xl text-white">
                <MenuIcon />
              </div>
              About {s.name}
            </h2>
            <div className="text-gray-700 text-lg leading-relaxed mb-8 bg-white p-6 rounded-2xl shadow-inner">
              {s.description || `Welcome to ${s.name}! They serve delicious food with passion and care.`}
            </div>
            
            {/* Shop Stats */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-orange-600">
                    <ChefHatIcon />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">Menu Items</h4>
                </div>
                <p className="text-gray-600">
                  {s.menu ? s.menu.length : 0} delicious items available to order
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact and Actions */}
        <div className="w-full xl:w-[400px] flex flex-col gap-8">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl hover:shadow-3xl transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-xl text-white">
                <PhoneIcon />
              </div>
              Contact {s.name}
            </h3>
            
            <div className="space-y-4">
              {s.contact?.phone && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <div className="bg-green-600 p-2 rounded-xl text-white">
                    <PhoneIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Phone</p>
                    <a href={`tel:${s.contact.phone.trim()}`} className="text-green-700 font-bold hover:underline text-lg">
                      {s.contact.phone.trim()}
                    </a>
                  </div>
                </div>
              )}
              
              {s.contact?.email && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <EmailIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <a href={`mailto:${s.contact.email.trim()}`} className="text-blue-700 font-bold hover:underline">
                      {s.contact.email.trim()}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-8">
              {s.contact?.whatsapp && (
                <button
                  onClick={() => {
                    const phone = s.contact.whatsapp.replace(/\s+/g, '').replace(/^\+/, '');
                    window.open(`https://wa.me/${phone}`, '_blank');
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <WhatsAppIcon />
                  Contact {s.name}
                </button>
              )}
            </div>
          </div>

          {/* Location Map */}
          {coords && (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <LocationIcon />
                </div>
                {s.name}'s Location
              </h3>
              
              <ShopMap location={s.location} />
              
              <div className="mt-6 space-y-3 bg-gray-50 p-4 rounded-2xl">
                {s.location?.stallNumber && (
                  <p className="text-sm text-gray-700 flex items-center gap-2 font-medium">
                    <div className="text-blue-600">
                      <StallIcon />
                    </div>
                    <strong>Stall:</strong> {s.location.stallNumber.trim()}
                  </p>
                )}
                <p className="text-sm text-gray-700 font-medium">
                  <strong>Coordinates:</strong> {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </p>
                {s.nightMarket?.location?.address && (
                  <p className="text-sm text-gray-700 font-medium">
                    <strong>Address:</strong> {s.nightMarket.location.address.trim()}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${coords.lat},${coords.lng}`, '_blank')}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-2xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Directions
              </button>
            </div>
          )}

          {/* Social Media */}
          {(s.socialMedia?.facebook || s.socialMedia?.instagram || s.socialMedia?.website || s.socialMedia?.tiktok) && (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Follow {s.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                {s.socialMedia?.facebook && (
                  <a
                    href={s.socialMedia.facebook.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 text-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                )}
                {s.socialMedia?.instagram && (
                  <a
                    href={s.socialMedia.instagram.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 text-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                )}
                {s.socialMedia?.tiktok && (
                  <a
                    href={s.socialMedia.tiktok.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 text-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                    TikTok
                  </a>
                )}
                {s.socialMedia?.website && (
                  <a
                    href={s.socialMedia.website.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 text-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    Website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
