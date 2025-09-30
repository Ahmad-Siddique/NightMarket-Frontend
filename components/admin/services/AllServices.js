"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import EditServiceModal from "./EditServiceModal";

export default function AllServicesAdmin({
  services = [],
  totalPages = 1,
  currentPage = 1,
  totalResults = 0,
  searchQuery = "",
  loading = false,
}) {
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery);
  const debounceTimeout = useRef();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Open confirmation modal for delete
  const handleDeleteClick = (shop) => {
    setSelectedService(shop);
    setDeleteModalOpen(true);
  };

  // Confirm deletion with API call
  const handleConfirmDelete = async () => {
    if (deleting) return;
    setDeleting(true);

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/${selectedService._id}`,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 204) {
        setDeleteModalOpen(false);
        setSelectedService(null);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        throw new Error("Failed to delete shop");
      }
    } catch (err) {
      console.error("Error deleting shop:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to delete shop";
      alert("Error: " + errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  // Close delete modal
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedService(null);
  };

  // Open edit modal immediately
  const handleEditClick = (shop) => {
    setSelectedService(shop);
    setEditModalOpen(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedService(null);
  };

  // Handle create shop button click
  const handleCreateShopClick = () => {
    router.push("/shop/add");
  };

  // Keep local search state in sync with prop
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  // Handle search input change and debounce URL update
  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      router.replace(`/admin/shop?search=${encodeURIComponent(newSearch)}&page=1`);
    }, 350);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    router.push(
      `/admin/shop?search=${encodeURIComponent(searchQuery)}&page=${newPage}`
    );
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Shops Management
        </h1>
        <button
          onClick={handleCreateShopClick}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer text-sm font-medium"
        >
          Create Shop
        </button>
      </div>

      {/* Search Field */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search shops..."
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-64 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
        {/* {!loading && (
          <div className="text-sm text-gray-600">
            {totalResults > 0 ? (
              <>Showing {services.data.length} of {totalResults} shops</>
            ) : (
              "No shops found"
            )}
          </div>
        )} */}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        {/* Table Container with Scroll on Mobile */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Shop Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Night Market
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                      Loading shops...
                    </div>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No shops found.
                  </td>
                </tr>
              ) : (
                services.map((shop) => (
                  <tr
                    key={shop._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={shop.images?.[0] || 'https://via.placeholder.com/48x48?text=No+Image'}
                        alt={shop.name}
                        className="h-12 w-12 rounded-md object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {shop.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {shop.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {shop.nightMarket?.name || 'No Night Market'}
                      </div>
                      {shop.nightMarket?.slug && (
                        <div className="text-sm text-gray-500">
                          {shop.nightMarket.slug}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {shop.location?.stallNumber && (
                          <div>Stall: {shop.location.stallNumber.trim()}</div>
                        )}
                        {shop.location?.coordinates && (
                          <div className="text-xs text-gray-400">
                            {shop.location.coordinates.lat?.toFixed(4)}, {shop.location.coordinates.lng?.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {shop.contact?.phone && (
                          <div>📞 {shop.contact.phone.trim()}</div>
                        )}
                        {shop.contact?.whatsapp && (
                          <div className="text-green-600">💬 WhatsApp</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(shop.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <a
                          href={`/shops/view/${shop.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer text-sm"
                        >
                          View
                        </a>
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(shop);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(shop);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center sm:flex-row sm:justify-between">
          <span className="text-gray-500 text-sm mb-2 sm:mb-0">
            Page {currentPage} of {totalPages} 
            ({totalResults} total results)
          </span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            
            {/* Smart pagination for many pages */}
            {(() => {
              const pages = [];
              const showPages = 5; // Show 5 page numbers at most
              let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
              let endPage = Math.min(totalPages, startPage + showPages - 1);
              
              // Adjust start if we're near the end
              if (endPage - startPage < showPages - 1) {
                startPage = Math.max(1, endPage - showPages + 1);
              }

              // Add first page and ellipsis if needed
              if (startPage > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 bg-gray-200 text-gray-900 hover:bg-gray-300 rounded-md transition-colors text-sm"
                  >
                    1
                  </button>
                );
                if (startPage > 2) {
                  pages.push(
                    <span key="ellipsis-start" className="px-2 py-1 text-gray-500 text-sm">
                      ...
                    </span>
                  );
                }
              }

              // Add page numbers
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md transition-colors text-sm ${
                      currentPage === i
                        ? "bg-gray-900 text-white"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    {i}
                  </button>
                );
              }

              // Add ellipsis and last page if needed
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(
                    <span key="ellipsis-end" className="px-2 py-1 text-gray-500 text-sm">
                      ...
                    </span>
                  );
                }
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 bg-gray-200 text-gray-900 hover:bg-gray-300 rounded-md transition-colors text-sm"
                  >
                    {totalPages}
                  </button>
                );
              }

              return pages;
            })()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the shop "{selectedService?.name}"?
              This action cannot be undone and will also delete all associated menu items.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                onClick={handleCancelDelete}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shop Modal */}
      {editModalOpen && (
        <EditServiceModal
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
          serviceId={selectedService?._id}
          shopData={selectedService}
        />
      )}
    </div>
  );
}
