"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  MapPinIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

// Map component with click handler
const MapWithClickHandler = ({ center, selectedPosition, onLocationSelect }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const loadMapComponents = async () => {
      try {
        // Import Leaflet CSS
        await import('leaflet/dist/leaflet.css');
        
        // Import Leaflet and fix marker icons
        const L = await import('leaflet');
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        setMapLoaded(true);
      } catch (error) {
        console.error('Failed to load map components:', error);
      }
    };

    loadMapComponents();
  }, []);

  const ClickHandler = () => {
    const { useMapEvents } = require('react-leaflet');
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
      <div className="w-full h-96 rounded-xl bg-gray-100 flex items-center justify-center border-2 border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker } = require('react-leaflet');

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
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

export default function AddNightMarket() {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 24.8607, lng: 67.0011 }); // Default to Karachi
  const [images, setImages] = useState([]);
  
  // UI state
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  
  const fileInputRef = useRef(null);

  // Handle location selection from map
  const handleLocationSelect = (newLocation) => {
    console.log("Location selected:", newLocation);
    setCoordinates(newLocation);
    
    // Reverse geocoding to get address
    reverseGeocode(newLocation.lat, newLocation.lng);
  };

  // Reverse geocoding function
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'NightMarketApp/1.0 (contact: admin@example.com)'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
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
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = imageFiles.filter(file => file.size <= maxSize);
    
    if (validFiles.length !== imageFiles.length) {
      alert("Some files are too large. Maximum file size is 10MB per image.");
    }

    const newImagePromises = validFiles.map(file => {
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
      return "Night market name is required.";
    }
    
    if (name.trim().length < 3) {
      return "Name must be at least 3 characters long.";
    }
    
    if (name.trim().length > 100) {
      return "Name cannot exceed 100 characters.";
    }
    
    if (description.length > 500) {
      return "Description cannot exceed 500 characters.";
    }
    
    if (!address.trim()) {
      return "Address is required.";
    }
    
    if (coordinates.lat < -90 || coordinates.lat > 90) {
      return "Latitude must be between -90 and 90.";
    }
    
    if (coordinates.lng < -180 || coordinates.lng > 180) {
      return "Longitude must be between -180 and 180.";
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
      formData.append("description", description.trim());
      formData.append("location[address]", address.trim());
      formData.append("location[coordinates][lat]", coordinates.lat);
      formData.append("location[coordinates][lng]", coordinates.lng);
      
      // Add images
      images.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/nightmarkets`,
        { 
          method: "POST",
          body: formData,
          credentials: "include"
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Failed to create night market");
      }

      setSubmitSuccess("Night market created successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/nightmarkets");
      }, 1500);
      
    } catch (err) {
      console.error("Error creating night market:", err);
      setSubmitError(err.message || "Failed to create night market");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        <h1 className="text-center text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          Add New Night Market
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
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg font-semibold">
                  Night Market Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter night market name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500 focus:outline-none"
                  required
                  maxLength={100}
                  minLength={3}
                />
                <div className="text-sm text-gray-500">
                  {name.length}/100 characters
                </div>
              </div>

              {/* Address Field */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg font-semibold">
                  Address *
                </label>
                <input
                  type="text"
                  placeholder="Enter full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 text-lg font-semibold">
                Description
              </label>
              <textarea
                placeholder="Describe the night market..."
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
              Location & Coordinates
            </h2>
            
            {/* Manual Coordinate Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <li>• Address will be automatically filled (if available)</li>
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

          {/* Images Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Images *</h2>
            
            {/* Image Previews */}
            {images.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-700">Selected Images ({images.length})</h4>
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
              onClick={() => router.push("/admin/nightmarket")}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim() || !address.trim() || images.length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Night Market"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
