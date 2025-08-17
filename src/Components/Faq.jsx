import React, { useState } from "react";

const faqs = [
  {
    question: "How can I pay for my order?",
    answer: "You can pay securely using Stripe with your credit/debit card or mobile payment."
  },
  {
    question: "Can I leave a review for a product?",
    answer: "Yes! After making a purchase, you can submit your review on the product page."
  },
  {
    question: "Are the vegetables fresh and organic?",
    answer: "Absolutely! We source fresh, organic vegetables directly from trusted local farms."
  },
  {
    question: "What if I have a problem with my order?",
    answer: "You can contact our support team anytime, and we’ll resolve any issues promptly."
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{faq.question}</h3>
              <span>{openIndex === index ? "−" : "+"}</span>
            </div>
            {openIndex === index && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
