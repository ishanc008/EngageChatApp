import React, { useState } from "react";

import ScrollToBottom from "react-scroll-to-bottom";
import Message from "./Message/Message";
import { Spin } from "antd";

import "./messages.css";

const Messages = ({
  messages,
  id,
  setMessagesArray,
  setReportMessage,
  report,
  bannedUsers
}) => {
  const handleOnDelete = async ({ message_id }) => {
    setMessagesArray({ message_id });
  };

  return (
    <ScrollToBottom className="messages">
      {!messages.length ? (
        <Spin />
      ) : (
        messages.map((message, i) => {
          let isPrevSenderSame = false;
          if (i !== 0) {
            if (messages[i - 1].id === message.id) {
              isPrevSenderSame = true;
            }
          }
          return (
            <div key={i}>
              <Message
                index={i}
                message={message}
                id={id}
                deleteMessage={handleOnDelete}
                isPrevSenderSame={isPrevSenderSame}
                setReportMessage={setReportMessage}
                report={report}
                bannedUsers={bannedUsers}
              />
            </div>
          );
        })
      )}
    </ScrollToBottom>
  );
};

export default Messages;
