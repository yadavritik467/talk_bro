import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { User } from "./component/interface/interface";
import TypingLoader from "./component/loader/TypingLoader";
import {
  ourConversationFunc,
  sendMessageFunc,
} from "./redux/action/messageAction";
import { logoutSuccess } from "./redux/reducer/userReducer";
import { BACKEND_URL, useAppDispatch, useAppSelector } from "./redux/store";

const Home = () => {
  const socket = useMemo(() => io(BACKEND_URL), []);
  const { user, allUsers, access_token } = useAppSelector(
    (state) => state.user
  );
  const [selectUser, setSelectUser] = useState<User>(allUsers[0]);
  const { ourConversation } = useAppSelector((state) => state.message);

  // socket starts here

  // for voice calling
  const [stream, setStream] = useState<any>(null);
  const [call, setCall] = useState<any>({});
  const [callStart, setCallStart] = useState<boolean>(false);
  const [callAccepted, setCallAccepted] = useState(false);

  const myVideo = useRef<any>();
  const userVideo = useRef<any>();
  const connectionRef = useRef<any>();
  // for message and typing
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      content: string;
      receiverId: number;
      senderId: number;
    }[]
  >([]);

  const [typingEvt, setTypingEvt] = useState<any>({});
  const [userInRooms, setuserInRooms] = useState<number[]>([]);

  const lastMessageRef = useRef<any>(null);

  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages?.length]);

  //  for user connection and messaging

  useEffect(() => {
    socket.on("usersOffline", (userOffline) => {
      setuserInRooms(userOffline);
    });

    return () => {
      socket.emit("userDisconnect", {
        userId: Number(JSON.parse(sessionStorage.getItem("userId") as string)),
      });
      socket.disconnect();
      socket.off("usersOffline");
      socket.off("receiveMessage");
    };
  }, [socket]);

  useEffect(() => {
    if (user) {
      socket.emit("joinRoom", {
        userId: user?.id,
      });
      socket?.on("usersOnline", (userOnline: number[]) => {
        setuserInRooms(userOnline);
      });
      sessionStorage.setItem("userId", JSON.stringify(user?.id));

      socket.on("receiveMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on("receiveTyping", (data) => {
        setTypingEvt(data?.typingInfo);
      });
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }
        });
      socket.on("callIncoming", ({ from, signal }) => {
        console.log("from", from);
        console.log("signal", signal);
        setCall({ isReceivingCall: true, from, signal });
      });
    }
  }, [user, socket]);

  const handleInputMsg = (val: string) => {
    setMessage(val);
    const typingInfo = {
      val,
      me: user,
      myfriend: selectUser,
    };
    socket.emit("startTyping", typingInfo);
  };

  const sendMessage = () => {
    setTypingEvt({});
    socket.emit("startTyping", {});
    if (message.trim()) {
      const messageData = {
        senderId: user?.id as number,
        receiverId: selectUser?.id as number,
        content: message as string,
      };
      socket.emit("sendMessage", messageData);
      setMessages(
        (
          prevMessages: {
            content: string;
            receiverId: number;
            senderId: number;
          }[]
        ) => [...prevMessages, messageData]
      );
      setMessage(""); // Clear the input field
      dispatch(sendMessageFunc(selectUser?.id, message));
    }
  };

  // socket ends here

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!access_token) {
      navigate("/");
    }
  }, [access_token]);

  useEffect(() => {
    if (selectUser?.id) {
      dispatch(ourConversationFunc(selectUser?.id));
    }
  }, [selectUser?.id]);

  useEffect(() => {
    if (ourConversation?.length) {
      setMessages(ourConversation);
    }
  }, [ourConversation?.length]);

  const logOutHandler = () => {
    sessionStorage.removeItem("token");
    dispatch(logoutSuccess());
  };

  const callUser = (idToCall: number) => {
    setCallStart(true);
    const peer = new RTCPeerConnection();

    // Add local stream to the peer connection
    stream.getTracks().forEach((track: any) => peer.addTrack(track, stream));

    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    // ICE candidate exchange
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("sendCandidate", {
          to: idToCall,
          candidate: event.candidate,
        });
      }
    };

    // Create and send an offer
    peer
      .createOffer()
      .then((offer) => peer.setLocalDescription(offer))
      .then(() => {
        socket.emit("callUser", {
          userToCall: idToCall,
          from: user,
          signalData: peer.localDescription,
        });
      });

    // Listen for answer
    socket.on("callAnswered", (signal) => {
      setCallAccepted(true);
      peer.setRemoteDescription(signal);
    });

    // Listen for ICE candidates from the other peer
    socket.on("receiveCandidate", (candidate) => {
      peer.addIceCandidate(candidate);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new RTCPeerConnection();

    // Add local stream to the peer connection
    stream.getTracks().forEach((track: any) => peer.addTrack(track, stream));

    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    // ICE candidate exchange
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("sendCandidate", {
          to: call?.from?.id,
          candidate: event.candidate,
        });
      }
    };

    // Set remote description and create an answer
    peer.setRemoteDescription(call.signal).then(() => {
      peer
        .createAnswer()
        .then((answer) => peer.setLocalDescription(answer))
        .then(() => {
          socket.emit("answerCall", {
            to: call.from?.id,
            signal: peer.localDescription,
          });
        });
    });

    // Listen for ICE candidates from the other peer
    socket.on("receiveCandidate", (candidate) => {
      peer.addIceCandidate(candidate);
    });
    connectionRef.current = peer;
  };

  const haggingUpCall = (friendId: number) => {
    socket.emit("cutCallToFriend", friendId);
    setCallStart(false);
    setCallAccepted(false);
    setCall({});
    // myVideo.current = null;
    // userVideo.current = null;
    connectionRef.current = null;
  };

  useEffect(() => {
    socket.on("receiveCutCall", () => {
      console.log("Call cut received. Cleaning up...");
      setCallStart(false);
      setCallAccepted(false);
      setCall({});
      // if (myVideo.current) myVideo.current = null;
      // if (userVideo.current) userVideo.current = null;
      if (connectionRef.current) connectionRef.current = null;
    });

    return () => {
      socket.off("receiveCutCall"); // Cleanup listener on unmount
    };
  }, [socket]);

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
          <div className="flex items-center gap-4">
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
          </div>
        </header>

        {/* Contact List */}
        <div className="overflow-y-auto lg:h-full h-[calc(100vh-64px)] p-3">
          {allUsers?.map(
            (all, i) =>
              all?.id !== user?.id && (
                <div
                  key={i}
                  className="flex relative items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => {
                    setSelectUser(all);
                    setMessages([]);
                    isSidebarOpen ? toggleSidebar() : null;
                  }}
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
                    <h2 className="text-lg font-semibold">
                      {all?.name}{" "}
                      {import.meta.env.VITE_MODE === "dev" && `id ${all?.id}`}
                    </h2>
                    <p className="text-gray-600">
                      {userInRooms?.includes(all?.id)
                        ? "Iam online "
                        : "Iam Offline"}
                    </p>
                  </div>
                  {(!selectUser ||
                    (selectUser && selectUser?.id !== all?.id)) &&
                  messages?.filter((msg) => msg?.senderId === all?.id)
                    ?.length ? (
                    <div className="absolute w-5 h-5 bg-red-600 rounded-full flex justify-center items-center top-4 right-4">
                      <span className="text-white text-[12px]">
                        {
                          messages?.filter((msg) => msg?.senderId === all?.id)
                            ?.length
                        }{" "}
                      </span>
                    </div>
                  ) : null}
                </div>
              )
          )}
          {/* Add more contacts here */}
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-2 focus:outline-none text-gray-700"
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
      {/* voice calling */}

      <div
        style={{ display: callStart || call?.from ? "flex" : "none" }}
        className="fixed w-full top-0 left-0 h-[100vh] bg-black bg-opacity-20 z-[100] justify-center items-center"
      >
        {callStart ? (
          <div className="w-[500px] relative h-fit py-10 flex flex-col justify-center items-center bg-white rounded-md">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg mb-4">
                <img
                  src={selectUser?.picture}
                  alt={selectUser?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-500 text-sm">Calling...</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {" "}
                {selectUser?.name}{" "}
              </h2>
            </div>
            <div className="flex w-full justify-center gap-4">
              <button
                onClick={() => haggingUpCall(selectUser?.id)}
                className="bg-red-500 text-white px-6 py-3 rounded-full shadow hover:bg-red-600 transition"
              >
                Hang Up
              </button>
            </div>
          </div>
        ) : (
          <div className="w-[500px] relative h-fit py-10 flex flex-col justify-center items-center bg-white rounded-md">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg mb-4">
                <img
                  src={call?.from?.picture}
                  alt={call?.from?.name}
                  className="w-full h-full object-cover"
                />
                <img
                  src={call?.from?.picture}
                  alt={call?.from?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {" "}
                {call?.from?.name}{" "}
              </h2>
              <p className="text-gray-500 text-sm">Incoming Call...</p>
            </div>

            <div className="absolute z-[-5]">
              <video ref={myVideo} autoPlay muted />
              {callAccepted && <video ref={userVideo} autoPlay />}
            </div>

            {call.isReceivingCall && (
              <div className="flex w-full justify-center gap-4">
                <button
                  onClick={() => haggingUpCall(call?.from?.id)}
                  className="bg-red-500 text-white px-6 py-3 rounded-full shadow hover:bg-red-600 transition"
                >
                  Hang Up
                </button>
                {!callAccepted && (
                  <button
                    onClick={answerCall}
                    className="bg-green-500 text-white px-6 py-3 rounded-full shadow hover:bg-green-600 transition"
                  >
                    Answer
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      {selectUser ? (
        <div className="flex-1 flex flex-col h-full lg:h-full">
          {/* Chat Header */}
          <header className="bg-white p-4 text-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl lg:text-2xl font-semibold flex items-center gap-4">
                {userInRooms?.includes(selectUser?.id) ? (
                  <div className="w-4 h-4 rounded-full bg-green-700"></div>
                ) : null}
                {selectUser?.name}
              </h1>
              <button
                onClick={() =>
                  user?.id === 7 || user?.id === 6
                    ? callUser(selectUser?.id)
                    : null
                }
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                >
                  <path d="M15.05 5A5 5 0 0119 8.95M15.05 1A9 9 0 0123 8.94m-1 7.98v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </button>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4" id="chat-messages">
            {/* Incoming Message */}

            {messages
              ?.filter(
                (msg) =>
                  msg?.senderId === selectUser?.id || msg?.senderId === user?.id
              )
              ?.map((msg, index) => (
                <div key={index}>
                  {msg?.senderId !== user?.id ? (
                    <div className="flex mb-4 cursor-pointer">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <img
                          src={selectUser?.picture}
                          alt={selectUser?.name}
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                      <div className="flex max-w-xs lg:max-w-lg bg-gray-200 rounded-lg p-3">
                        <p className="text-gray-700">{msg?.content} </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end mb-4 cursor-pointer">
                      <div className="flex max-w-xs lg:max-w-lg bg-gray-800 text-white rounded-lg p-3">
                        <p>{msg?.content}</p>
                      </div>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                        <img
                          src={user?.picture}
                          alt="My Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            <div ref={lastMessageRef}></div>
            {typingEvt &&
              typingEvt?.val &&
              typingEvt?.me &&
              typingEvt?.myfriend && (
                <>
                  {typingEvt?.me?.id === selectUser?.id ? (
                    <div className="w-full flex gap-4 justify-start ">
                      <img
                        src={typingEvt?.me?.picture}
                        alt={typingEvt?.me?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <TypingLoader />
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
                className="bg-gray-800 text-white px-4 py-2 rounded-md ml-2"
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
