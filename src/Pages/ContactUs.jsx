import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import Lottie from "lottie-react";
import animationData from "../assets/lottie.json";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";

const ContactUs = () => {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_xeh8bjb",
        "template_ck5iajv",
        formRef.current,
        "ONLu40KkmqfmJNn2E"
      )
      .then(
        (result) => {
          console.log("✅ Email sent:", result.text);
          toast.success("Your message has been sent successfully!");
          formRef.current.reset();
        },
        (error) => {
          console.error("❌ Email error:", error.text);
          toast.error("Failed to send the message. Please try again.");
        }
      );
  };

  return (
    <div id="contact" className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-12">
        {/* Animation */}
        <div className="flex-shrink-0">
          <div className="w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] mx-auto">
            <Lottie animationData={animationData} loop />
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5 text-gray-800">
            Get in Touch
          </h2>
          <form ref={formRef} onSubmit={sendEmail} className="space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                name="user_name"
                placeholder="Enter your name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="user_email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Write your message..."
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-500 transition duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Contact Info */}
      
    </div>
  );
};

export default ContactUs;
