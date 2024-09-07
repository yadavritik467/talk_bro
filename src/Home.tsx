import { useState } from "react";
import { useAppSelector } from "./redux/store";

const Home = () => {
  const { user, allUsers } = useAppSelector((state) => state.user);

  // State to control sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar for mobile devices
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`lg:w-1/4 w-full lg:block bg-white border-r border-gray-300 lg:h-full fixed lg:relative z-20 transform lg:transform-none transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-800 text-white">
          <h1 className="text-xl lg:text-2xl font-semibold">Talk Bro 🥲</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden focus:outline-none text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        {/* Contact List */}
        <div className="overflow-y-auto lg:h-full h-[calc(100vh-64px)] p-3">
          {allUsers?.map((all, i) => (
            <div
              key={i}
              className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                <img
                  loading="lazy"
                  src={all?.picture}
                  alt={all?.name}
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{all?.name}</h2>
                <p className="text-gray-600">Hoorayy!!</p>
              </div>
            </div>
          ))}
          {/* Add more contacts here */}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full lg:h-full">
        {/* Chat Header */}
        <header className="bg-white p-4 text-gray-700 flex justify-between items-center">
          <h1 className="text-xl lg:text-2xl font-semibold">Alice</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden focus:outline-none text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Incoming Message */}
          <div className="flex mb-4 cursor-pointer">
            <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
              <img
                src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div className="flex max-w-xs lg:max-w-lg bg-white rounded-lg p-3">
              <p className="text-gray-700">Hey Bob, how's it going?</p>
            </div>
          </div>

          {/* Outgoing Message */}
          <div className="flex justify-end mb-4 cursor-pointer">
            <div className="flex max-w-xs lg:max-w-lg dark:bg-gray-800 text-white rounded-lg p-3">
              <p>
                Hi Alice! I'm good, just finished a great book. How about you?
              </p>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
              <img
                src={user?.picture}
                alt="My Avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-300 p-4 w-full">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button className="dark:bg-gray-800 text-white px-4 py-2 rounded-md ml-2">
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
