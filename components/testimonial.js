import Link from "next/link";
import React from "react";

const Star = () => (
  <svg
    viewBox="0 0 20 20"
    fill="#FFD700"
    className="w-4 h-4"
    aria-hidden="true"
  >
    <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
  </svg>
);

const testimonials = [
  {
    title: "Found the best shawarma spot in Doha!",
    text: `This platform helped me discover amazing night markets I never knew existed in Qatar. The food prices are clearly listed, and I found the most authentic biryani at Al Wakra Night Market. The shop reviews are incredibly helpful for choosing where to eat. Highly recommend for food lovers!`,
    author: "Ahmed K., Food Blogger",
    company: "Doha Eats",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    stars: 5,
  },
{
  title: "Perfect for finding affordable family meals",
  text: `As an expat family in Qatar, finding good food at reasonable prices was challenging. This app showed us all the night markets near our area with exact menu prices. We discovered Souq Waqif has incredible variety, and the Al Khor market has the best seafood. Save so much money now!`,
  author: "Sarah M., Marketing Manager",
  company: "Qatar Airways",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  stars: 5,
},

  {
    title: "My go-to app for exploring Qatar's food scene",
    text: `I love how easy it is to browse different night markets and see what each shop offers. The search function is fantastic - I can find exactly what I'm craving. Found amazing kunafa at Al Rayyan market and the best grilled meat in Al Wakra. This app is a foodie's dream come true!`,
    author: "Mohammed A., IT Consultant", 
    company: "Qatar Foundation",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    stars: 5,
  },
];

const Testimonial = () => {
  return (
    <div className="w-full px-4 py-12 bg-[#E4F0F0] flex flex-col items-center">
      <div className="max-w-7xl w-full">
        {/* Center-aligned heading */}
        <div className="mb-12 text-center">
          <h2 className="text-gray-900 text-4xl md:text-6xl font-semibold font-['Source_Serif_4'] text-center">
            What Our Users Say
          </h2>
          <p className="text-gray-600 text-lg font-normal font-['Inter'] mt-4 max-w-2xl mx-auto">
            Discover why thousands of food lovers trust us to find the best night markets and local cuisine across Qatar
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="
                flex flex-col justify-between
                bg-white rounded-[10px] backdrop-blur-[10px]
                p-6 md:p-8
                gap-6 shadow-sm border border-gray-100
                w-full
                max-w-[95vw]
                sm:max-w-[500px]
                md:min-w-[400px] md:max-w-[600px]
                lg:min-w-[500px] lg:max-w-[600px]
                flex-1
                hover:shadow-md transition-shadow duration-300
              "
              style={{ minHeight: "320px" }}
            >
              <div className="text-left">
                <h3 className="text-neutral-950 text-xl md:text-2xl font-semibold font-['Inter'] leading-8 mb-4">
                  {t.title}
                </h3>
                <p className="text-neutral-700 text-base font-normal font-['Inter'] leading-relaxed mb-6">
                  {t.text}
                </p>
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 font-medium">
                    {t.stars}.0
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-teal-100">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-neutral-950 text-sm font-semibold font-['Inter']">
                    {t.author}
                  </div>
                  <div className="text-neutral-600 text-xs font-normal font-['Inter']">
                    {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg font-normal font-['Inter'] mb-6">
            Join thousands of food enthusiasts exploring Qatar's vibrant night market scene
          </p>
         <Link href="/nightmarket" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl inline-block text-center">
  Start Exploring Now
</Link>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
