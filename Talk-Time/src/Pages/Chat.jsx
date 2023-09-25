import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uniqBy } from "lodash"
import {
  verifyCookie,
  currentUseremail,
  currentUsername,
  currentUserPhone,
  currentUserid
} from "../utils/authFunctions";
import Loader from "../components/Loader";
import Icon from "../components/Icon";
import Navbar from "../components/Navbar";
import { addNumberUrl, getUserContactUrl, getMessages, getOfflinePeople } from "../routes/apiRoutes";
import { make_request } from "../utils/apiCalling";
import Avatar from "../components/Avatar";
// import Modal from '@material-ui/core/Modal';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const Chat = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'black',
    boxShadow: 24,
    p: 4,
  };
  const navigate = new useNavigate();
  const [load, setLoad] = useState(false);
  const [ws, setWs] = useState(null);
  const [navbar, setNavbar] = useState(false);
  const [addPeopleText, setAddPeopleText] = useState("Add People!");
  const [OnlinePeople, setOnlinePeople] = useState([]);
  const [selectedUserid, setSetselectedUserid] = useState(null)
  const [newMessageText, setNewMessageText] = useState("")
  const [selectedUserPhone, setSelectedUserPhone] = useState(null)
  const [selectedUserName, setselectedUserName] = useState(null)
  const [messages, setMessages] = useState([])
  const messageWithoutDups = uniqBy(messages, '_id')
  const divUnderMessages = useRef();
  const inputMessage = useRef();
  const [offlinePeople, setofflinePeople] = useState([])
  const [open, setopen] = useState(false)
  const [emojiModal, setemojiModal] = useState(false)
  const [modalImgSrc, setModalImgSrc] = useState(null)
  const [emoji, setemoji] = useState([]);
  const handleOpen = (e) => {
    let src = e.target.src;
    setModalImgSrc(src);
    setopen(true);
  }
  const handleClose = () => setopen(false);
  const handleCloseEmoji = () => setemojiModal(false);

  useEffect(() => {
    setTimeout(async () => {
      let a = await verifyCookie("/chat", setLoad, navigate, false, "/");
      let b = await connectToWeb();
    }, 100);
    setLoad(true);
  }, []);
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behaviour: 'smooth' })
    }
  }, [messages])
  useEffect(() => {
    getMessagesAll();
  }, [selectedUserid])

  useEffect(() => {
    const getPeopleOffline = async () => {
      let body = {
        currentUserPhone,
        currentUserid
      }
      const contactResponse = await make_request(body, "POST", getOfflinePeople);
      // console.log(contactResponse.data.contactList)
      // console.log(OnlinePeople)
      const respofflinePeople = contactResponse.data.contactList.filter(p => !OnlinePeople.map(op => op.phone).includes(p.phone))
      // console.log(respofflinePeople)
      setofflinePeople(respofflinePeople)
    }
    setTimeout(() => {
      getPeopleOffline();
    }, 300)
  }, [OnlinePeople])

  const getMessagesAll = async () => {
    // Make a request to node for fetching all the older messages
    let body = {
      selectedUserid,
      selectedUserPhone
    }
    const response = await make_request(body, 'POST', getMessages)
    // console.log(response.data.messages);
    setMessages(response.data.messages)
  }
  const addPeopleOnClick = async () => {
    // console.log("Adding People");
    let number = prompt("Type number to add");
    let cnf = confirm("Confirm adding this number");
    // console.log(number, cnf);
    if (cnf) {
      if (
        number.length > 0 &&
        number.length <= 10 &&
        number.trim().length > 0
      ) {
        let body = {
          number,
          phone: currentUserPhone,
        };
        const response = await make_request(body, "POST", addNumberUrl);
        // console.log(response);
        if (response.status && response.data.status) {
          setAddPeopleText(response.data.message);
          setTimeout(() => {
            setAddPeopleText("Add People!");
          }, 2000);
        } else {
          alert("Try After Some time!!!!!!!!!");
        }
      } else {
        alert("Number Not Valid");
      }
    }
    window.location.reload();
  };

  const connectToWeb = () => {
    const ws = new WebSocket("ws://localhost:3000");
    setWs(ws);
    ws.addEventListener("message", (e) => {
      const serverMessage = JSON.parse(e.data);
      if (serverMessage.status) {
        showOnlinePeople(serverMessage.usersOnline);
      }
      // console.log("The Response should be here")
      // console.log(serverMessage)
      setMessages(prev => ([...prev, { ...serverMessage }]));
    });
    ws.addEventListener("close", () => connectToWeb());
  };
  const showOnlinePeople = async (data) => {
    const uniqueUserIds = new Set();
    const resultArray = [];
    let body = {
      phone: currentUserPhone,
    };
    const response = await make_request(body, "POST", getUserContactUrl);
    for (const item of data) {
      if (item.userId && !uniqueUserIds.has(item.userId)) {
        uniqueUserIds.add(item.userId);
        resultArray.push(item);
      }
    }
    // console.log(response.data.contactList);
    let finalResult = [];
    for (let i = 0; i < resultArray.length; i++) {
      if (response.data.contactList.includes(resultArray[i].phone)) {
        finalResult.push(resultArray[i]);
      }
    }
    // console.log(finalResult)
    setOnlinePeople([...finalResult]);
  };
  const selectUser = (user) => {
    let id = user.userId === undefined ? user._id : user.userId;
    if ((selectedUserid || selectedUserPhone) && (user.id == selectedUserid || user.phone == selectedUserPhone)) {
      setSelectedUserPhone(null);
      setSetselectedUserid(null);
      setselectedUserName(null);
      return;
    }
    setSetselectedUserid(id)
    setSelectedUserPhone(user.phone)
    setselectedUserName(user.username)
    window.scrollTo(0, document.body.scrollHeight, { behaviour: 'smooth' });
  }
  const sendMessage = (e, file = null, isFile = false) => {
    // console.log(file)
    e.preventDefault();
    if (e) e.preventDefault();
    if (newMessageText.trim().length > 0 || isFile) {
      ws.send(JSON.stringify({
        reciever: selectedUserid,
        recieverPhone: selectedUserPhone,
        text: newMessageText,
        senderPhone: currentUserPhone,
        file,
      }))
      if (isFile == false) {
        setNewMessageText("")
        setMessages(prev => ([...prev, { text: newMessageText, senderPhone: currentUserPhone, reciever: selectedUserPhone, _id: Date.now(), createdAt: Date.now() }]))
      }
      else {
        setNewMessageText("");
        setMessages(prev => ([...prev, { text: "", senderPhone: currentUserPhone, reciever: selectedUserPhone, _id: Date.now(), createdAt: Date.now(), filePath: file.data, isImage: true }]))
        // console.log("messages have set")
      }
    }
  }

  const sendAtttachment = (e) => {
    // console.log(e.target.files)
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
      sendMessage(e, {
        name: e.target.files[0].name,
        data: reader.result
      }, true)
    }
  }

  const openEmojiModal = async (e) => {
    console.log(e.target)
    console.log("Yes")
    setemojiModal(true);
    const resp = await fetch('https://emoji-api.com/emojis?access_key=c4921cba2639da64bf33bca829eb37008123fe06')
    const data = await resp.json();
    setemoji(data);
  }

  const addEmojiMess = (e)=>{
    let newText = newMessageText + e.target.textContent;
    setNewMessageText(newText)
  }
  return (
    <>
      {load ? (
        <Loader />
      ) : (
        <div className="p-1 h-screen">
          <Navbar
            currentUserPhone={currentUserPhone}
            currentUseremail={currentUseremail}
            currentUsername={currentUsername}
            navbar={navbar}
            setNavbar={setNavbar}
            addPeopleOnClick={addPeopleOnClick}
            addPeopleText={addPeopleText}
          />
          <div className="flex h-full">
            <div className="bg-zinc-700 w-1/3 p-2 scroll-smooth overflow-y-auto">
              {OnlinePeople.map((people) => (
                <div onClick={() => { selectUser(people) }} className={"border-b border-gray-100 py-2 flex gap-2 items-center cursor-pointer text-white" + (people.userId === selectedUserid ? "bg-blue-100 border-rounded-sm" : "")} key={people.userId}>
                  {people.userId === selectedUserid && (
                    <div className="w-1 h-12 bg-blue-500"></div>
                  )}
                  <Avatar online={true} userid={people.userId} />
                  <span>{people.username}</span>
                </div>
              ))}
              {offlinePeople.map((people) => (
                <div onClick={() => { selectUser(people) }} className={"border-b border-gray-100 py-2 flex gap-2 items-center cursor-pointer text-white" + (people.userId === selectedUserid ? "bg-blue-100 border-rounded-sm" : "")} key={people.userId}>
                  {people._id === selectedUserid && (
                    <div className="w-1 h-12 bg-blue-500"></div>
                  )}
                  <Avatar online={false} userid={people.userId} />
                  <span>{people.username}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col bg-neutral-900 w-2/3 p-2">
              <div className="flex-grow">
                {!selectedUserid && (
                  <div className="flex h-full flex-grow items-center justify-center text-white">
                    <div>&larr; Select Chat to start Chatting</div>
                  </div>
                )}
                {
                  !!selectedUserid && (
                    <div className="relative h-full">
                      <div className="overflow-y-scroll absolute inset-0">
                        {!messageWithoutDups && (
                          <div className="flex h-full flex-grow items-center justify-center text-white">
                            <div>&larr; Loading Your messages.......</div>
                          </div>
                        )}
                        {messageWithoutDups.length == 0 ? <div className="flex h-full flex-grow items-center justify-center text-white">
                          <div>No Messages Found.......  <br /> Quickly Say Hi</div>
                        </div> :
                          messageWithoutDups.map((message => (
                            <div key={Date.now() + Math.random()} className={(message.senderPhone === currentUserPhone ? 'text-right' : 'text-left')}>
                              <div className={"text-left inline-block p-2 my-2 rounded-md text-lg " + (message.senderPhone === currentUserPhone ? 'bg-green-900 text-white mx-3' : 'bg-gray-900 text-white text-gray-500')}>
                                {!message.isImage && (message.text)}
                                {message.isImage ? (
                                  <img className="h-60 w-50 cursor-pointer" onClick={handleOpen} src={message.filePath} />
                                ) : (console.log())}
                                <br />
                                <span className="text-xs">{new Date(message.createdAt).toLocaleString().replace(',', " ")}</span>
                              </div>
                            </div>
                          )))}
                        <div ref={divUnderMessages}></div>
                      </div>
                    </div>
                  )
                }
              </div>
              {!!selectedUserid && (
                <div>
                  <div className="w-full bg-zinc-700 text-white shadow absolute top-2">
                    <div className="justify-between px-4 lg:max-w-7xl md:items-center md:flex md:px-8">
                      <div>
                        <div className="flex items-center justify-between py-3 md:py-5 md:block">
                          <div className="flex gap-6">
                            <span><Avatar online={false} userid={selectedUserid} /></span>
                            <h2 className="text-2xl font-bold">{selectedUserName}</h2>
                            <h2 className="text-2xl font-bold">{selectedUserPhone}</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form className="flex gap-2" onSubmit={sendMessage}>
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => { setNewMessageText(e.target.value) }}
                      placeholder="Type a message"
                      className="rounded-sm bg-white flex-grow border p-2"
                    />
                    <label className="bg-blue-100 p-2 cursor-pointer">
                      <svg onClick={openEmojiModal} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                      </svg>
                    </label>
                    <label className="bg-blue-100 p-2">
                      <input type="file" className="hidden" onChange={sendAtttachment} />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                      </svg>
                    </label>
                    <button className="rounded-sm bg-blue-500 p-2 text-white hover:bg-blue-600">
                      <span>
                        {" "}
                        <Icon />
                      </span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box className="absolute top-5 left-1/3 w-96">
              <img src={modalImgSrc} className="h-96 w-96" />
            </Box>
          </Modal>
          <Modal
            open={emojiModal}
            onClose={handleCloseEmoji}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box className="absolute bottom-24 right-24 w-96 h-56 text-white scroll-smooth overflow-y-auto">
              <div class="grid grid-rows-4 grid-flow-col gap-4">
              {
                  emoji.length === 0 ? <p>Loading Emoji's</p>:
                  emoji.slice(0, 501).map((e, index) => (
                    <div className="cursor-pointer" onClick={addEmojiMess} key={index}>
                     <span className="text-2xl">{e.character}</span>
                    </div>
                  ))
              }
              </div>
            </Box>
          </Modal>
        </div>

      )}
    </>
  );
};

export default Chat;
