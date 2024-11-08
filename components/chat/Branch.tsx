import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Message from './Message';
import { useEffect, useRef, useState } from 'react';

export default function Branch({
  branches,
  setBranchID,
  getMessages,
}: BranchesProps) {
  const [swipeToLast, setSwipeToLast] = useState(false);
  const swiperRef = useRef<SwiperClass>();

  useEffect(() => {
    if (swipeToLast && swiperRef.current) {
      swiperRef.current.slideTo(branches.length - 1);
      setSwipeToLast(false);
    }
  }, [swipeToLast, branches]);

  return (
    <div>
      {branches?.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            if (setBranchID) setBranchID(branches[swiper?.activeIndex]?.id);
          }}
          onSlideChange={(swiper) => {
            if (setBranchID) setBranchID(branches[swiper?.activeIndex]?.id);
          }}
        >
          {branches.map((branch) => (
            <SwiperSlide key={branch?.id} className="w-full">
              <Message
                messages={branch?.message}
                setSwipeToLast={setSwipeToLast}
                getMessages={getMessages}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <></>
      )}
    </div>
  );
}
