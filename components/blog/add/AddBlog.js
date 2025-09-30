"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckCircleIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

const categories = [
  "Food",
  "Drink", 
  "Snack",
  "Other"
];

export default function AddMenuItem() {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState("");
  const [shopId, setShopId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // Shops dropdown
  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(false);
  
  // UI state
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  
  const fileInputRef = useRef(null);

  // Fetch shops on component mount
  useEffect(() => {
    const fetchShops = async () => {
      setLoadingShops(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/list`,
          { withCredentials: true }
        );
        
        console.log("Shops fetched:", response.data);
        const shopsData = response.data?.data || response.data || [];
        setShops(shopsData);
      } catch (error) {
        console.error("Error fetching shops:", error);
        setShops([]);
        alert("Failed to load shops. Please refresh the page.");
      } finally {
        setLoadingShops(false);
      }
    };

    fetchShops();
  }, []);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  // Process the file for image upload
  const handleFile = (file) => {
    if (file.type.startsWith("image/")) {
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size too large. Maximum file size is 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage({
          src: reader.result,
          type: file.type,
          name: file.name,
          file,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  // Validate form
  const validateForm = () => {
    if (!name.trim()) {
      return "Menu item name is required.";
    }
    
    if (!shopId) {
      return "Please select a shop.";
    }
    
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return "Please enter a valid price (0 or greater).";
    }
    
    if (description.length > 300) {
      return "Description cannot exceed 300 characters.";
    }
    
    if (!category) {
      return "Please select a category.";
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
      formData.append("shop", shopId);
      formData.append("price", parseFloat(price));
      formData.append("description", description.trim());
      formData.append("category", category);
      
      if (uploadedImage && uploadedImage.file) {
        formData.append("image", uploadedImage.file);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/menuitems`,
        { 
          method: "POST",
          body: formData,
          credentials: "include"
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Failed to create menu item");
      }

      setSubmitSuccess("Menu item created successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/menuitems");
      }, 1500);
      
    } catch (err) {
      console.error("Error creating menu item:", err);
      setSubmitError(err.message || "Failed to create menu item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <h1 className="text-center text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          Add New Menu Item
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
              Menu Item Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Menu Item Name */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg font-semibold">
                  Menu Item Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter menu item name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500 focus:outline-none"
                  required
                />
              </div>

              {/* Shop Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg font-semibold">
                  Shop *
                </label>
                <select
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                  required
                  disabled={loadingShops}
                >
                  <option value="">
                    {loadingShops ? "Loading shops..." : "Select a shop"}
                  </option>
                  {shops.map((shop) => (
                    <option key={shop._id} value={shop._id}>
                      {shop.name} ({shop.nightMarket?.name || 'No Night Market'})
                    </option>
                  ))}
                </select>
                {loadingShops && (
                  <div className="text-sm text-blue-600 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Loading shops...
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg font-semibold">
                  Price (PKR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500 focus:outline-none"
                  required
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg font-semibold">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 focus:outline-none"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 text-lg font-semibold">
                Description
              </label>
              <textarea
                placeholder="Describe the menu item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500 focus:outline-none resize-vertical"
                rows={4}
                maxLength={300}
              />
              <div className="text-sm text-gray-500">
                {description.length}/300 characters
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Menu Item Image</h2>
            
            {/* Current Image */}
            {uploadedImage && (
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-700">Selected Image</h4>
                <div className="relative inline-block">
                  <img
                    src={uploadedImage.src}
                    alt={uploadedImage.name}
                    className="max-w-full max-h-64 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    {(uploadedImage.size / 1024 / 1024).toFixed(1)} MB
                  </div>
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
                    Drag and drop an image here, or{" "}
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
              onClick={() => router.push("/admin/menuitems")}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim() || !shopId || !price.trim() || !category}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Menu Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
