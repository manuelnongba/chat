interface BranchesProps {
  branches: Branch[];
  setBranchID?: (branchId: number) => void;
  getMessages?: () => void;
}

interface MessagesProps {
  messages: Message[];
  setSwipeToLast?: (state) => void;
  getMessages?: () => void;
}

interface ButtonProps {
  text: string;
  callBack?: () => void;
  className?: string;
}
