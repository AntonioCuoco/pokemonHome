import { useState, useEffect } from 'react';
import './Message.css'

const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);

  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      setMessagesReceived(prevState => prevState.concat([{
        message: data.message,
        username: data.username,
        __createdtime__: data.__createdtime__,
      }]));
    });

    socket.on('fetch_message', (data) => {
      socket.emit('fetch_message');
    })

    socket.on('receive_multi_message', (data) => {
      setMessagesReceived(prevState => prevState.concat(data));
    })
    // Remove event listener on component unmount
    // return () => {
    //   socket.off('receive_message')
    // };
  }, [socket]);

  return (
    <div className="wrapper-messages-container">
      {messagesRecieved.map((msg, i) => (
        <div className="wrapper-message-body" key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'white' }}>{msg.username}</span>
          </div>
          <p style={{ color: 'white' }}>{msg.message}</p>
          <span style={{ color: 'white' }}>
            {msg.__createdtime__}
          </span>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;