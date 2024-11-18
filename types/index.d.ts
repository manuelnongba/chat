interface Branch {
  branch_id: number;
  created_at?: string;
  messages: Message[] | unknown;
}

interface Message {
  id: number;
  content: string;
  parent_message_id: number;
}

interface Messages {
  branch_id: number;
  created_at?: string;
  messages: Message[];
}

interface FMessages {
  message: {
    message: Message;
    branch_id: number;
  };
  i: number;
}
