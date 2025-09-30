"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

const Navbar2 = () => {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchType, setSearchType] = useState("shots");
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.mobile-menu-container') && !event.target.closest('.hamburger-button')) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Nav items
  const navLinks = [
    { name: "Night Market", href: "/nightmarket" },
    { name: "Shops", href: "/shop" },
    { name: "Menu Items", href: "/menuitems" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!router) return;
    
    if (searchValue.trim()) {
      performSearch(searchValue);
    } else {
      switch (searchType) {
        case "shots":
          router.push(`/nightmarket`);
          break;
        case "blogs":
          router.push(`/menuitems`);
          break;
        case "services":
          router.push(`/shop`);
          break;
        default:
          router.push(`/nightmarket`);
      }
    }
    // Close mobile menu after search
    setMenuOpen(false);
  };

  const performSearch = (query) => {
    if (!router) return;
    const encodedQuery = encodeURIComponent(query.trim());
    switch (searchType) {
      case "shots":
        router.push(`/nightmarket?search=${encodedQuery}`);
        break;
      case "blogs":
        router.push(`/menuitems?search=${encodedQuery}`);
        break;
      case "services":
        router.push(`/shop?search=${encodedQuery}`);
        break;
      default:
        router.push(`/nightmarket?search=${encodedQuery}`);
    }
  };

  const handleLinkClick = (href) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <header className="w-full bg-transparent py-3 px-2 md:px-8 relative">
      {/* Background blur */}
      <div className="fixed z-0 w-40 h-40 left-[-60px] top-[-120px] bg-teal-600/20 rounded-full blur-2xl pointer-events-none" />
      
      <nav className="relative z-10 max-w-screen-2xl mx-auto rounded-2xl bg-white/20 outline outline-1 outline-white flex items-center px-3 sm:px-6 md:px-12 py-3">
        <div className="flex w-full items-center justify-between gap-x-4 md:gap-x-12">
          {/* Left: Logo + Nav Items */}
          <div className="flex items-center gap-x-4 md:gap-x-16 flex-shrink-0">
            {/* Logo */}
            <Link href="/">
              <img src="/logo1.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            </Link>
            
            {/* Nav Items - Desktop Only */}
            <div className="hidden lg:flex items-center gap-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-slate-950 text-base font-semibold font-['Inter',_sans-serif] tracking-wide px-4 py-2 rounded-full transition-all duration-150 cursor-pointer hover:bg-teal-100 hover:text-teal-700 focus:bg-teal-100 focus:text-teal-700"
                >
                  {link.name}
                </Link>
              ))}
              {!loading && user && (
                <Link
                  href="/admin"
                  className="text-slate-950 text-base font-semibold font-['Inter',_sans-serif] tracking-wide px-4 py-2 rounded-full transition-all duration-150 cursor-pointer hover:bg-teal-100 hover:text-teal-700 focus:bg-teal-100 focus:text-teal-700"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Center: Search - Desktop Only */}
          <div className="hidden lg:flex items-center flex-1 max-w-md xl:max-w-lg">
            <form
              className="w-full"
              onSubmit={handleSearchSubmit}
              autoComplete="off"
            >
              <div className="flex items-center border border-gray-400 rounded-2xl bg-white shadow-[0_2px_16px_0_rgba(20,83,45,0.06)] px-2 py-2 h-[48px] w-full ring-1 ring-inset ring-gray-200 transition-all duration-200" style={{ backgroundColor: '#E8F3F3' }}>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="What are you looking for?"
                  className="flex-1 min-w-0 px-3 py-2 text-[#3A3546] text-sm placeholder-[#3A3546] rounded-l-2xl font-inter-regular focus:outline-none bg-[#E8F3F3]"
                  style={{ fontSize: '14px', boxShadow: 'inset 0 1.5px 6px 0 rgba(20,83,45,0.04)' }}
                />
                <div className="relative flex items-center">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="appearance-none bg-transparent border-0 text-[#3A3546] text-sm font-medium pr-6 pl-2 py-2 h-8 focus:outline-none cursor-pointer min-w-[80px] font-inter-regular"
                  >
                    <option value="shots">Night Markets</option>
                   
                    <option value="services">Shops</option>
                     <option value="blogs">Menu Items</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#3A3546]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-black hover:bg-gray-800 transition-all duration-150 ml-2 cursor-pointer shadow-lg focus:outline-none transform hover:scale-105"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 text-white" />
                </button>
              </div>
            </form>
          </div>

          {/* Right: Auth Buttons - Desktop Only */}
          <div className="hidden lg:flex items-center gap-x-4 flex-shrink-0">
            {loading ? null : user ? (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={logout} 
                  className="px-4 py-2 rounded-xl outline outline-1 outline-gray-900 bg-transparent text-slate-950 text-base font-bold font-['Arial'] hover:bg-gray-100 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-4 py-2 rounded-xl outline outline-1 outline-gray-900 bg-transparent text-slate-950 text-base font-bold font-['Arial'] hover:bg-gray-100 transition cursor-pointer">
                    Log in
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 rounded-xl outline outline-1 outline-gray-900 bg-gray-900 text-white text-base font-bold font-['Arial'] hover:bg-gray-800 transition cursor-pointer">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Icon - Mobile/Tablet */}
          <button
            className="lg:hidden ml-auto z-50 relative hamburger-button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-800" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-800" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile/Tablet Menu - Fixed positioning */}
      {isClient && menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="mobile-menu-container fixed top-20 left-2 right-2 bg-white shadow-xl rounded-2xl flex flex-col py-6 gap-4 lg:hidden z-50 border border-gray-200 max-h-[80vh] overflow-y-auto">
            
            {/* Mobile Navigation Links */}
            <div className="flex flex-col items-center gap-3 w-full px-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-slate-950 text-lg font-semibold font-['Inter'] cursor-pointer hover:text-teal-700 transition px-4 py-3 rounded-lg hover:bg-teal-50 w-full text-center border-0 bg-transparent"
                >
                  {link.name}
                </button>
              ))}
              {!loading && user && (
                <button
                  onClick={() => handleLinkClick('/admin')}
                  className="text-slate-950 text-lg font-semibold font-['Inter'] cursor-pointer hover:text-teal-700 transition px-4 py-3 rounded-lg hover:bg-teal-50 w-full text-center border-0 bg-transparent"
                >
                  Admin
                </button>
              )}
            </div>

            {/* Mobile Search - Styled like desktop */}
            <div className="w-full px-4 my-2">
              <form
                className="w-full"
                onSubmit={handleSearchSubmit}
                autoComplete="off"
              >
                <div className="flex items-center border border-gray-400 rounded-2xl bg-white shadow-[0_2px_16px_0_rgba(20,83,45,0.06)] px-2 py-2 h-[48px] w-full ring-1 ring-inset ring-gray-200 transition-all duration-200" style={{ backgroundColor: '#E8F3F3' }}>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="What are you looking for?"
                    className="flex-1 min-w-0 px-3 py-2 text-[#3A3546] text-sm placeholder-[#3A3546] rounded-l-2xl font-inter-regular focus:outline-none bg-[#E8F3F3] pointer-events-auto"
                    style={{ fontSize: '14px', boxShadow: 'inset 0 1.5px 6px 0 rgba(20,83,45,0.04)' }}
                  />
                  <div className="relative flex items-center">
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="appearance-none bg-transparent border-0 text-[#3A3546] text-sm font-medium pr-6 pl-2 py-2 h-8 focus:outline-none cursor-pointer min-w-[80px] font-inter-regular pointer-events-auto"
                    >
                      <option value="shots">Shots</option>
                      <option value="blogs">Blogs</option>
                      <option value="services">Services</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#3A3546]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-black hover:bg-gray-800 transition-all duration-150 ml-2 cursor-pointer shadow-lg focus:outline-none transform hover:scale-105 pointer-events-auto"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col items-center gap-3 w-full px-4">
              {loading ? null : user ? (
                <button 
                  onClick={() => { 
                    setMenuOpen(false); 
                    logout(); 
                  }} 
                  className="w-full px-4 py-3 rounded-xl outline outline-1 outline-gray-900 bg-transparent text-slate-950 text-base font-bold hover:bg-gray-100 transition pointer-events-auto"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => handleLinkClick('/login')}
                    className="w-full px-4 py-3 rounded-xl outline outline-1 outline-gray-900 bg-transparent text-slate-950 text-base font-bold hover:bg-gray-100 transition pointer-events-auto"
                  >
                    Log in
                  </button>
                  <button 
                    onClick={() => handleLinkClick('/signup')}
                    className="w-full px-4 py-3 rounded-xl outline outline-1 outline-gray-900 bg-gray-900 text-white text-base font-bold hover:bg-gray-800 transition cursor-pointer pointer-events-auto"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar2;
