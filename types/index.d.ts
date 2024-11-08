interface Branch {
  id: number;
  created_at: string;
  message: Message[];
}

interface Message {
  id: number;
  content: string;
}
