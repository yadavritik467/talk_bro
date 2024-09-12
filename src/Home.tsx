import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { User } from "./component/interface/interface";
import { logoutSuccess } from "./redux/reducer/userReducer";
import { BACKEND_URL, useAppDispatch, useAppSelector } from "./redux/store";
import TypingLoader from "./component/loader/TypingLoader";

const Home = () => {
  const socket = useMemo(() => io(BACKEND_URL), []);
  const { user, allUsers, access_token } = useAppSelector(
    (state) => state.user
  );

  // socket starts here
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [typingEvt, setTypingEvt] = useState<any>({});

  useEffect(() => {
    if (user) {
      socket.emit("joinRoom", { userId: user?.id });
      socket.on("receiveMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on("receiveTyping", (data) => {
        setTypingEvt(data?.typingInfo);
      });
    }
    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [user, socket]);

  const handleInputMsg = (val: string) => {
    setMessage(val);
    const typingInfo = {
      val,
      userId: user?.id,
    };
    socket.emit("startTyping", typingInfo);
  };

  const sendMessage = () => {
    setTypingEvt({});
    socket.emit("startTyping", {});
    if (message.trim()) {
      const messageData = {
        senderId: user?.id,
        receiverId: selectUser?.id,
        content: message,
      };
      socket.emit("sendMessage", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage(""); // Clear the input field
    }
  };

  // socket ends here

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectUser, setSelectUser] = useState<User>(allUsers[0]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!access_token) {
      navigate("/");
    }
  }, [access_token]);

  useEffect(() => {
    setMessages([]);
  }, [selectUser]);

  const logOutHandler = () => {
    sessionStorage.removeItem("token");
    dispatch(logoutSuccess());
  };

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
            onClick={logOutHandler}
            className=" focus:outline-none text-white"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
          </button>
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
              onClick={() => setSelectUser(all)}
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
      {selectUser ? (
        <div className="flex-1 flex flex-col h-full lg:h-full">
          {/* Chat Header */}
          <header className="bg-white p-4 text-gray-700 flex justify-between items-center">
            <h1 className="text-xl lg:text-2xl font-semibold">
              {selectUser?.name}
            </h1>
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

            {messages?.map((msg, index) =>
              msg?.senderId !== user?.id ? (
                <div key={index} className="flex mb-4 cursor-pointer">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                    <img
                      src={selectUser?.picture}
                      alt={selectUser?.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div className="flex max-w-xs lg:max-w-lg bg-white rounded-lg p-3">
                    <p className="text-gray-700">Hey Bob, {msg?.content} </p>
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className="flex justify-end mb-4 cursor-pointer"
                >
                  <div className="flex max-w-xs lg:max-w-lg dark:bg-gray-800 text-white rounded-lg p-3">
                    <p>Hi Alice! {msg?.content}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                    <img
                      src={user?.picture}
                      alt="My Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                </div>
              )
            )}
            {typingEvt && typingEvt?.val && (
              <>
                {typingEvt?.userId !== user?.id ? (
                  <div className="w-full flex gap-4 justify-start ">
                    <img
                      src={user?.picture}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <TypingLoader />
                  </div>
                ) : null}
              </>
            )}
            {typingEvt && typingEvt?.val && (
              <>
                {typingEvt?.userId === user?.id ? (
                  <div className="w-full flex gap-4 justify-end ">
                    <img
                      src={selectUser?.picture}
                      alt={selectUser?.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-300 p-4 w-full">
            <div className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => handleInputMsg(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={sendMessage}
                className="dark:bg-gray-800 text-white px-4 py-2 rounded-md ml-2"
              >
                Send
              </button>
            </div>
          </footer>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4">
            Welcome to Talk Bro! 🥲
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-xl">
            Select a user from the contact list to start chatting. Talk Bro is
            your go-to platform for connecting with friends, discussing ideas,
            and sharing thoughts.
          </p>
          <p className="text-md lg:text-lg text-gray-500 mt-4">
            Start by selecting a contact from the sidebar, or find new friends
            in the contact list. Enjoy chatting!
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
