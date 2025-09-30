"use client";
import React from "react";

const BlogDescription = ({ blog }) => {
  // Handle direct menu item object (not wrapped in success/data/blog)
  if (!blog || !blog.name) {
    return (
      <div className="w-full px-2 sm:px-4 md:px-8 py-6 flex justify-center">
        <div className="w-full max-w-[1440px] flex flex-col gap-10">
          <div className="w-full p-6 sm:p-10 bg-slate-50 rounded-[20px] flex flex-col gap-5">
            <div className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold font-['Inter']">
              Menu Item Not Found
            </div>
          </div>
        </div>
      </div>
    );
  }

  const b = blog; // Direct access since it's not wrapped
  const shop = b.shop || {}; // Shop information

  const formatPrice = (price) => {
    return `Rs. ${price?.toLocaleString() || '0'}`;
  };

  const handleOrderClick = () => {
    if (shop.contact?.whatsapp) {
      const phone = shop.contact.whatsapp.replace(/\s+/g, '').replace(/^\+/, '');
      const message = `Hi! I'd like to order ${b.name} (${formatPrice(b.price)}) from ${shop.name}. Please let me know the availability and pickup/delivery details.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      alert('WhatsApp contact not available for this shop.');
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-8 py-6 flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-[1200px] flex flex-col gap-8">
        {/* Header Section - Menu Item Card Style */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Menu Item Image */}
          <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-br from-orange-100 to-red-100">
            {b.image ? (
              <img
                src={b.image}
                alt={b.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 3c0-1.1.9-2 2-2s2 .9 2 2-1.3 2.9-2 2.9S12 4.1 12 3z"/>
                    <path d="M19 21v-4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"/>
                  </svg>
                  <p className="mt-2 text-lg">Menu Item</p>
                </div>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              {b.category || 'Food'}
            </div>

            {/* Price Badge - Top Right */}
            <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
              {formatPrice(b.price)}
            </div>
          </div>

          {/* Menu Item Details */}
          <div className="p-6 sm:p-8">
            {/* Title with Price */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  <span className="text-green-600 mr-3">{formatPrice(b.price)}</span>
                  {b.name}
                </h1>
                <p className="text-lg text-gray-600 mb-3">
                  {b.description || "A delicious menu item prepared with care and fresh ingredients."}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                    {shop.name}
                  </span>
                  <span>•</span>
                  <span>{b.category || 'Food'}</span>
                  <span>•</span>
                  <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Order Button */}
              {shop.contact?.whatsapp && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleOrderClick}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-colors flex items-center gap-3 shadow-lg min-w-[180px]"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                    </svg>
                    Order Now
                  </button>
                  <p className="text-xs text-gray-500 text-center">Quick WhatsApp order</p>
                </div>
              )}
            </div>

            {/* Shop Info Bar */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 flex-1">
                {shop.images && shop.images[0] ? (
                  <img
                    src={shop.images[0]}
                    alt={shop.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">{shop.name}</h4>
                  <p className="text-sm text-gray-600">
                    {shop.location?.stallNumber ? `Stall ${shop.location.stallNumber.trim()}` : 'Restaurant'}
                  </p>
                </div>
              </div>
              <a
                href={`/shop/view/${shop.slug}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                View Shop
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-600">
                  <path d="M12 3c0-1.1.9-2 2-2s2 .9 2 2-1.3 2.9-2 2.9S12 4.1 12 3z"/>
                  <path d="M19 21v-4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"/>
                </svg>
                Item Details
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {b.description || `${b.name} is a signature item from ${shop.name}. Made with fresh ingredients and prepared with care, this delicious ${b.category?.toLowerCase() || 'dish'} is sure to satisfy your cravings.`}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      <h4 className="font-semibold text-gray-900">Price</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{formatPrice(b.price)}</p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-600">
                        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                      </svg>
                      <h4 className="font-semibold text-gray-900">Category</h4>
                    </div>
                    <p className="text-lg font-medium text-orange-600">{b.category || 'Food'}</p>
                  </div>
                </div>

                {/* Order Section */}
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Order</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <p className="font-medium text-gray-900">Click "Order Now"</p>
                        <p className="text-sm text-gray-600">Opens WhatsApp with pre-filled message</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <p className="font-medium text-gray-900">Contact {shop.name}</p>
                        <p className="text-sm text-gray-600">Confirm availability and pickup/delivery</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <p className="font-medium text-gray-900">Enjoy your meal!</p>
                        <p className="text-sm text-gray-600">Fresh and delicious, just for you</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Shop & Contact Info */}
          <div className="space-y-6">
            {/* Shop Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                {shop.images && shop.images[0] ? (
                  <img
                    src={shop.images[0]}
                    alt={shop.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{shop.name}</h3>
                  {shop.location?.stallNumber && (
                    <p className="text-sm text-blue-600 font-medium">
                      Stall {shop.location.stallNumber.trim()}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                {shop.description || "A popular restaurant known for delicious food and excellent service."}
              </p>

              {/* Contact Quick Actions */}
              <div className="space-y-3">
                {shop.contact?.whatsapp && (
                  <a
                    href={`https://wa.me/${shop.contact.whatsapp.replace(/\s+/g, '').replace(/^\+/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}

                {shop.contact?.phone && (
                  <a
                    href={`tel:${shop.contact.phone.trim()}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Call Now
                  </a>

                  
                )}

                  <a
                  href={`/shop/view/${shop.slug}`}
                 className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"

                >
                  Visit Full Shop
                </a>
                
              </div>

              {/* Social Media */}
              {(shop.socialMedia?.facebook || shop.socialMedia?.instagram || shop.socialMedia?.tiktok || shop.socialMedia?.website) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Follow {shop.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {shop.socialMedia?.facebook && (
                      <a
                        href={shop.socialMedia.facebook.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Facebook
                      </a>
                    )}
                    {shop.socialMedia?.instagram && (
                      <a
                        href={shop.socialMedia.instagram.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {shop.socialMedia?.tiktok && (
                      <a
                        href={shop.socialMedia.tiktok.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        TikTok
                      </a>
                    )}
                    {shop.socialMedia?.website && (
                      <a
                        href={shop.socialMedia.website.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Popular Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Popular Categories</h4>
              <div className="space-y-2">
                {[
                  "Burgers",
                  "Pizza",
                  "Sandwiches",
                  "Beverages",
                  "Desserts",
                  "Fast Food"
                ].map((cat) => (
                  <a
                    key={cat}
                    href={`/menuitems?search=${encodeURIComponent(cat)}`}
                    className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDescription;
