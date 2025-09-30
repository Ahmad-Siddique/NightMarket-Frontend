"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckCircleIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

// Map component for location selection
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

export default function EditShopModal({ isOpen, onClose, serviceId, shopData }) {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState("");
  const [nightMarketId, setNightMarketId] = useState("");
  const [description, setDescription] = useState("");
  const [stallNumber, setStallNumber] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 24.8607, lng: 67.0011 });
  
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
  const [uploadedImages, setUploadedImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  
  // Night markets dropdown
  const [nightMarkets, setNightMarkets] = useState([]);
  const [loadingMarkets, setLoadingMarkets] = useState(false);
  
  // UI state
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  
  const fileInputRef = useRef(null);
  const fetchingRef = useRef(false);

  // Fetch night markets
  useEffect(() => {
    const fetchNightMarkets = async () => {
      setLoadingMarkets(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/nightmarkets/list`,
          { withCredentials: true }
        );
        
        const markets = response.data?.data || response.data || [];
        setNightMarkets(markets);
      } catch (error) {
        console.error("Error fetching night markets:", error);
        setNightMarkets([]);
      } finally {
        setLoadingMarkets(false);
      }
    };

    if (isOpen) {
      fetchNightMarkets();
    }
  }, [isOpen]);

  // Fetch shop data when modal opens
  useEffect(() => {
    if (isOpen && serviceId && !fetchingRef.current) {
      const fetchShopData = async () => {
        fetchingRef.current = true;
        setLoading(true);
        setSuccessMessage("");

        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/${serviceId}`,
            { withCredentials: true }
          );
          
          const data = response.data?.data || shopData;
          console.log("SHOP DATA FETCHED", data);
          
          if (data) {
            setName(data.name || "");
            setNightMarketId(data.nightMarket?._id || data.nightMarket || "");
            setDescription(data.description || "");
            setStallNumber(data.location?.stallNumber || "");
            setCoordinates({
              lat: data.location?.coordinates?.lat || 24.8607,
              lng: data.location?.coordinates?.lng || 67.0011
            });
            
            // Contact information
            setPhone(data.contact?.phone || "");
            setWhatsapp(data.contact?.whatsapp || "");
            setEmail(data.contact?.email || "");
            
            // Social media
            setFacebook(data.socialMedia?.facebook || "");
            setInstagram(data.socialMedia?.instagram || "");
            setTiktok(data.socialMedia?.tiktok || "");
            setWebsite(data.socialMedia?.website || "");
            
            // Handle images
            if (data.images && Array.isArray(data.images)) {
              const imageObjects = data.images.map((img, index) => ({
                id: `existing-${index}`,
                src: img,
                file: null,
                type: "image/jpeg",
                name: `image-${index + 1}`,
                isExisting: true,
                originalUrl: img,
              }));
              setUploadedImages(imageObjects);
            }
          }
        } catch (error) {
          console.error("Error fetching shop data:", error);
          
          // Fallback to passed data if API fails
          if (shopData) {
            setName(shopData.name || "");
            setNightMarketId(shopData.nightMarket?._id || shopData.nightMarket || "");
            setDescription(shopData.description || "");
            setStallNumber(shopData.location?.stallNumber || "");
            setCoordinates({
              lat: shopData.location?.coordinates?.lat || 24.8607,
              lng: shopData.location?.coordinates?.lng || 67.0011
            });
            setPhone(shopData.contact?.phone || "");
            setWhatsapp(shopData.contact?.whatsapp || "");
            setEmail(shopData.contact?.email || "");
            setFacebook(shopData.socialMedia?.facebook || "");
            setInstagram(shopData.socialMedia?.instagram || "");
            setTiktok(shopData.socialMedia?.tiktok || "");
            setWebsite(shopData.socialMedia?.website || "");
            
            if (shopData.images && Array.isArray(shopData.images)) {
              const imageObjects = shopData.images.map((img, index) => ({
                id: `existing-${index}`,
                src: img,
                file: null,
                type: "image/jpeg",
                name: `image-${index + 1}`,
                isExisting: true,
                originalUrl: img,
              }));
              setUploadedImages(imageObjects);
            }
          } else {
            alert("Failed to load shop data.");
          }
        } finally {
          setLoading(false);
          fetchingRef.current = false;
        }
      };

      fetchShopData();
    }
  }, [isOpen, serviceId, shopData]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      fetchingRef.current = false;
      setName("");
      setNightMarketId("");
      setDescription("");
      setStallNumber("");
      setCoordinates({ lat: 24.8607, lng: 67.0011 });
      setPhone("");
      setWhatsapp("");
      setEmail("");
      setFacebook("");
      setInstagram("");
      setTiktok("");
      setWebsite("");
      setUploadedImages([]);
      setDeletedImages([]);
      setSuccessMessage("");
    }
  }, [isOpen]);

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

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Process multiple files
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

    const newFiles = validFiles.slice(0, 10 - uploadedImages.length);
    if (uploadedImages.length + newFiles.length > 10) {
      alert("Maximum 10 images allowed.");
      return;
    }

    const newImagesPromises = newFiles.map((file, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `new-${Date.now()}-${index}`,
            src: reader.result,
            type: file.type,
            name: file.name,
            file,
            isExisting: false,
            size: file.size
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagesPromises).then((newImages) => {
      setUploadedImages((prevImages) => [...prevImages, ...newImages]);
    });
  };

  // Remove a specific image
  const removeImage = useCallback(
    (imageId) => {
      const imageToRemove = uploadedImages.find((img) => img.id === imageId);

      if (imageToRemove && imageToRemove.isExisting) {
        setDeletedImages((prev) => {
          if (!prev.includes(imageToRemove.originalUrl)) {
            return [...prev, imageToRemove.originalUrl];
          }
          return prev;
        });
      }

      setUploadedImages((prevImages) =>
        prevImages.filter((img) => img.id !== imageId)
      );
    },
    [uploadedImages]
  );

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
    
    // Email validation if provided
   // Email validation if provided
if (email.trim() && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
  return "Please enter a valid email address.";
}

    
    return null;
  };

  // Submit handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) return;
    
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
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

      // Add deleted images to FormData
      deletedImages.forEach((imageUrl) => {
        formData.append("deletedImages[]", imageUrl);
      });

      // Only add new images (those with file property)
      uploadedImages.forEach((img) => {
        if (img.file) formData.append("images", img.file);
      });

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/${serviceId}`,
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(`Successfully updated shop: ${name}`);
        
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error("Failed to update shop");
      }
    } catch (err) {
      console.error("Error updating shop:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to update shop";
      alert("Error: " + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-10">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl mx-4 max-h-[95vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading shop data...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pr-8">
              Edit Shop: {name || "Loading..."}
            </h2>
            
            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-3">
                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="font-medium">{successMessage}</span>
              </div>
            )}
            
            <form
              onSubmit={handleEditSubmit}
              encType="multipart/form-data"
              className="w-full flex flex-col gap-8"
            >
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BuildingStorefrontIcon className="w-6 h-6 text-blue-600" />
                  Basic Information
                </h3>
                
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
                  </div>
                </div>

                {/* Description Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 text-lg font-semibold">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the shop..."
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
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 text-blue-600" />
                  Location Details
                </h3>
                
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

                {/* Interactive Map */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 font-medium">
                      Click on map to set location
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
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                
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
                <h3 className="text-xl font-semibold text-gray-900">Social Media Links</h3>
                
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
                <h3 className="text-xl font-semibold text-gray-900">Shop Images</h3>
                
                {/* Current Images */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-gray-700">
                      Current Images ({uploadedImages.length}/10)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {uploadedImages.map((image) => (
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
                          <div className="absolute bottom-2 left-2">
                            <span
                              className={`px-2 py-1 text-xs rounded font-medium ${
                                image.isExisting
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {image.isExisting ? "Existing" : "New"}
                            </span>
                          </div>
                          {image.size && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                              {(image.size / 1024 / 1024).toFixed(1)} MB
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {deletedImages.length > 0 && (
                      <div className="text-sm text-red-600 font-medium">
                        {deletedImages.length} image(s) marked for deletion
                      </div>
                    )}
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
                        Support: JPG, PNG, WebP. Max 10MB per image. Maximum 10 images.
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
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !nightMarketId}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Shop"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
