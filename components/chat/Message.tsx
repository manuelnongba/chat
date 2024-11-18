import { useEffect, useRef, useState } from 'react';
import Branch from './Branch';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function Message({
  messages,
  setMessages,
  setParentMessageID,
  getMessages,
  setInitParentMessageID,
}: MessagesProps) {
  const [messagesContent, setMessagesContent] = useState<Messages[]>(messages);
  const [swipeToLast, setSwipeToLast] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const swiperRef = useRef<SwiperClass[]>([]);
  const [swiperIndex, setSwiperIndex] = useState<number>(0);
  const [messages2, setMessages2] = useState<Message[]>([]);
  const [msgIndex, setMsgIndex] = useState<number>(0);

  useEffect(() => {
    if (
      messages?.length > messagesContent?.length ||
      messages[msgIndex]?.messages?.length >
        messagesContent[msgIndex]?.messages?.length
    ) {
      setMessagesContent(messages);
    }
  }, [messages, messagesContent.length, msgIndex, messagesContent]);

  const groupMessagesByBranch = (data: FMessages[]): Messages[] => {
    const grouped: any = {};

    data.forEach((item) => {
      const { branch_id } = item.message;
      const { id, content, parent_message_id } = item.message.message;

      if (!grouped[branch_id]) {
        grouped[branch_id] = {
          branch_id,
          messages: [],
        };
      }

      grouped[branch_id].messages.push({ id, content, parent_message_id });
    });

    return Object.values(grouped);
  };

  const messageBranching = (
    swiperIndex: number,
    messagess: Message[],
    msgIndex: number,
    state: boolean = false
  ) => {
    const activeMessage = messagess
      ?.map((branch) => branch)
      .find((_, index) => index === swiperIndex);

    if (activeMessage) {
      const childMessage = messagesContent
        .flatMap((branch, i) =>
          branch.messages.map((message) => ({
            message: { message, branch_id: branch.branch_id },
            i,
          }))
        )
        .filter(({ message, i }) => {
          if (i <= msgIndex) return message;
        });

      findNext(messages[msgIndex]?.messages[swiperIndex]);
      function findNext(activeMessage: Message) {
        const nextMessage = messagesContent
          .flatMap((branch, i) =>
            branch.messages.map((message) => ({
              message: { message, branch_id: branch.branch_id },
              i,
            }))
          )
          .filter(({ message }) => {
            return message?.message?.parent_message_id === activeMessage?.id;
          });

        if (nextMessage.length > 0) {
          nextMessage.map((message) => childMessage.push(message));
          findNext(nextMessage[0]?.message.message);
        } else return;
      }

      if (setParentMessageID && setInitParentMessageID) {
        setInitParentMessageID(false);
        setParentMessageID(messages[msgIndex]?.messages[swiperIndex].id);
      }

      const res: Messages[] = groupMessagesByBranch(childMessage);

      if (setMessages) setMessages(res);
    }
  };

  useEffect(() => {
    messageBranching(swiperIndex, messages2, msgIndex);
  }, [messagesContent.length, messages.length]);

  useEffect(() => {
    if (messageEndRef?.current) {
      const container = messageEndRef?.current;
      if (isAtBottom) {
        container.scrollTop = container?.scrollHeight;
      }
    }
  }, [isAtBottom]);

  const handleScroll = () => {
    const container = messageEndRef?.current;
    if (container) {
      setIsAtBottom(
        container.scrollHeight - container.scrollTop === container.clientHeight
      );
    }
  };

  const handleSwiper = (
    swiper: SwiperClass,
    messagess: Message[],
    msgIndex: number
  ) => {
    swiperRef.current[msgIndex] = swiper;

    setSwiperIndex(swiper.activeIndex);
    setMessages2(messagess);
    setMsgIndex(msgIndex);
    messageBranching(swiper.activeIndex, messagess, msgIndex);
  };

  const handleSlideChange = (
    swiper: SwiperClass,
    messagess: Message[],
    msgIndex: number
  ) => {
    setSwiperIndex(swiper.activeIndex);
    messageBranching(swiper.activeIndex, messagess, msgIndex, true);
  };

  useEffect(() => {
    if (swipeToLast && swiperRef.current) {
      swiperRef?.current[msgIndex]?.slideTo(messages2.length);
      setSwipeToLast(false);
    }
  }, [
    messagesContent,
    messages.length,
    swipeToLast,
    messages2.length,
    msgIndex,
  ]);

  return (
    <div
      className="message-container flex flex-col items-end m-5 h-[78vh] overflow-y-auto pr-5"
      ref={messageEndRef}
      onScroll={handleScroll}
    >
      {messages.map((branch: Messages, index: number) => {
        return branch.messages.length > 1 ? (
          <div className="w-[600px]" key={index}>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={50}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              onSwiper={(swiper) => {
                handleSwiper(swiper, branch.messages, index);
              }}
              onSlideChange={(swiper: SwiperClass) =>
                handleSlideChange(swiper, branch.messages, index)
              }
              key={index}
            >
              {branch.messages.map((message, i) => (
                <SwiperSlide key={i} className="flex justify-center">
                  <Branch
                    message={message}
                    index={index}
                    branchID={branch.branch_id}
                    getMessages={getMessages}
                    setSwipeToLast={setSwipeToLast}
                    setMsgIndex={setMsgIndex}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <Branch
            message={branch.messages[0]}
            index={index}
            key={index}
            branchID={branch.branch_id}
            getMessages={getMessages}
            setSwipeToLast={setSwipeToLast}
            setMsgIndex={setMsgIndex}
          />
        );
      })}
    </div>
  );
}
