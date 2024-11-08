interface Branch {
  id: number;
  created_at: string;

  message: Message[];
}

interface BranchesProps {
  branches: Branch[];
  setBranchID?: (branchId: number) => void;
  getMessages?: () => void;
}

interface Messages {
  messages: Message[];
  setSwipeToLast?: (state) => void;
  getMessages?: () => void;
}

interface Message {
  id: number;
  content: string;
}

interface IDBMessage {
  branch_id: number | null;
  content: string;
}

interface IDBBranch {
  parent_message_id?: number | null;
}
