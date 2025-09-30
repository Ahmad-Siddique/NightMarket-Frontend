"use client";
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Dynamically import MapContainer to avoid SSR issues in Next.js
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// SVG Icons
const LikeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M16.5 3.5c-1.74 0-3.41 1.01-4.5 2.09C10.91 4.51 9.24 3.5 7.5 3.5A5.505 5.505 0 0 0 2 9c0 7.08 10 11.5 10 11.5s10-4.42 10-11.5a5.505 5.505 0 0 0-5.5-5.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-500">
    <path d="M8 0C5.2 0 3 2.2 3 5c0 3.5 5 11 5 11s5-7.5 5-11c0-2.8-2.2-5-5-5zm0 7.5c-1.4 0-2.5-1.1-2.5-2.5S6.6 2.5 8 2.5s2.5 1.1 2.5 2.5S9.4 7.5 8 7.5z" fill="currentColor" />
  </svg>
);

const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-600">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" fill="currentColor" />
  </svg>
);

const StallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="9,22 9,12 15,12 15,22" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Helper function to extract coordinates from different data structures
const getCoordinates = (location) => {
  if (!location) return null;
  
  if (location.coordinates && location.coordinates.lat && location.coordinates.lng) {
    return { lat: location.coordinates.lat, lng: location.coordinates.lng };
  }
  
  if (location.lat && location.lng) {
    return { lat: location.lat, lng: location.lng };
  }
  
  if (location.coordinates && Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
    return { lat: location.coordinates[1], lng: location.coordinates[0] };
  }
  
  if (Array.isArray(location) && location.length >= 2) {
    return { lat: location[1], lng: location[0] };
  }
  
  return null;
};

// Shop Card Component
const ShopCard = ({ shop, bazaarName }) => {
  const coords = getCoordinates(shop.location);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Shop Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {shop.images && shop.images[0] ? (
          <img
            src={shop.images[0]}
            alt={shop.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No Image</p>
            </div>
          </div>
        )}
        
        {/* Stall Number Badge */}
        {shop.location?.stallNumber && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
            <StallIcon />
            Stall {shop.location.stallNumber.trim()}
          </div>
        )}

        {/* Menu Button - Top Right */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => {
              // Handle menu view - you can navigate to menu page or open modal
              console.log('View menu for:', shop.name);
              // Example: router.push(`/menu/${shop.slug}`)
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-lg"
          >
            <MenuIcon />
            See Menu
          </button>
        </div>
      </div>

      {/* Shop Details */}
      <div className="p-5">
        {/* Shop Name & Description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {shop.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {shop.description || "Delicious food and great service awaits you!"}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {shop.contact?.phone && (
            <div className="flex items-center gap-2">
              <PhoneIcon />
              <span className="text-sm text-gray-600">
                {shop.contact.phone.trim()}
              </span>
            </div>
          )}
          
          {shop.contact?.whatsapp && (
            <div className="flex items-center gap-2">
              <WhatsAppIcon />
              <span className="text-sm text-gray-600">
                WhatsApp: {shop.contact.whatsapp.trim()}
              </span>
            </div>
          )}

          {coords && (
            <div className="flex items-center gap-2">
              <LocationIcon />
              <span className="text-sm text-gray-600">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => {
              console.log('View menu for:', shop.name);
              // Handle menu navigation
            }}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <MenuIcon />
            View Menu
          </button>
          
          {shop.contact?.whatsapp && (
            <button
              onClick={() => {
                const phone = shop.contact.whatsapp.replace(/\s+/g, '').replace(/^\+/, '');
                window.open(`https://wa.me/${phone}`, '_blank');
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <WhatsAppIcon />
              WhatsApp
            </button>
          )}

          {coords && (
            <button
              onClick={() => {
                window.open(`https://maps.google.com/?q=${coords.lat},${coords.lng}`, '_blank');
              }}
              className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <LocationIcon />
            </button>
          )}
        </div>

        {/* Social Media Links */}
        {(shop.socialMedia?.facebook || shop.socialMedia?.instagram || shop.socialMedia?.website) && (
          <div className="flex justify-center gap-3 mt-4 pt-3 border-t border-gray-100">
            {shop.socialMedia?.facebook && (
              <a
                href={shop.socialMedia.facebook.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            
            {shop.socialMedia?.instagram && (
              <a
                href={shop.socialMedia.instagram.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-pink-600 hover:bg-pink-700 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            
            {shop.socialMedia?.website && (
              <a
                href={shop.socialMedia.website.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// (Keep all the existing map components - GoogleMapEmbed, OpenStreetMapComponent, etc.)
const GoogleMapEmbed = ({ location }) => {
  const coords = getCoordinates(location);
  
  if (!coords) {
    return (
      <div className="w-full h-96 rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Location coordinates not available</p>
          <p className="text-xs text-gray-400">Debug: {JSON.stringify(location, null, 2)}</p>
        </div>
      </div>
    );
  }

  const { lat, lng } = coords;
  const query = `${lat},${lng}`;
  
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?q=${query}&zoom=16`}
        title={`Map showing ${location.name || 'Location'}`}
      />
    </div>
  );
};

const OpenStreetMapComponent = ({ location }) => {
  const coords = getCoordinates(location);
  
  if (!coords) {
    return (
      <div className="w-full h-96 rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Location coordinates not available</p>
          <p className="text-xs text-gray-400">Debug: {JSON.stringify(location, null, 2)}</p>
        </div>
      </div>
    );
  }

  const { lat, lng } = coords;
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
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

  if (!leafletLoaded) {
    return (
      <div className="w-full h-96 rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200">
      <MapContainer 
        center={[lat, lng]} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div className="text-center">
              <strong className="text-lg">{location.name || 'Location'}</strong><br />
              <small className="text-gray-600">{location.address || 'Address not available'}</small>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

const MainContent = ({ shot }) => {
  console.log("=== SHOT DATA STRUCTURE ===");
  console.log("shot:", JSON.stringify(shot, null, 2));
  
  const [mapType, setMapType] = useState('openstreet'); // Default to OpenStreetMap
  const [likes, setLikes] = useState(0);
  const [liking, setLiking] = useState(false);

  if (!shot) {
    return (
      <div className="w-full pt-0 pb-8 md:pb-16 px-4 sm:px-6 lg:px-16 flex flex-col gap-12 max-w-[1440px] mx-auto">
        <div className="w-full px-4 sm:px-8 py-6 md:py-10 bg-slate-50 rounded-2xl flex flex-col gap-5">
          <h1 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Inter'] leading-tight">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  if (!shot?.name) {
    return (
      <div className="w-full pt-0 pb-8 md:pb-16 px-4 sm:px-6 lg:px-16 flex flex-col gap-12 max-w-[1440px] mx-auto">
        <div className="w-full px-4 sm:px-8 py-6 md:py-10 bg-slate-50 rounded-2xl flex flex-col gap-5">
          <h1 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Inter'] leading-tight">
            Location Not Found
          </h1>
        </div>
      </div>
    );
  }

  const s = shot;
  const coords = getCoordinates(s.location);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    const prevLikes = likes;
    setLikes((l) => l + 1);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/locations/${s._id}/like`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to like the location");
      const data = await response.json();
      setLikes(data.likes || 0);
    } catch (error) {
      console.error('Like error:', error);
      alert("Error liking the location");
      setLikes(prevLikes);
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="w-full pt-0 pb-8 md:pb-16 px-4 sm:px-6 lg:px-16 flex flex-col gap-12 max-w-[1440px] mx-auto">
      {/* Header Section */}
      <div className="w-full px-4 sm:px-8 py-6 md:py-10 bg-slate-50 rounded-2xl flex flex-col gap-5">
        <h1 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Inter'] leading-tight">
          {s.name}
        </h1>
        <div className="h-px w-full bg-neutral-200" />
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex justify-center items-center overflow-hidden">
                {s.images && s.images[0] ? (
                  <img className="w-12 h-12 object-cover rounded-full" src={s.images[0]} alt={s.name} />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="text-gray-900 text-lg sm:text-xl md:text-2xl font-bold font-['Inter']">
                  Team Agency
                </div>
                <div className="text-gray-900/50 text-base sm:text-lg font-medium font-['Inter']">
                  Location
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <LocationIcon />
                <span className="text-gray-600 text-sm font-medium">
                  {s.location?.address || "Address not available"}
                </span>
              </div>
              
              {coords && (
                <div className="text-gray-500 text-xs">
                  {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                </div>
              )}

              {/* Shop count */}
              {s.shops && s.shops.length > 0 && (
                <div className="text-blue-600 text-sm font-medium">
                  {s.shops.length} shop{s.shops.length !== 1 ? 's' : ''} available
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
              aria-label="Like"
              onClick={handleLike}
              disabled={liking}
            >
              <LikeIcon />
              <span className="ml-1 text-gray-700">{likes}</span>
            </button>
            
            {coords && (
              <button
                onClick={() => {
                  window.open(`https://maps.google.com/?q=${coords.lat},${coords.lng}`, '_blank');
                }}
                className="px-4 py-3 bg-green-600 rounded-xl border border-green-600 flex items-center justify-center text-white font-bold text-sm hover:bg-green-700 transition"
              >
                External Map
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-12">
        {s.images && s.images[0] && (
          <div className="w-full bg-gray-900 rounded-3xl p-2 sm:p-5 flex flex-col items-center">
            <img className="w-full max-w-full rounded-2xl object-cover" src={s.images[0]} alt={s.name} />
          </div>
        )}

        {/* Shops Section */}
        {s.shops && s.shops.length > 0 && (
          <div className="w-full bg-slate-50 rounded-3xl p-6 sm:p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-gray-900 text-2xl md:text-3xl font-bold mb-2">
                  Shops & Restaurants
                </h3>
                <p className="text-gray-600">
                  Discover {s.shops.length} amazing shop{s.shops.length !== 1 ? 's' : ''} at {s.name}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{s.shops.length}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Shops</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {s.shops.map((shop) => (
                <ShopCard 
                  key={shop._id} 
                  shop={shop} 
                  bazaarName={s.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="w-full bg-slate-50 rounded-3xl p-6 sm:p-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LocationIcon />
              <h3 className="text-gray-900 text-xl md:text-2xl font-bold">Location Map</h3>
            </div>
            
            {coords && (
              <div className="flex gap-2">
                <button
                  onClick={() => setMapType('openstreet')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    mapType === 'openstreet' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  OpenStreet
                </button>
                <button
                  onClick={() => setMapType('google')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    mapType === 'google' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Google
                </button>
              </div>
            )}
          </div>
          
          {mapType === 'google' ? (
            <GoogleMapEmbed location={s.location} />
          ) : (
            <OpenStreetMapComponent location={s.location} />
          )}
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <LocationIcon />
              <span className="font-semibold text-gray-900">Address:</span>
            </div>
            <p className="text-gray-600">{s.location?.address || "Not provided"}</p>
            
            {coords && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="font-semibold text-gray-900">Coordinates:</span>
                <p className="text-gray-600 text-sm">
                  Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="w-full bg-slate-50 rounded-3xl p-6 sm:p-10 flex flex-col gap-8">
          <h3 className="text-gray-900 text-xl md:text-2xl font-bold">About {s.name}</h3>
          <div className="text-gray-900 text-base sm:text-lg md:text-xl font-normal font-['Inter'] leading-relaxed">
            {s.description || "No description available"}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-gray-700 font-semibold mb-2">Date Added</h4>
              <p className="text-gray-600">
                {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : "Not available"}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-gray-700 font-semibold mb-2">Last Updated</h4>
              <p className="text-gray-600">
                {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : "Not available"}
              </p>
            </div>
          </div>
        </div>

        {s.images && s.images.length > 1 && s.images.slice(1).map((img, idx) => (
          <div key={img} className="w-full bg-gray-900 rounded-3xl p-2 sm:p-5 flex flex-col items-center">
            <img className="w-full max-w-full rounded-2xl object-cover" src={img} alt={`${s.name} image ${idx + 2}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
