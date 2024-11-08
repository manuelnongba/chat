interface IDBMessage {
  branch_id: number | null;
  content: string;
}

interface IDBBranch {
  parent_message_id?: number | null;
}
