interface BranchesProps {
  message: Message;
  index: number;
  branchID: number;
  setBranchID?: (branchId: number) => void;
  getMessages?: () => void;
  setSwipeToLast?: (state: boolean) => void;
  setMsgIndex?: (index: number) => void;
}

interface MessagesProps {
  getMessages?: () => void;
  setMessages?: (messages: Messages[]) => void;
  setBranchID?: (branchId: number) => void;
  setParentMessageID?: (messageID: number) => void;
  created_at?: string;
  messages: Messages[];
  setInitParentMessageID?: (state: boolean) => void;
}

interface ButtonProps {
  text: string;
  callBack?: () => void;
  className?: string;
}
