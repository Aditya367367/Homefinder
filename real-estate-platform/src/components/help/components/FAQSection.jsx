import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I list my property?",
    answer: "Go to your dashboard > 'List Property' and fill in the required property details, upload images, and submit the form.",
  },
  {
    question: "Can I edit my listing later?",
    answer: "Yes, log into your account, go to 'My Listings' on your dashboard, and click 'Edit' on the property you want to modify.",
  },
  {
    question: "How do I reset my password?",
    answer: "On the login page, click 'Forgot Password'. Enter your registered email, and you'll receive a reset link.",
  },
  {
    question: "How do I contact support?",
    answer: "Scroll to the footer and click on 'Contact Us' or use the support form on the Help page.",
  },
];

const FAQSection = ({ query = "" }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {filteredFaqs.length === 0 ? (
        <p className="text-gray-500 text-sm">No results found for "{query}"</p>
      ) : (
        filteredFaqs.map((faq, index) => (
          <div key={index} className="bg-[#1f2227] p-4 rounded-md border border-gray-700">
            <button
              onClick={() => toggle(index)}
              className="flex justify-between items-center w-full text-left text-white font-medium"
            >
              <span>{faq.question}</span>
              {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
            </button>
            {activeIndex === index && (
              <p className="mt-2 text-sm text-gray-400 transition-all duration-300 ease-in-out">
                {faq.answer}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FAQSection;
