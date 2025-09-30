"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import EditShotModal from "./EditShotModal";

export default function AllShotsAdmin({
  shots = {},
  totalPages = 1,
  currentPage = 1,
  searchQuery = "",
}) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedShot, setSelectedShot] = useState(null);
  const [search, setSearch] = useState(searchQuery);
  const [deleting, setDeleting] = useState(false);

  // Extract the actual data array from the shots object
  const nightMarkets = shots || [];
  const actualTotalPages = shots?.data?.totalPages || totalPages;
  const actualCurrentPage = shots?.data?.page || currentPage;

  // Open confirmation modal for delete
  const handleDeleteClick = (nightMarket) => {
    setSelectedShot(nightMarket);
    setDeleteModalOpen(true);
  };

  // Confirm deletion with API call
  const handleConfirmDelete = async () => {
    if (deleting) return;
    setDeleting(true);

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/nightmarkets/${selectedShot._id}`,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 204) {
        setDeleteModalOpen(false);
        setSelectedShot(null);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        throw new Error("Failed to delete night market");
      }
    } catch (err) {
      console.error("Error deleting night market:", err);
      alert("Error: " + (err.response?.data?.message || err.message || "Failed to delete night market"));
    } finally {
      setDeleting(false);
    }
  };

  // Close delete modal
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedShot(null);
  };

  // Open edit modal immediately
  const handleEditClick = (nightMarket) => {
    setSelectedShot(nightMarket);
    setEditModalOpen(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedShot(null);
  };

  // Handle search input change and update URL
  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    router.replace(`/admin/nightmarkets?search=${encodeURIComponent(newSearch)}&page=1`);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    router.push(
      `/admin/nightmarkets?search=${encodeURIComponent(search)}&page=${newPage}`
    );
  };

  // Handle create night market button click
  const handleCreateNightMarketClick = () => {
    router.push("/nightmarket/add");
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Night Markets Management
        </h1>
        <button
          onClick={handleCreateNightMarketClick}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer text-sm font-medium"
        >
          Create Night Market
        </button>
      </div>

      {/* Search Field */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search night markets..."
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-64 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Debug Info - Remove in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
          <p>Total Night Markets: {nightMarkets.length}</p>
          <p>Current Page: {actualCurrentPage}</p>
          <p>Total Pages: {actualTotalPages}</p>
        </div>
      )} */}

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
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
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
              {nightMarkets.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No night markets found.
                  </td>
                </tr>
              ) : (
                nightMarkets.map((nightMarket) => (
                  <tr
                    key={nightMarket._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={nightMarket.images?.[0] || 'https://via.placeholder.com/48x48?text=No+Image'}
                        alt={nightMarket.name}
                        className="h-12 w-12 rounded-md object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {nightMarket.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {nightMarket.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {nightMarket.description?.trim() || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {nightMarket.location?.address?.trim() || 'No address'}
                      </div>
                      {nightMarket.location?.coordinates && (
                        <div className="text-xs text-gray-400">
                          {nightMarket.location.coordinates.lat?.toFixed(4)}, {nightMarket.location.coordinates.lng?.toFixed(4)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(nightMarket.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <a
                          href={`/nightmarket/view/${nightMarket.slug}`}
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
                            handleEditClick(nightMarket);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(nightMarket);
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

      {/* Pagination Controls */}
      {actualTotalPages > 1 && (
        <div className="mt-6 flex flex-col items-center sm:flex-row sm:justify-between">
          <span className="text-gray-500 text-sm mb-2 sm:mb-0">
            Page {actualCurrentPage} of {actualTotalPages} 
            ({shots?.data?.totalResults || nightMarkets.length} total results)
          </span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(actualCurrentPage - 1)}
              disabled={actualCurrentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            
            {/* Page Numbers - Smart pagination for many pages */}
            {(() => {
              const pages = [];
              const showPages = 5; // Show 5 page numbers at most
              let startPage = Math.max(1, actualCurrentPage - Math.floor(showPages / 2));
              let endPage = Math.min(actualTotalPages, startPage + showPages - 1);
              
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
                      actualCurrentPage === i
                        ? "bg-gray-900 text-white"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    {i}
                  </button>
                );
              }

              // Add ellipsis and last page if needed
              if (endPage < actualTotalPages) {
                if (endPage < actualTotalPages - 1) {
                  pages.push(
                    <span key="ellipsis-end" className="px-2 py-1 text-gray-500 text-sm">
                      ...
                    </span>
                  );
                }
                pages.push(
                  <button
                    key={actualTotalPages}
                    onClick={() => handlePageChange(actualTotalPages)}
                    className="px-3 py-1 bg-gray-200 text-gray-900 hover:bg-gray-300 rounded-md transition-colors text-sm"
                  >
                    {actualTotalPages}
                  </button>
                );
              }

              return pages;
            })()}

            <button
              onClick={() => handlePageChange(actualCurrentPage + 1)}
              disabled={actualCurrentPage === actualTotalPages}
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
              Are you sure you want to delete the night market "{selectedShot?.name}"?
              This action cannot be undone and will also delete all associated shops and menu items.
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

      {/* Edit Night Market Modal */}
      {editModalOpen && (
        <EditShotModal
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
          shotId={selectedShot?._id}
          nightMarketData={selectedShot}
        />
      )}
    </div>
  );
}
