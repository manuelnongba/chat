'use client';
import Chat from '@/components/chat/Chat';
import { getAllMessages } from '@/services/apis/messages';
import { showAlert } from '@/utils/error';
import { useEffect, useState } from 'react';

export default function Home() {
  const [branches, setBranches] = useState<Branch[]>([]);

  const getMessages = async () => {
    const { data, error } = await getAllMessages();

    if (error) {
      showAlert('error', 'Error fetching messages! Try refreshing the page.');
      return;
    }

    if (data) setBranches(data);
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1>ChatGPT 0</h1>
      <Chat branches={branches} getMessages={getMessages} />
    </main>
  );
}
