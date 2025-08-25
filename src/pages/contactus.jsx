import React, { useState } from "react"
import bgImage from "../assets/bgaboutus.jpg";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div
      className="min-h-screen p-4 md:p-8 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Content with no overlay or effects */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8"></div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-bold text-blue-600 leading-none mb-4">Contact Us</h1>
              <p className="text-gray-800 text-lg font-medium">
                Feel free to use the form or drop us an email. Old fashioned calls work too...
              </p>
            </div>

            <div className="space-y-6">
              {/* Contact Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-800 font-semibold">+91 - 8770222006</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-800 font-semibold">Chankya1@gmail.com</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-800 font-semibold">Indore, Madhya Pradesh</span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="text-gray-800 space-y-2 pt-8"></div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-8 border border-blue-200/50 shadow-xl shadow-blue-200/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Company Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-800 text-sm font-medium mb-2">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-400 rounded-none px-0 py-2 text-gray-800 placeholder:text-gray-500 focus:border-gray-600 focus:outline-none"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-gray-800 text-sm font-medium mb-2">Company</label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-400 rounded-none px-0 py-2 text-gray-800 placeholder:text-gray-500 focus:border-gray-600 focus:outline-none"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Email and Phone Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-800 text-sm font-medium mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-400 rounded-none px-0 py-2 text-gray-800 placeholder:text-gray-500 focus:border-gray-600 focus:outline-none"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-gray-800 text-sm font-medium mb-2">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-400 rounded-none px-0 py-2 text-gray-800 placeholder:text-gray-500 focus:border-gray-600 focus:outline-none"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-2">
                  Want to know more? Drop us a line!
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-400 rounded-none px-0 py-2 text-gray-800 placeholder:text-gray-500 focus:border-gray-600 focus:outline-none resize-none min-h-[100px]"
                  placeholder=""
                />
              </div>

              {/* Send Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-10 py-4 rounded-full flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base hover:from-blue-500 hover:to-blue-700 hover:scale-105 border border-blue-300/30"
                >
                  <span className="text-white">Submit</span>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
      </div>
    </div>
  )
}
