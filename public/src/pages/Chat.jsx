import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  // useEffect(() => {
  //   const getXz = async () => {
  //     if (!localStorage.getItem("chat-app-user")) {
  //       navigate("/login");
  //     } else {
  //       console.log(
  //         "else block local Storage: ",
  //         localStorage.getItem("chat-app-user")
  //       );
  //       setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
  //     }
  //   };
  //   getXz();
  // }, []);

  useEffect(() => {
    const getXz = async () => {
      const userData = localStorage.getItem("chat-app-user");
      if (!userData) {
        // alert("if");
        navigate("/login");
      } else {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser) {
            // alert("else");
            setCurrentUser(parsedUser);
          } else {
            throw new Error("User data is undefined after parsing");
          }
        } catch (error) {
          console.error("Failed to parse user data from localStorage:", error);
          navigate("/login");
        }
        setIsLoaded(true);
      }
    };
    getXz();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const getXy = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    getXy();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={handleChatChange}
          />
          {isLoaded && currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
