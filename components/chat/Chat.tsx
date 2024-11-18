import { createBranch, createMessage } from '@/services/apis/messages';
import { FormEvent, useEffect, useState } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';
import { showAlert } from '@/utils/error';
import Message from './Message';

export default function Chat({
  messages,
  getMessages,
  setMessages,
}: MessagesProps) {
  const [input, setInput] = useState<string>('');
  const [branchID, setBranchID] = useState<number | null>(null);
  const [parentMessageID, setParentMessageID] = useState<number>();

  useEffect(() => {
    if (messages.length > 0)
      setParentMessageID(messages[messages.length - 1].messages[0].id);
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const messagePayload = { branch_id: branchID, content: input };

    if (!input) {
      showAlert('error', 'Enter a message!');
      return;
    }

    const branchPayload = { parent_message_id: parentMessageID };

    const { data, error } = await createBranch(branchPayload);

    if (error) {
      showAlert('error', 'Something went wrong! Try again.');
      return;
    }
    messagePayload.branch_id = data.id;

    if (messagePayload.branch_id) {
      const { error } = await createMessage(messagePayload);

      if (error) {
        showAlert('error', 'Something went wrong! Try again.');
        return;
      }
    }

    if (getMessages) {
      getMessages();
    }
    setInput('');
  };

  return (
    <div className="chat-container w-full max-w-6xl mb-20">
      {messages.length > 0 && (
        <Message
          messages={messages}
          setBranchID={setBranchID}
          getMessages={getMessages}
          setParentMessageID={setParentMessageID}
          setMessages={setMessages}
        />
      )}
      <div className="w-4/5 p-3 md:p-4 mb-5 bg-[#F4F4F4] rounded-full fixed left-[10%] bottom-0 shadow-lg">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow mr-4 border-none focus:outline-none bg-gray-100"
            placeholder="Message ChatGPT"
          />
          <FaArrowCircleUp
            size={40}
            color="gray"
            opacity={0.5}
            onClick={handleSubmit}
            className="cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
}
