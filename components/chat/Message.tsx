import { createBranch, createMessage } from '@/services/apis/messages';
import { useEffect, useRef, useState } from 'react';
import { GoPencil } from 'react-icons/go';
import Button from '../common/Button';
import { showAlert } from '@/utils/error';

export default function Message({
  messages,
  setSwipeToLast,
  getMessages,
}: MessagesProps) {
  const [messageContent, setMessageContent] = useState<Message[]>(messages);
  const [messageEditIndex, setMessageEditIndex] = useState<number[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) setMessageContent(messages);
  }, [messages, isEditing]);

  useEffect(() => {
    if (messageEndRef?.current) {
      const container = messageEndRef?.current;
      if (isAtBottom) {
        container.scrollTop = container?.scrollHeight;
      }
    }
  }, [messages, isAtBottom]);

  const handleEdit = async (messageID: number, index: number) => {
    const branchPayload = { parent_message_id: messageID };
    const { data, error } = await createBranch(branchPayload);

    if (error) {
      showAlert('error', 'Something went wrong! Try again.');
      return;
    }

    if (data) {
      const messagePayload: IDBMessage = {
        branch_id: data.id,
        content: messageContent[index]?.content,
      };

      const { error } = await createMessage(messagePayload);

      if (error) {
        showAlert('error', 'Something went wrong! Try again.');
        return;
      }
    }

    if (getMessages) getMessages();

    setMessageEditIndex([]);

    setTimeout(() => {
      if (setSwipeToLast) setSwipeToLast(true);
    }, 400);
    setIsEditing(false);
  };

  const handleScroll = () => {
    const container = messageEndRef?.current;
    if (container) {
      setIsAtBottom(
        container.scrollHeight - container.scrollTop === container.clientHeight
      );
    }
  };

  const handleContentChange = (index: number, newContent: string) => {
    setMessageContent((prevMessageContent) =>
      prevMessageContent.map((message, i) =>
        i === index ? { ...message, content: newContent } : message
      )
    );
  };

  return (
    <div
      className="message-container flex flex-col items-end m-5 h-[78vh] overflow-y-auto pr-5"
      ref={messageEndRef}
      onScroll={handleScroll}
    >
      {messages.map((message: Message, index: number) => {
        return (
          <div key={message?.id} className="flex items-center justify-center">
            {messageEditIndex.includes(index) ? (
              <div className="flex flex-col">
                <textarea
                  value={messageContent[index]?.content || ''}
                  onChange={(e) => handleContentChange(index, e?.target?.value)}
                  className="w-full p-2 border rounded-md bg-gray-100 mt-5 focus:outline-none"
                />
                <div className="flex justify-between">
                  <Button
                    text="Cancel"
                    callBack={() => {
                      setMessageEditIndex((messageEditIndex) =>
                        [...messageEditIndex].filter((i) => i !== index)
                      );
                    }}
                    className="mt-2 ml-2 bg-gray-100 px-2 py-1 rounded"
                  />
                  <Button
                    text="Send"
                    callBack={() => handleEdit(message?.id, index)}
                    className="mt-2 bg-[#495057] text-white px-2 py-1 rounded"
                  />
                  {/* <button
                    onClick={() => {
                      setMessageEditIndex((messageEditIndex) =>
                        [...messageEditIndex].filter((i) => i !== index)
                      );
                    }}
                    className="mt-2 ml-2 bg-gray-100 px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEdit(message?.id, index)}
                    className="mt-2 bg-[#495057] text-white px-2 py-1 rounded"
                  >
                    Submit
                  </button> */}
                </div>
              </div>
            ) : (
              <>
                <GoPencil
                  color="black"
                  onClick={() => {
                    setMessageEditIndex((messageEditIndex) => [
                      ...messageEditIndex,
                      index,
                    ]);
                    setIsEditing(true);
                  }}
                  className="cursor-pointer"
                />
                <div className="bg-gray-100 p-2.5 rounded-full m-4">
                  {message?.content}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
