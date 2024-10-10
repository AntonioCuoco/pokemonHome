import { useEffect, useState } from 'react'
import InputCustom from '../../components/Input';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import { Button, Dropdown, Modal, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import imgReact from '../../assets/react.svg'
import Messages from '../../components/messageComponent/Message';
import getCurrentTime, { isNil } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import { isNilOnly } from '../../utils/utils';
import './Chat.css'

function Chat() {

  const [valueInput, setValueInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [thirdModalVisible, setThirdModalVisible] = useState(false);
  const [room, setRoom] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const initialOptions = [
    { value: 'PokemonVGC', label: 'Pokemon VGC' },
    { value: 'GeneralChat', label: 'General Chat' },
    { value: 'PokemonTGC', label: 'Pokemon TGC' },
    { value: 'PokemonGo&Unite', label: 'Pokemon Go & Unite' },
  ];
  const initialUserOptions = [];
  const initialPrivateChat = [];
  const [privateChat, setPrivateChat] = useState('');
  const [roomOptions, setRoomOptions] = useState(initialOptions);
  const [userOptions, setUserOptions] = useState(initialUserOptions);
  const [privateChatOptions, setPrivateChatOptions] = useState(initialPrivateChat);
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState('');
  const username = isNil(useSelector((state) => state.auth.name)) ? sessionStorage.getItem('name') : useSelector((state) => state.auth.name);
  const email = isNil(useSelector((state) => state.auth.email)) ? sessionStorage.getItem('email') : useSelector((state) => state.auth.email);
  const socket = io.connect("http://localhost:3000");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      console.log(data);
      setUser(data);
      console.log(user);
    });
  }, [socket]);

  useEffect(() => {
    (async function () {
      getAllUser();
      getPrivateUser();
    })();
  }, [])

  const getAllUser = async () => {
    const allUser = await axios.get('http://localhost:3000/getAllUser');
    for (const ithUser of allUser.data) {
      initialUserOptions.push({
        label: `${ithUser.name}`,
        value: ithUser.email
      });
    }
  }

  const getPrivateUser = async () => {
    // const allUser = await axios.get('http://localhost:3000/getAllUser');
    // for (const ithUser of allUser.data) {
    //   initialUserOptions.push({
    //     label: `${ithUser.name}`,
    //     value: ithUser.email
    //   });
    // }

    const allPrivateChat = await axios.post('http://localhost:3000/getAllPrivateChat', { email: email });
    for (const ithPrivateChat of allPrivateChat.data) {
      // initialPrivateChat.push({
      //   label: ithPrivateChat.chatName,
      //   value: ithPrivateChat.chatName
      // });
      setPrivateChatOptions(prevData => [...prevData, { label: ithPrivateChat.chatName, value: ithPrivateChat.chatName }]);
    }
  }



  const disconnectUser = () => {
    socket.emit('userLeave', { email: email });
    socket.emit('retrieveAllUser', { room: isNil(room) ? privateChat : room });
    navigate('/');
  };

  const handleCreatePrivateChat = async () => {
    const userToDisplay = await axios.post('http://localhost:3000/createPrivateChat', { selectedUser: selectedUser, actualEmail: email });
    setUser(userToDisplay.data);
    setModalVisible(false);
    setSecondModalVisible(false);
  }

  const joinRoom = async () => {
    if (room !== '' && username !== '') {
      socket.emit('join_room', { username, room, email });
    }
    if (privateChat !== '' && username !== '') {
      // socket.emit('join_room', { username, room: privateChat, email });
      const user = await axios.post('http://localhost:3000/getUserByUserKey', { nameChat: privateChat });
      setUser(user.data);
    }
    setModalVisible(false);
  }

  function connectSocket() {
    socket.on('connection', (socket) => {
      console.log("the user with id: ", socket.id);
    })
  }

  useEffect(() => {
    connectSocket();
    setModalVisible(true);
  }, [])

  const handleRoomInput = (value) => {
    setRoom(value);
  };

  const handleSelectedUser = (value) => {
    setSelectedUser(value);
  };

  const handlePrivateChat = (value) => {
    setPrivateChat(value);
  };

  const openModal = () => {
    setModalVisible(false);
    setSecondModalVisible(true);
  }

  const handleInput = (e) => {
    setMessage(e.target.value);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleCancelTwo = () => {
    setSecondModalVisible(false);
  };

  const handleCancelThree = () => {
    setThirdModalVisible(false);
  };

  const sendMessage = () => {
    if (message !== '') {
      const __createdtime__ = getCurrentTime();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit('send_message', { username, room, message, __createdtime__ });
      setMessage('');
    }
  };

  return (
    <div className='wrapper-app'>
      <Modal
        title="Scegli la stanza pubblica"
        open={modalVisible}
        onOk={() => joinRoom()}
        onCancel={handleCancel}
        className='wrapper-modal'
      >
        <Select
          options={roomOptions}
          value={room}
          onChange={(value) => handleRoomInput(value)}
          placeholder={"enter a room"}
          className='selection-input'
        />
        <h1 style={{ fontWeight: 'bold' }}>OR</h1>
        <h1 style={{ fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: 'rgba(0, 0, 0, 0.88)' }}>Scegli la private chat:</h1>
        <Select
          options={privateChatOptions}
          value={privateChat}
          onChange={(value) => handlePrivateChat(value)}
          className='selection-input'
        />
        <h1 style={{ fontWeight: 'bold' }}>OR</h1>
        <button style={{ marginTop: 16 }} onClick={() => openModal()}>Start a Private Chat</button>
      </Modal>
      <Modal
        title="Scegli gli utenti della chat"
        open={secondModalVisible}
        onOk={() => handleCreatePrivateChat()}
        onCancel={handleCancelTwo}
        className='wrapper-modal-two'
      >
        <Select
          mode="multiple"
          options={userOptions}
          value={selectedUser}
          onChange={(value) => handleSelectedUser(value)}
          placeholder={"choice a user"}
          className='selection-input'
        />
      </Modal>
      <div className='wrapper-user-chat'>
        <h2 style={{ color: 'white' }}>Message From User</h2>
        {
          user.map((ithItem) => {
            return <div className='chat-component'>
              {isNil(ithItem.photo) ?
                <div className='img-profile-pic' onClick={(e) => e.preventDefault()}></div> :
                <img src={ithItem.photo} className='img-profile-pic' onClick={(e) => e.preventDefault()} />}
              <p style={{ color: 'white' }}>{ithItem.name}</p>
              {ithItem.isOnline ? <div className='img-online'></div> : <div className='img-offline'></div>}
            </div>
          })
        }
        <div className='btn-container-socket'>
          <Button onClick={() => disconnectUser()}>Leave Room</Button>
          <Button onClick={() => disconnectUser()} style={{ marginRight: 16 }}>Close The Chat</Button>
        </div>
      </div>
      <div className='wrapper-chat-message'>
        <div className='wrapper-chat'>
          <div className='online-component'>
            <img src={imgReact} />
            <p style={{ color: 'white', marginLeft: 8 }}>{user.length} Online</p>
          </div>
          <Messages socket={socket} />
        </div>
        <div className='wrapper-input'>
          <InputCustom placeholder={"enter a message"} handleInput={(e) => handleInput(e)} value={message} />
          <Button className='btn-send-message' onClick={() => sendMessage()}>Invia</Button>
        </div>
      </div>

    </div>
  )
}

export default Chat
