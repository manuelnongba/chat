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
      const latestBranch = branches.length - 1;
      swiperRef?.current?.slideTo(latestBranch);
      setSwipeToLast(false);
    }
  }, [swipeToLast, branches]);

  const handleSwiper = (swiper: SwiperClass) => {
    swiperRef.current = swiper;
    if (setBranchID) setBranchID(branches[swiper?.activeIndex]?.id);
  };

  const handleSlideChange = (swiper: SwiperClass) => {
    if (setBranchID) setBranchID(branches[swiper?.activeIndex]?.id);
  };

  return (
    <div>
      {branches?.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
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
