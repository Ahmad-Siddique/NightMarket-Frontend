"use client";
import React, { useState } from "react";

const faqs = [
  {
    question: "How do you ensure all information is accurate and up-to-date?",
    answer:
      "Our team personally visits and verifies every night market, shop, and menu item before adding them to our platform. We conduct regular site visits to ensure prices, operating hours, and offerings remain current and accurate.",
  },
  {
    question: "How often do you update menu prices and shop information?",
    answer:
      "We update our listings monthly through direct visits and communication with shop owners. Our dedicated team monitors price changes, seasonal menu updates, and any operational changes to maintain the most reliable information.",
  },
  {
    question: "Do you cover all night markets across Qatar?",
    answer:
      "We're continuously expanding our coverage across Qatar. Currently, we feature the most popular night markets in Doha, Al Wakra, Al Khor, and Al Rayyan. We add new locations based on popularity and community requests.",
  },
  {
    question: "How do you choose which shops and food items to feature?",
    answer:
      "Our team carefully selects shops based on food quality, hygiene standards, popularity among locals, and authentic cuisine offerings. We prioritize establishments that represent Qatar's diverse culinary landscape.",
  },
  {
    question: "Can I suggest a night market or shop to be added?",
    answer:
      "Absolutely! We welcome suggestions from our community. Send us recommendations through our contact form, and our team will visit and evaluate the location for potential inclusion in our platform.",
  },
  {
    question: "How do you verify the quality and authenticity of featured shops?",
    answer:
      "Our food experts personally taste-test and evaluate each establishment. We assess food quality, authenticity, cleanliness, service, and value for money before featuring any shop on our platform.",
  },
  {
    question: "Why don't shops manage their own listings?",
    answer:
      "We maintain all listings ourselves to ensure consistent quality, accurate information, and unbiased reviews. This curatorial approach guarantees reliable, trustworthy content that truly represents Qatar's best food experiences.",
  },
  {
    question: "How can I report outdated information or closed shops?",
    answer:
      "Please contact our support team immediately if you notice any outdated information or permanently closed establishments. We prioritize these reports and will verify and update our listings within 48 hours.",
  },
];


const PlusIcon = ({ open }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 20 20"
    fill="none"
    className={`transition-transform duration-300 w-6 h-6 ${
      open ? "rotate-45 text-teal-600" : "text-slate-700"
    }`}
    aria-hidden="true"
  >
    <rect x="9" y="4" width="2" height="12" rx="1" fill="currentColor" />
    <rect x="4" y="9" width="12" height="2" rx="1" fill="currentColor" />
  </svg>
);

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const handleToggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-12 lg:px-16 py-20 bg-white relative overflow-hidden">
      {/* Decorative blurred teal shapes */}
      <div className="absolute left-[-60px] top-[-60px] w-[180px] h-[180px] bg-teal-200 rounded-full blur-3xl opacity-20 z-0" />
      <div className="absolute right-[-80px] bottom-[-80px] w-[220px] h-[220px] bg-teal-100 rounded-full blur-3xl opacity-10 z-0" />
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-slate-950 text-4xl md:text-5xl lg:text-6xl font-bold font-['Source_Serif_4'] mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg font-normal font-['Inter'] max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about discovering Qatar's best night markets, 
            local shops, and authentic cuisine experiences.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mx-auto mt-8"></div>
        </div>

        {/* FAQ Container */}
        <div className="w-full bg-gradient-to-br from-[#E4F0F0] to-[#D8EBEB] rounded-3xl p-8 sm:p-12 md:p-16 shadow-lg border border-teal-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl shadow-sm border border-teal-50 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <button
                  className="w-full flex justify-between items-start px-6 py-6 text-left focus:outline-none  transition-colors hover:bg-teal-25"
                  onClick={() => handleToggle(idx)}
                  aria-expanded={openIdx === idx}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="text-slate-950 text-lg font-semibold font-['Inter'] leading-relaxed flex-1 pr-4">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 mt-1">
                    <PlusIcon open={openIdx === idx} />
                  </span>
                </button>
                
                <div
                  id={`faq-answer-${idx}`}
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIdx === idx 
                      ? "max-h-96 opacity-100" 
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {openIdx === idx && (
                    <div className="px-6 pb-6">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent mb-4"></div>
                      <p className="text-gray-700 text-base font-normal font-['Inter'] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Help Section */}
          {/* <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-teal-100">
              <h3 className="text-slate-950 text-2xl font-bold font-['Inter'] mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 text-base font-normal font-['Inter'] mb-6 max-w-2xl mx-auto">
                Our support team is here to help you discover the best food experiences 
                across Qatar's vibrant night market scene.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Contact Support
                </button>
                <button className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200">
                  Browse Markets
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
