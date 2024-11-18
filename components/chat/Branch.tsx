import { useEffect, useState } from 'react';
import Button from '../common/Button';
import { showAlert } from '@/utils/error';
import { createMessage } from '@/services/apis/messages';
import { GoPencil } from 'react-icons/go';

export default function Branch({
  message,
  getMessages,
  index,
  branchID,
  setSwipeToLast,
  setMsgIndex,
}: BranchesProps) {
  const [messageContent, setMessageContent] = useState<Message>(message);
  const [messageEditIndex, setMessageEditIndex] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) setMessageContent(message);
  }, [message, isEditing]);

  const handleContentChange = (index: number, newContent: string) => {
    setMessageContent({ ...messageContent, content: newContent });
  };

  const handleEdit = async () => {
    const messagePayload: IDBMessage = {
      branch_id: branchID,
      content: messageContent?.content,
    };
    const { error } = await createMessage(messagePayload);
    if (error) {
      showAlert('error', 'Something went wrong! Try again.');
      return;
    }

    if (getMessages) getMessages();
    setMessageEditIndex([]);
    setTimeout(() => {
      if (setSwipeToLast) setSwipeToLast(true);
    }, 500);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-end">
      {messageEditIndex?.includes(index) ? (
        <div className="flex flex-col">
          <textarea
            value={messageContent?.content || ''}
            onChange={(e) => handleContentChange(index, e?.target?.value)}
            className="w-full p-2 border rounded-md bg-gray-100 mt-5 focus:outline-none"
          />
          <div className="flex justify-between">
            <Button
              text="Cancel"
              callBack={() => {
                setMessageEditIndex((messageEditIndex) =>
                  [...messageEditIndex].filter((i) => i !== index)
                );
              }}
              className="mt-2 ml-2 bg-gray-100 px-2 py-1 rounded"
            />
            <Button
              text="Send"
              callBack={() => handleEdit()}
              className="mt-2 bg-[#495057] text-white px-2 py-1 rounded"
            />
          </div>
        </div>
      ) : (
        <>
          <GoPencil
            color="gray"
            onClick={() => {
              setMessageEditIndex((messageEditIndex) => [
                ...messageEditIndex,
                index,
              ]);
              setIsEditing(true);
              if (setMsgIndex) {
                setMsgIndex(index);
              }
            }}
            className="cursor-pointer"
          />
          <div className="bg-gray-100 p-2.5 rounded-full m-4 mr-[30px]">
            {message?.content}
          </div>
        </>
      )}
    </div>
  );
}
