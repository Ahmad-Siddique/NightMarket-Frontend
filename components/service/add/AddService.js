"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

// Map component with click handler
let MapContainer, TileLayer, Marker, useMapEvents;

const MapWithClickHandler = ({ center, selectedPosition, onLocationSelect }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const loadMapComponents = async () => {
      try {
        await import('leaflet/dist/leaflet.css');
        const L = await import('leaflet');
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const reactLeaflet = await import('react-leaflet');
        MapContainer = reactLeaflet.MapContainer;
        TileLayer = reactLeaflet.TileLayer;
        Marker = reactLeaflet.Marker;
        useMapEvents = reactLeaflet.useMapEvents;

        setMapLoaded(true);
      } catch (error) {
        console.error('Failed to load map components:', error);
      }
    };

    loadMapComponents();
  }, []);

  const ClickHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        console.log('Map clicked at:', e.latlng);
        onLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      },
    });
    return null;
  };

  if (!mapLoaded) {
    return (
      <div className="w-full h-64 rounded-xl bg-gray-100 flex items-center justify-center border-2 border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={15}
        style={{ height: '100%', width: '100%', cursor: 'crosshair' }}
        key={`${center.lat}-${center.lng}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedPosition && (
          <Marker position={[selectedPosition.lat, selectedPosition.lng]} />
        )}
        <ClickHandler />
      </MapContainer>
    </div>
  );
};

export default function AddShop() {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState("");
  const [nightMarketId, setNightMarketId] = useState("");
  const [description, setDescription] = useState("");
  const [stallNumber, setStallNumber] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 24.8607, lng: 67.0011 }); // Default to Karachi
  
  // Contact fields
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  
  // Social media fields
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [website, setWebsite] = useState("");
  
  // Image handling
  const [images, setImages] = useState([]);
  
  // Night markets dropdown
  const [nightMarkets, setNightMarkets] = useState([]);
  const [loadingMarkets, setLoadingMarkets] = useState(false);
  
  // UI state
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  
  const fileInputRef = useRef(null);

  // Fetch night markets on component mount
  useEffect(() => {
    const fetchNightMarkets = async () => {
      setLoadingMarkets(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/nightmarkets/list`,
          { withCredentials: true }
        );
        
        console.log("Night markets fetched:", response.data);
        const markets = response.data?.data || response.data || [];
        setNightMarkets(markets);
      } catch (error) {
        console.error("Error fetching night markets:", error);
        setNightMarkets([]);
        alert("Failed to load night markets. Please refresh the page.");
      } finally {
        setLoadingMarkets(false);
      }
    };

    fetchNightMarkets();
  }, []);

  // Handle location selection from map
  const handleLocationSelect = (newLocation) => {
    console.log("Location selected:", newLocation);
    setCoordinates(newLocation);
  };

  // Handle manual coordinate input
  const handleCoordinateChange = (field, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setCoordinates(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  // Handle drag events for image upload
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event for image upload
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  // Handle file selection for image upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  // Process multiple files for image upload
  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    
    if (imageFiles.length === 0) {
      alert("Please select valid image files.");
      return;
    }

    // Check file sizes (max 10MB each)
    const maxSize = 10 * 1024 * 1024;
    const validFiles = imageFiles.filter(file => file.size <= maxSize);
    
    if (validFiles.length !== imageFiles.length) {
      alert("Some files are too large. Maximum file size is 10MB per image.");
    }

    const newFiles = validFiles.slice(0, 10 - images.length);
    if (images.length + newFiles.length > 10) {
      alert("Maximum 10 images allowed.");
      return;
    }

    const newImagePromises = newFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            src: reader.result,
            type: file.type,
            name: file.name,
            file,
            id: Date.now() + Math.random(),
            size: file.size
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagePromises).then(newImageObjects => {
      setImages(prev => [...prev, ...newImageObjects]);
    });
  };

  // Remove image
  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // Validate form
  const validateForm = () => {
    if (!name.trim()) {
      return "Shop name is required.";
    }
    
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long.";
    }
    
    if (name.trim().length > 100) {
      return "Name cannot exceed 100 characters.";
    }
    
    if (!nightMarketId) {
      return "Please select a night market.";
    }
    
    if (description.length > 500) {
      return "Description cannot exceed 500 characters.";
    }
    
    if (coordinates.lat < -90 || coordinates.lat > 90) {
      return "Latitude must be between -90 and 90.";
    }
    
    if (coordinates.lng < -180 || coordinates.lng > 180) {
      return "Longitude must be between -180 and 180.";
    }
    
    // Email validation if provided - FIXED
    if (email && email.trim()) {
      const trimmedEmail = email.trim();
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      
      if (!emailRegex.test(trimmedEmail)) {
        return "Please enter a valid email address.";
      }
    }
    
    // URL validation for social media links
   const validateURL = (url) => {
  if (!url.trim()) return true; // Empty is valid (optional field)
  
  // Allow URLs with or without protocol
  const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/;
  return urlRegex.test(url.trim());
};
    
    if (facebook.trim() && !validateURL(facebook.trim())) {
      return "Facebook URL must start with http:// or https://";
    }
    
    if (instagram.trim() && !validateURL(instagram.trim())) {
      return "Instagram URL must start with http:// or https://";
    }
    
    if (tiktok.trim() && !validateURL(tiktok.trim())) {
      return "TikTok URL must start with http:// or https://";
    }
    
    if (website.trim() && !validateURL(website.trim())) {
      return "Website URL must start with http:// or https://";
    }
    
    if (images.length === 0) {
      return "Please upload at least one image.";
    }
    
    return null;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) return;
    
    setSubmitError("");
    setSubmitSuccess("");
    
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }
    
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("nightMarket", nightMarketId);
      formData.append("description", description.trim());
      formData.append("location[stallNumber]", stallNumber.trim());
      formData.append("location[coordinates][lat]", coordinates.lat);
      formData.append("location[coordinates][lng]", coordinates.lng);
      
      // Contact information
      formData.append("contact[phone]", phone.trim());
      formData.append("contact[whatsapp]", whatsapp.trim());
      formData.append("contact[email]", email.trim());
      
      // Social media
      formData.append("socialMedia[facebook]", facebook.trim());
      formData.append("socialMedia[instagram]", instagram.trim());
      formData.append("socialMedia[tiktok]", tiktok.trim());
      formData.append("socialMedia[website]", website.trim());
      
      // Add images
      images.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shops`,
        { 
          method: "POST",
          body: formData,
          credentials: "include"
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Failed to create shop");
      }

      setSubmitSuccess("Shop created successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/shop");
      }, 1500);
      
    } catch (err) {
      console.error("Error creating shop:", err);
      setSubmitError(err.message || "Failed to create shop");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        <h1 className="text-center text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          Add New Shop
        </h1>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="w-full p-6 md:p-8 lg:p-10 rounded-3xl bg-white shadow-2xl border border-gray-200 flex flex-col gap-8"
        >
          {/* Success/Error Messages */}
          {submitError && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg border border-red-200">
              <strong>Error:</strong> {submitError}
            </div>
          )}
          
          {submitSuccess && (
            <div className="p-4 bg-green-100 text-green-800 rounded-lg border border-green-200 flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
              <span className="font-medium">{submitSuccess}</span>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BuildingStorefrontIcon className="w-6 h-6 text-blue-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shop Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg font-semibold">
                  Shop Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter shop name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500 focus:outline-none"
                  required
                  maxLength={100}
                  minLength={2}
                />
                <div className="text-sm text-gray-500">
                  {name.length}/100 characters
                </div>
              </div>

              {/* Night Market Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg font-semibold">
                  Night Market *
                </label>
                <select
                  value={nightMarketId}
                  onChange={(e) => setNightMarketId(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                  required
                  disabled={loadingMarkets}
                >
                  <option value="">
                    {loadingMarkets ? "Loading markets..." : "Select a night market"}
                  </option>
                  {nightMarkets.map((market) => (
                    <option key={market._id} value={market._id}>
                      {market.name}
                    </option>
                  ))}
                </select>
                {loadingMarkets && (
                  <div className="text-sm text-blue-600 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Loading night markets...
                  </div>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 text-lg font-semibold">
                Description
              </label>
              <textarea
                placeholder="Describe your shop..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500 focus:outline-none resize-vertical"
                rows={4}
                maxLength={500}
              />
              <div className="text-sm text-gray-500">
                {description.length}/500 characters
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPinIcon className="w-6 h-6 text-blue-600" />
              Location Details
            </h2>
            
            {/* Stall Number and Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Stall Number</label>
                <input
                  type="text"
                  placeholder="A12"
                  value={stallNumber}
                  onChange={(e) => setStallNumber(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="24.8607"
                  value={coordinates.lat}
                  onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                  min={-90}
                  max={90}
                  required
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="67.0011"
                  value={coordinates.lng}
                  onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                  min={-180}
                  max={180}
                  required
                />
              </div>
            </div>

            {/* Interactive Map Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                <span className="text-blue-900 font-semibold">Map Instructions:</span>
              </div>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Click anywhere on the map to set the location</li>
                <li>• The marker will appear at the clicked location</li>
                <li>• You can also enter coordinates manually above</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">
                Click on map to select location
              </label>
              <div className="text-sm text-blue-600 font-mono bg-blue-50 px-3 py-1 rounded-full">
                {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </div>
            </div>
            
            <MapWithClickHandler
              center={coordinates}
              selectedPosition={coordinates}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Phone</label>
                <input
                  type="tel"
                  placeholder="+923001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+923001234567"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="shop@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Social Media Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Facebook</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/yourshop"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Instagram</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/yourshop"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">TikTok</label>
                <input
                  type="url"
                  placeholder="https://tiktok.com/@yourshop"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Website</label>
                <input
                  type="url"
                  placeholder="https://yourshop.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Shop Images *</h2>
            
            {/* Image Previews */}
            {images.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-700">Selected Images ({images.length}/10)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.src}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        {(image.size / 1024 / 1024).toFixed(1)} MB
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload Area */}
            <div
              className={`w-full p-8 border-2 border-dashed rounded-xl transition-colors ${
                dragActive 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-4">
                <div 
                  className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ArrowUpTrayIcon className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <p className="text-lg text-gray-700">
                    Drag and drop images here, or{" "}
                    <button
                      type="button"
                      className="text-blue-600 font-semibold hover:text-blue-700 underline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Support: JPG, PNG, WebP. Max 10MB per image. At least one image required.
                  </p>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              onClick={() => router.push("/admin/shops")}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim() || !nightMarketId || images.length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Shop"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
