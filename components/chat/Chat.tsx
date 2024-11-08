import { createBranch, createMessage } from '@/libs/apis/messages';
import Branch from './Branch';
import { FormEvent, useState } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';

export default function Chat({ branches, getMessages }: BranchesProps) {
  const [input, setInput] = useState('');
  const [branchID, setBranchID] = useState<number | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const messagePayload = { branch_id: branchID, content: input };

    if (branches.length === 0) {
      const { data, error } = await createBranch();
      console.log(data, error);
      messagePayload.branch_id = data.id;
    }

    if (messagePayload.branch_id) {
      const { data, error } = await createMessage(messagePayload);
      console.log(data, error);
    }
    if (getMessages) getMessages();

    setInput('');
  };

  return (
    <div className="chat-container w-full max-w-6xl mb-20">
      <Branch
        branches={branches}
        setBranchID={setBranchID}
        getMessages={getMessages}
      />
      <div className="w-4/5 p-3 md:p-4 mb-5 bg-[#F4F4F4] rounded-full fixed bottom-0 shadow-lg">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow mr-4 border-none focus:outline-none bg-gray-100"
            placeholder="Message ChatGPT"
          />
          <FaArrowCircleUp size={40} color="gray" opacity={0.5} />
        </form>
      </div>
    </div>
  );
}
