'use client';

import { Great_Vibes, Dancing_Script, Playfair_Display } from 'next/font/google';
import { useEffect, useState, useRef } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";

// --- CẤU HÌNH FONT CHUẨN NEXTJS ---
const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const dancingScript = Dancing_Script({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});

// --- COMPONENT NHỎ ĐƯỢC ĐƯA RA NGOÀI ĐỂ TRÁNH RE-RENDER ---
const TimeUnit = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm border border-stone-200 rounded-lg w-16 py-2 shadow-sm">
    <span className="text-xl font-bold text-[#8b0000]">{value}</span>
    <span className="text-[10px] uppercase tracking-tighter text-gray-500">{label}</span>
  </div>
);

// --- COMPONENT ĐẾM NGƯỢC ---
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date("2026-08-11T09:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-3 my-8" data-aos="fade-up">
      <TimeUnit value={timeLeft.days} label="Ngày" />
      <TimeUnit value={timeLeft.hours} label="Giờ" />
      <TimeUnit value={timeLeft.minutes} label="Phút" />
      <TimeUnit value={timeLeft.seconds} label="Giây" />
    </div>
  );
};

// --- COMPONENT HIỆU ỨNG TIM RƠI ---
const FallingEffects = () => {
  const [hearts, setHearts] = useState<Array<{ id: number, left: string, size: number, duration: number, delay: number }>>([]);

  useEffect(() => {
    const generatedHearts = [...Array(15)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 10 + 10,
      duration: Math.random() * 5 + 8,
      delay: Math.random() * 5
    }));
    setHearts(generatedHearts);
  }, []);

  if (hearts.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute"
          style={{
            left: heart.left,
            top: `-30px`,
            animation: `fall-sway ${heart.duration}s linear infinite`,
            animationDelay: `${heart.delay}s`,
            opacity: 0.8,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-heart.png" style={{ width: `${heart.size}px`, height: 'auto' }} alt="heart" />
        </div>
      ))}
    </div>
  );
};

export default function WeddingInvitation() {
  // --- 1. QUẢN LÝ TRẠNG THÁI ---
  const [isOpened, setIsOpened] = useState(false); // Trạng thái màn hình Welcome
  const [showRSVP, setShowRSVP] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Trạng thái nhạc
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    attending: 'yes',
    message: ''
  });

  // Khởi tạo AOS
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  // --- 2. LOGIC NHẠC VÀ MỞ THIỆP ---
  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Lỗi bật nhạc:", err));
    }
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Lỗi bật nhạc:", err));
      }
    }
  };

  // --- 3. GỬI RSVP ---
  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4aLTKC5U43GI_OP03Gt9VnRq2fQEijGUjQU0XecnbRGyceFkQaLyur2jrj2gZF5Bn/exec';

    try {
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('relation', formData.relation);
      params.append('attending', formData.attending);
      params.append('message', formData.message);

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: params,
      });

      alert('Cảm ơn bạn! Thông tin đã được gửi đến Dâu & Rể.');
      setShowRSVP(false);
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-[#f4f4f4] min-h-screen flex justify-center p-0 md:p-4 font-sans text-gray-800 relative ${playfair.className}`}>
      <audio ref={audioRef} src="/wedding-music.mp3" loop preload="auto" />

      {/* --- MÀN HÌNH WELCOME OVERLAY (BẮT BUỘC BẤM ĐỂ PHÁT NHẠC) --- */}
      {!isOpened && (
        <div className="fixed inset-0 z-[999] bg-[#fdfcfb] flex flex-col items-center justify-center p-6 transition-opacity duration-500">
          <div className="border border-stone-300 p-8 rounded-xl text-center shadow-sm w-full max-w-[350px] bg-white">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">Thư mời tiệc cưới</p>
            <h1 className={`text-5xl mb-4 text-gray-900 ${greatVibes.className}`}>Nhất Lập <br/> <span className="text-3xl">&</span> <br/> Quỳnh Như</h1>
            <div className="w-16 h-[1px] bg-gray-300 mx-auto my-6"></div>
            <button
              onClick={handleOpenInvitation}
              className="px-8 py-3 bg-stone-800 text-white rounded-full font-bold uppercase text-xs tracking-widest shadow-lg animate-pulse hover:bg-[#8b0000] transition-colors"
            >
              Mở Thiệp
            </button>
          </div>
        </div>
      )}

      {/* KHUNG NỘI DUNG CHÍNH */}
      <main className={`w-full max-w-[450px] bg-[#fdfcfb] min-h-screen shadow-2xl relative overflow-x-hidden ${!isOpened ? 'hidden' : 'block'}`}>
        
        <FallingEffects />

        {/* NÚT NHẠC */}
        <div className="fixed top-6 right-6 z-50 md:right-[calc(50%-200px)]" data-aos="zoom-in">
          <button
            onClick={toggleMusic}
            className={`w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40 active:scale-90 transition-all overflow-hidden ${isPlaying ? 'animate-heartbeat' : ''}`}
          >
            {isPlaying ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/gif-icon-music.gif" alt="Playing" className="w-7 h-7 object-contain" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/stop-music-icon.png" alt="Stopped" className="w-7 h-7 object-contain opacity-60" />
            )}
          </button>
        </div>

        {/* 1. HERO SECTION */}
        <section className="relative h-[750px] w-full flex flex-col items-center justify-between py-4">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/anh-bia.jpg" className="w-full h-full object-cover animate-zoom-in" alt="Bìa" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fdfcfb]"></div>
          </div>

         <div className="relative z-10 text-center px-4 pt-10 mt-6" data-aos="zoom-in" data-aos-duration="1500">
          <h1 className={`text-4xl font-bold italic text-gray-900 drop-shadow-md ${greatVibes.className}`}>
            Nhất Lập & Quỳnh Như
          </h1>
        </div>

          <div className="relative z-10 text-center w-full px-12 mb-10 space-y-8">
            <div className="space-y-2 pt-4 pb-4 border-t border-b border-gray-900/80" data-aos="zoom-in" data-aos-delay="300">
              <p className="uppercase tracking-[0.4em] text-[16px] text-gray-900 font-bold">Thư mời tiệc cưới</p>
              <p className="text-lg font-light text-gray-900">9:00 - Thứ ba</p>
              <div className="text-4xl font-bold tracking-widest text-gray-900">11.08.2026</div>
            </div>

            <div data-aos="zoom-in">
               <p className="text-[14px] uppercase tracking-[0.2em] text-gray-800 italic">Trân trọng kính mời</p>
               <p className={`text-4xl font-black text-gray-900 mt-1 ${dancingScript.className}`}>Anh Linh</p>
            </div>
          </div>
        </section>

        {/* 2. THÔNG TIN GIA ĐÌNH */}
        <section className="py-8 text-center bg-white relative z-20">
          <div className="mb-12 italic text-[16px] text-gray-800 space-y-1 text-xs" data-aos="fade-up">
            <p>“Hôn nhân là chuyện cả đời,</p>
            <p>Yêu người vừa ý, cưới người mình thương...”</p>
          </div>
          
          <div className="flex justify-between mb-12 text-[13px] uppercase tracking-widest leading-loose px-1">
            <div className="w-1/2" data-aos="fade-right">
              <p className="font-bold text-gray-900 mb-2">Nhà Trai</p>
              <p className="font-bold text-gray-900 leading-tight">Lê Cao Trung</p>
              <p className="font-bold text-gray-900 leading-tight">Đinh Thị Viên</p>
              <p className="text-[12px] text-gray-500 mt-1 lowercase normal-case">Xã Ba Gia, Quảng Ngãi</p>
            </div>
            <div className="w-1/2" data-aos="fade-left">
              <p className="font-bold text-gray-900 mb-2">Nhà Gái</p>
              <p className="font-bold text-gray-900 leading-tight">Châu Văn Tấn</p>
              <p className="font-bold text-gray-900 leading-tight">Nguyễn Thị Thùy Biên</p>
              <p className="text-[12px] text-gray-500 mt-1 lowercase normal-case">Xã Eahleo, Đăk Lăk</p>
            </div>
          </div>

          <div className={`text-4xl text-gray-800 mb-10 ${greatVibes.className}`} data-aos="zoom-in">
            Nhất Lập ❤️ Quỳnh Như
          </div>

          <div className="flex gap-2 h-72 p-2 bg-stone-300 rounded-sm border border-stone-200 shadow-inner " data-aos="fade-up">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/chure.png" className="w-1/2 h-full object-cover rounded shadow-sm hover:scale-105 transition-transform duration-500" alt="Groom" />
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/codau.JPG" className="w-1/2 h-full object-cover rounded shadow-sm hover:scale-105 transition-transform duration-500" alt="Bride" />
          </div>
        </section>

        {/* 3. LỄ THÀNH HÔN */}
        <section className="py-8 px-4 bg-white text-center">
          <div className="flex justify-center items-center gap-2 mb-2" data-aos="fade-up">
            <div className="w-12 h-[1px] bg-gray-400"></div>
            <p className={`text-4xl ${dancingScript.className}`}>Thư Mời</p>
            <div className="w-12 h-[1px] bg-gray-400"></div>
          </div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-10" data-aos="fade-up" data-aos-delay="100">Tham dự lễ cưới Nhất Lập & Quỳnh Như</p>
          
          <div className="flex items-end justify-center gap-1.5 mb-10 h-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/anh-phu-1.jpg" className="w-[30%] h-[80%] object-cover shadow-sm mb-6 border border-stone-200 rounded" alt="Left" data-aos="fade-right" data-aos-delay="200" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/anh-chinh.jpg" className="w-[40%] h-full object-cover shadow-md z-10 border border-stone-200 rounded" alt="Center" data-aos="zoom-in" data-aos-delay="200" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/anh-phu-2.jpg" className="w-[30%] h-[80%] object-cover shadow-sm mb-6 border border-stone-200 rounded" alt="Right" data-aos="fade-left" data-aos-delay="200" />
          </div>

          <div>
            <h3 className="uppercase tracking-widest font-bold text-[13px] mb-1" data-aos="fade-up">Lễ Thành Hôn</h3>
            <p className="text-xs font-bold text-gray-700 mb-6" data-aos="fade-up">Vào Lúc</p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center w-[60px]"><p className="text-sm font-bold" data-aos="fade-right">9:00</p></div>
              <div className="h-12 w-[1px] bg-gray-300"></div>
              <div className="text-center w-[100px]" data-aos="zoom-in" data-aos-delay="100">
                <p className="text-[11px] font-bold uppercase tracking-widest">Thứ ba</p>
                <p className="text-4xl font-black my-1 text-[#8b0000]">11</p>
                <p className="text-[11px] font-bold uppercase tracking-widest">Tháng 8</p>
              </div>
              <div className="h-12 w-[1px] bg-gray-300"></div>
              <div className="text-center w-[60px]"><p className="text-sm font-bold" data-aos="fade-left">Năm 2026</p></div>
            </div>
            
          <p className="text-[11px] italic text-gray-600 mb-4" data-aos="fade-up">(Tức Ngày 29 Tháng 6 Năm Bính Ngọ)</p>
          <p className="text-sm font-bold" data-aos="fade-up" data-aos-delay="200">Tại Tư Gia Nhà Trai</p>
          </div>
        </section>

        {/* 4. LỊCH THÁNG */}
        <section className="py-8 px-8 bg-stone-50 border-y border-stone-200" data-aos="fade-up">
          <div className="flex justify-between items-end mb-6 text-[#8c7462]">
            <span className={`text-4xl ${dancingScript.className}`}>Tháng 8</span>
            <span className="text-5xl font-black">2026</span>
          </div>
          <div className="border border-[#8c7462] rounded overflow-hidden bg-white shadow-sm">
            <div className="grid grid-cols-7 bg-[#8c7462] text-white text-[10px] py-2 font-bold text-center">
              {['T2','T3','T4','T5','T6','T7','CN'].map(d=>(<div key={d}>{d}</div>))}
            </div>
            <div className="grid grid-cols-7 gap-y-3 py-3 text-center text-xs text-gray-500">
              {Array.from({ length: 5 }).map((_, i) => <div key={`empty-${i}`} className="h-8"></div>)}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <div key={day} className={`relative flex items-center justify-center h-8 ${day === 11 ? 'font-black text-[#8b0000]' : ''}`}>
                  {day === 11 && (
                    <svg className="absolute w-8 h-8 text-[#8b0000] scale-[1.3] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  )}
                  <span className="relative z-10">{day}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[15px] uppercase tracking-[0.2em] text-gray-500 italic pt-6 mb-1 text-center">- Đang đếm ngược -</p>
          <CountdownTimer />
        </section>
      
         {/* 5. ĐỊA ĐIỂM & BẢN ĐỒ */}
        <div className="text-center p-6">
          <h2 className="text-xl font-bold uppercase mb-2" data-aos="zoom-in">Lễ Thành Hôn</h2>
          <p className="text-sm mb-4" data-aos="zoom-in">Vào lúc 9:00 - Thứ Ba</p>
          <div className="flex justify-center items-center gap-4 mb-4">
            <span className="text-4xl" data-aos="fade-right">11</span>
            <div className="text-left border-l pl-4 border-stone-400">
              <p className="text-xs uppercase" data-aos="fade-left">Tháng 8</p>
              <p className="text-xs" data-aos="fade-left">Năm 2026</p>
            </div>
          </div>
          <p className="text-xs italic mb-6" data-aos="fade-up">
            (Tức Ngày 29 Tháng 6 Năm Bính Ngọ)
          </p>

          <div className="bg-stone-50  rounded-xl border border-stone-100" data-aos="fade-up" data-aos-delay="200">
            <p className="font-bold mb-1">TẠI TƯ GIA NHÀ TRAI</p>
            <p className="text-xs mb-4">Ba gia – An Điềm, Thôn Xuân Hòa, Xã Ba Gia, Tỉnh Quảng Ngãi</p>
            <div className="w-full h-56 rounded-xl overflow-hidden mb-4 shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10890.523089400649!2d108.67466500763612!3d15.192282176372863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3169b1c7e2a8cc8f%3A0xb85077fde744e1b7!2s%C3%94ng%20Cao%20Trung!5e0!3m2!1svi!2s!4v1772958694010!5m2!1svi!2s"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
               </iframe>
            </div>
            <a
              href="https://maps.app.goo.gl/CZ3skShbfk43hcei9"
              target="_blank"
              className="inline-block w-full py-3 bg-stone-800 text-white rounded-lg text-xs font-bold uppercase"
            >
              Chỉ đường trên Google Maps
            </a>
          </div>
        </div>

        {/* 6. ALBUM HÌNH CƯỚI */}
        <section className="py-4 px-4 bg-white">
          <div className="flex items-center justify-center gap-4 mb-4" data-aos="fade-up">
            <h3 className={`text-3xl text-gray-800 ${dancingScript.className}`}>Album hình cưới</h3>
            <div className="flex-1 h-[1px] bg-gray-300 relative flex items-center justify-center max-w-[120px]">
               <span className="absolute bg-white px-2 text-[10px]">♥️</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-album-1.jpg" className="w-full aspect-[3/4] object-cover rounded shadow-md" alt="A1" data-aos="fade-right" data-aos-delay="100" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-album-3.jpg" className="w-full aspect-[3/4] object-cover rounded shadow-md" alt="A3" data-aos="fade-right" data-aos-delay="150" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-album-5.jpg" className="w-full aspect-[3/4] object-cover rounded shadow-md" alt="A5" data-aos="fade-right" data-aos-delay="200" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-album-7.jpg" className="w-full aspect-[3/4] object-cover rounded shadow-md" alt="A7" data-aos="fade-right" data-aos-delay="250" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-album-9.jpg" className="w-full aspect-[4/3] object-cover rounded shadow-md" alt="A9" data-aos="fade-right" data-aos-delay="300" />
            </div>
            <div className="flex flex-col gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-album-2.jpg" className="w-full aspect-[3/4] object-cover rounded shadow-md" alt="A2" data-aos="fade-left" data-aos-delay="100" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-album-4.jpg" className="w-full aspect-[3/4] object-cover rounded shadow-md" alt="A4" data-aos="fade-left" data-aos-delay="150" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-album-6.jpg" className="w-full aspect-[3/4] object-cover rounded shadow-md" alt="A6" data-aos="fade-left" data-aos-delay="200" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-album-8.jpg" className="w-full aspect-[3/4] object-cover rounded shadow-md" alt="A8" data-aos="fade-left" data-aos-delay="250" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/anh-album-10.jpg" className="w-full aspect-[4/3] object-cover rounded shadow-md" alt="A10" data-aos="fade-left" data-aos-delay="300" />
            </div>
          </div>
        </section>

        {/* 7. PHẦN KẾT */}
        <section className="relative min-h-[750px] w-full flex flex-col items-center justify-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/anh-cuoi-cuoi.jpg"
              className="w-full h-full object-cover brightness-[0.9] blur-[2px]"
              alt="Final Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40"></div>
          </div>

          <div className="relative z-10 w-full flex flex-col items-center space-y-8" data-aos="fade-up" data-aos-delay="200">
            
            <div className="w-full px-8 space-y-8 mb-15">
              <button
                onClick={(e) => { e.stopPropagation(); setShowRSVP(true); }}
                className="w-full py-4 bg-stone-800/90 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl backdrop-blur-md border border-white/10 active:scale-95 transition-all"
              >
                Xác nhận tham dự lễ cưới
              </button>
              
              <div className="flex justify-center">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowGifts(true); }}
                  className="w-3/10 py-3 bg-[#8b0000]/90 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg backdrop-blur-md border border-white/10 active:scale-95 transition-all"
                >
                  Wedding gift
                </button>
              </div>
            </div>

            <div className="w-full py-5 mb-2 bg-white/5 backdrop-blur-[4px] border-y border-white/10 text-center">
              <p className={`text-6xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] ${greatVibes.className}`}>
                Thank You
              </p>
              
              <div className="h-[1px] w-10 bg-white/20 mx-auto"></div>
              
              <p className="text-lg pt-4 italic font-light text-white/90 tracking-wide drop-shadow-md">
                Sự hiện diện của Quý Khách là lời chúc phúc trọn vẹn nhất cho tụi con/em/mình và là niềm vinh dự của gia đình!
              </p>
            </div>
            
            <footer className="px-10 py-2 text-center text-white text-[9px] tracking-[0.4em] uppercase">
              <p>© 2026 | Design by Morgan</p>
            </footer>
          </div>
        </section>

        {/* MODAL RSVP */}
        {showRSVP && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện nổi bọt ở background của modal
          >
            <div className="bg-white w-full max-w-[340px] rounded-[20px] p-8 relative animate-in zoom-in duration-300 shadow-2xl border border-stone-100">
              <button onClick={() => setShowRSVP(false)} className="absolute top-4 right-4 text-gray-400 text-xl font-light">✕</button>
              
              <h3 className={`text-3xl text-center mb-1 text-gray-800 ${greatVibes.className}`}>Xác Nhận Tham Dự</h3>
              <div className="w-24 h-[1px] bg-gray-800 mx-auto mb-8 opacity-40"></div>

              <form onSubmit={handleRSVPSubmit} className="space-y-4">
                <input required placeholder="Tên của bạn là?" className="w-full px-5 py-3 rounded-full border border-gray-600 bg-stone-50/50 text-sm outline-none placeholder:text-gray-400" onChange={e=>setFormData({...formData, name: e.target.value})} />
                <input placeholder="Bạn là gì của Dâu Rể nhỉ?" className="w-full px-5 py-3 rounded-full border border-gray-600 bg-stone-50/50 text-sm outline-none placeholder:text-gray-400" onChange={e=>setFormData({...formData, relation: e.target.value})} />
                <input placeholder="Gửi lời chúc đến Dâu Rể nhé!" className="w-full px-5 py-3 rounded-full border border-gray-600 bg-stone-50/50 text-sm outline-none placeholder:text-gray-400" onChange={e=>setFormData({...formData, message: e.target.value})} />
                
                <div className="relative">
                  <select className="w-full px-5 py-3 rounded-full border border-gray-600 bg-transparent text-sm outline-none appearance-none text-gray-500" onChange={e=>setFormData({...formData, attending: e.target.value})}>
                    <option value="yes">Bạn Có Tham Dự Không?</option>
                    <option value="yes">Mình sẽ tham dự!</option>
                    <option value="no">Tiếc quá, mình bận mất rồi</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>

                <button disabled={loading} className="w-full mt-2 py-4 bg-[#4a4a4a] text-white rounded-full font-bold uppercase text-[11px] tracking-widest shadow-md">
                  {loading ? "ĐANG GỬI..." : "GỬI NGAY"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL QUÀ TẶNG */}
        {showGifts && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()} // Ngăn chạm vào modal kích hoạt sự kiện body
          >
            <div className="bg-white w-full max-w-[320px] rounded-[20px] p-8 relative text-center shadow-2xl border border-stone-100">
              <button onClick={() => setShowGifts(false)} className="absolute top-4 right-4 text-gray-400 text-xl font-light">✕</button>
              <h3 className={`text-3xl text-gray-800 mb-1 ${greatVibes.className}`}>Gửi Mừng Cưới</h3>
              <div className="w-24 h-[1px] bg-gray-800 mx-auto mb-6 opacity-40"></div>

              <div className="bg-stone-50 p-4 rounded-xl mb-4 border border-stone-200 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/QRCODE-CR.png" className="w-40 h-40 mx-auto mix-blend-multiply" alt="QR" />
              </div>
              <p className="font-bold text-gray-800 text-sm uppercase">VCB - Le Cao Nhat Lap</p>
              <p className="text-xl mt-1 text-stone-600 font-bold tracking-wider">3335741122</p>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes fall-sway {
          0% { transform: translateY(-30px) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(50vh) translateX(20px) rotate(180deg); }
          90% { opacity: 1; }
          100% { transform: translateY(110vh) translateX(-10px) rotate(360deg); opacity: 0; }
        }

        @keyframes zoomIn {
          from { transform: scale(1.1); }
          to { transform: scale(1); }
        }
        .animate-zoom-in { animation: zoomIn 15s ease-out forwards; }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .animate-heartbeat { animation: heartbeat 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
