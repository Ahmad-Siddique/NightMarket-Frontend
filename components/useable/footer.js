

import React from "react";

const socialIcons = [
  {
    name: "Facebook",
    href: "https://facebook.com/qatarnightmarkets",
    svg: (
      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
        <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 4.84 3.66 8.85 8.33 9.77v-6.91H7.9v-2.86h2.43V9.84c0-2.4 1.43-3.73 3.62-3.73 1.05 0 2.15.19 2.15.19v2.36h-1.21c-1.19 0-1.56.74-1.56 1.5v1.8h2.65l-.42 2.86h-2.23v6.91C18.34 20.92 22 16.91 22 12.07z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/qatarnightmarkets",
    svg: (
      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm6.38.62a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/97455555555",
    svg: (
      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@qatarnightmarkets",
    svg: (
      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[#071C1C] text-white px-4 sm:px-8 mt-24">
      <div className="max-w-[1920px] mx-auto px-2 sm:px-6 py-12 md:py-20 flex flex-col gap-10">
        {/* Top Row */}
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Qatar Night Markets Logo"
                className="w-11 h-11 object-contain"
              />
              <div className="text-xl font-bold">Qatar Night Markets</div>
            </div>
            <p className="text-white/60 text-sm text-center md:text-left max-w-xs">
              Discover the best night markets, shops, and authentic cuisine across Qatar
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-6 md:gap-8 items-center justify-center text-sm font-medium text-center w-full">
            {[
              { label: "Night Markets", href: "/nightmarket" },
              { label: "Shops", href: "/shop" },
              { label: "Food Menu", href: "/menuitems" }
              
            ].map((item) => (
              <a 
                key={item.label} 
                href={item.href}
                className="whitespace-nowrap hover:text-teal-300 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end gap-4 items-center w-full md:w-auto">
            {socialIcons.map(({ name, href, svg }) => (
              <a
                key={name}
                href={href}
                aria-label={`Follow us on ${name}`}
                className="hover:opacity-80 hover:scale-110 transition-all duration-200 p-2 hover:bg-white/10 rounded-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                {svg}
              </a>
            ))}
          </div>
        </div>

       
        {/* <div className="w-full border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>gg
              <h4 className="text-white font-semibold mb-3">Contact Info</h4>
              <div className="text-white/60 text-sm space-y-2">
                <p>📧 info@qatarnightmarkets.com</p>
                <p>📞 +974 5555 5555</p>
                <p>📍 Doha, Qatar</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Popular Areas</h4>
              <div className="text-white/60 text-sm space-y-2">
                <p>Souq Waqif</p>
                <p>Al Wakra Market</p>
                <p>Al Khor Night Market</p>
                <p>Al Rayyan Bazaar</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Popular Cuisines</h4>
              <div className="text-white/60 text-sm space-y-2">
                <p>Traditional Qatari</p>
                <p>Middle Eastern</p>
                <p>Indian & Pakistani</p>
                <p>International</p>
              </div>
            </div>
          </div>
        </div>

     */}
       <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 border-t border-white/10 pt-8 text-center">

         
         <div className="flex flex-wrap gap-4 items-center text-white/60 text-sm font-normal justify-center text-center">
            <span>© 2025 All Rights Reserved</span>
            {/* <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a> */}
          </div>
          
        
          {/* <div className="flex flex-wrap gap-4 items-center text-white/60 text-sm font-normal justify-center w-full md:w-auto">
            <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
            <a href="/locations" className="hover:text-white transition-colors">All Locations</a>
            <a href="/cuisines" className="hover:text-white transition-colors">Food Types</a>
            <a href="/help" className="hover:text-white transition-colors">Help Center</a>
          </div> */}
        </div> 
      </div>
    </footer>
  );
};

export default Footer;
