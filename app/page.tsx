'use client';
import Chat from '@/components/chat/Chat';
import { getAllMessages } from '@/services/apis/messages';
import { showAlert } from '@/utils/error';
import { useEffect, useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<Messages[]>([]);

  const getMessages = async () => {
    const { data, error } = await getAllMessages();

    /* eslint-disable-next-line*/
    const messagesByBranch: Message = data?.reduce((acc: any, row: any) => {
      if (!acc[row.branch_id]) {
        acc[row.branch_id] = [];
      }
      acc[row.branch_id].push({
        id: row.id,
        content: row.content,
        parent_message_id: row.parent_message_id,
      });
      return acc;
    }, {});

    const messagesArray: Messages[] = Object.entries(messagesByBranch).map(
      ([branch_id, messages]) => ({
        branch_id: parseInt(branch_id, 10),
        messages,
      })
    );

    if (error) {
      showAlert('error', 'Error fetching messages! Try refreshing the page.');
      return;
    }

    setMessages(messagesArray);
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 border-b-4 border-orange-400 transform transition-transform duration-200 hover:scale-90">
        ChatGPT
      </h1>
      <Chat
        messages={messages}
        getMessages={getMessages}
        setMessages={setMessages}
      />
    </main>
  );
}
