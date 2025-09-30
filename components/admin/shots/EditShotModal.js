"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

// Direct import approach for better compatibility
let MapContainer, TileLayer, Marker, useMapEvents;

const MapWithClickHandler = ({ center, onLocationSelect, selectedPosition }) => {
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

        // Import React Leaflet components
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
        console.log('Map clicked at:', e.latlng); // Debug log
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

export default function EditNightMarketModal({ isOpen, onClose, shotId, nightMarketData }) {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 24.8607, lng: 67.0011 });
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  
  // UI state
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  
  const fileInputRef = useRef(null);
  const fetchingRef = useRef(false);

  // Fetch night market data when modal opens
  useEffect(() => {
    if (isOpen && shotId && !fetchingRef.current) {
      const fetchNightMarketData = async () => {
        fetchingRef.current = true;
        setLoading(true);
        setSuccessMessage("");

        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/nightmarkets/${shotId}`,
            { withCredentials: true }
          );
          
          const data = response.data.data || nightMarketData;
          console.log("Night Market data fetched:", data);
          
          if (data) {
            setName(data.name || "");
            setDescription(data.description || "");
            setAddress(data.location?.address || "");
            setCoordinates({
              lat: data.location?.coordinates?.lat || 24.8607,
              lng: data.location?.coordinates?.lng || 67.0011
            });
            setImages(data.images || []);
          }
        } catch (error) {
          console.error("Error fetching night market data:", error);
          
          // Fallback to passed data if API fails
          if (nightMarketData) {
            setName(nightMarketData.name || "");
            setDescription(nightMarketData.description || "");
            setAddress(nightMarketData.location?.address || "");
            setCoordinates({
              lat: nightMarketData.location?.coordinates?.lat || 24.8607,
              lng: nightMarketData.location?.coordinates?.lng || 67.0011
            });
            setImages(nightMarketData.images || []);
          } else {
            alert("Failed to load night market data.");
          }
        } finally {
          setLoading(false);
          fetchingRef.current = false;
        }
      };

      fetchNightMarketData();
    }
  }, [isOpen, shotId, nightMarketData]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      fetchingRef.current = false;
      setName("");
      setDescription("");
      setAddress("");
      setCoordinates({ lat: 24.8607, lng: 67.0011 });
      setImages([]);
      setNewImages([]);
      setSuccessMessage("");
    }
  }, [isOpen]);

  // Handle location selection from map
  const handleLocationSelect = (newLocation) => {
    console.log("Location selected in parent:", newLocation); // Debug log
    setCoordinates(newLocation);
    
    // Reverse geocoding to get address
    reverseGeocode(newLocation.lat, newLocation.lng);
  };

  // Reverse geocoding function
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
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

    const newImagePromises = imageFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            src: reader.result,
            type: file.type,
            name: file.name,
            file,
            id: Date.now() + Math.random()
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagePromises).then(newImageObjects => {
      setNewImages(prev => [...prev, ...newImageObjects]);
    });
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove new image
  const removeNewImage = (id) => {
    setNewImages(prev => prev.filter(img => img.id !== id));
  };

  // Validate form
  const validateForm = () => {
    if (!name.trim()) {
      alert("Night market name is required.");
      return false;
    }
    
    if (name.trim().length < 3) {
      alert("Name must be at least 3 characters long.");
      return false;
    }
    
    if (name.trim().length > 100) {
      alert("Name cannot exceed 100 characters.");
      return false;
    }
    
    if (description.length > 500) {
      alert("Description cannot exceed 500 characters.");
      return false;
    }
    
    if (!address.trim()) {
      alert("Address is required.");
      return false;
    }
    
    if (coordinates.lat < -90 || coordinates.lat > 90) {
      alert("Latitude must be between -90 and 90.");
      return false;
    }
    
    if (coordinates.lng < -180 || coordinates.lng > 180) {
      alert("Longitude must be between -180 and 180.");
      return false;
    }
    
    return true;
  };

  // Submit handler for edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) return;
    
    if (!validateForm()) return;
    
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("location[address]", address.trim());
      formData.append("location[coordinates][lat]", coordinates.lat);
      formData.append("location[coordinates][lng]", coordinates.lng);
      
      // Add new images
      newImages.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });
      
      // Add existing images that weren't removed
      images.forEach((imageUrl) => {
        formData.append("existingImages", imageUrl);
      });

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/nightmarkets/${shotId}`,
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(`Successfully updated night market: ${name}`);
        
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error("Failed to update night market");
      }
    } catch (err) {
      console.error("Error updating night market:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to update night market";
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
            <p className="text-gray-600 text-lg">Loading night market data...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pr-8">
              Edit Night Market: {name || "Loading..."}
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

              {/* Location Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 text-blue-600" />
                  Location & Coordinates
                </h3>
                
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

                {/* Interactive Map with better instructions */}
                <div className="space-y-4">
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
                      Current Location
                    </label>
                    <div className="text-sm text-blue-600 font-mono bg-blue-50 px-3 py-1 rounded-full">
                      {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </div>
                  </div>
                  
                  <MapWithClickHandler
                    center={coordinates}
                    onLocationSelect={handleLocationSelect}
                    selectedPosition={coordinates}
                  />
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Images</h3>
                
                {/* Existing Images */}
                {images.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-gray-700">Current Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Current ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {newImages.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-gray-700">New Images to Upload</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {newImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.src}
                            alt={image.name}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(image.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
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
                        Support: JPG, PNG, WebP. Max 10MB per image.
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
                  disabled={submitting || !name.trim() || !address.trim()}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Night Market"
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
