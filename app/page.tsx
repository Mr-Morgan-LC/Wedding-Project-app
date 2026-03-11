'use client';

import { useEffect, useState, useRef } from 'react';
import localFont from 'next/font/local';
import Image from 'next/image';
import AOS from "aos";
import "aos/dist/aos.css";

// --- CẤU HÌNH FONT CHUẨN NEXTJS ---
const edwardian = localFont({ 
  src: '../public/fonts/UTM-Edwardian.ttf', 
  display: 'swap',
});

const uvfa = localFont({ 
  src: '../public/fonts/UVF-a.ttf', 
  display: 'swap',
});

const fcclass = localFont({ 
  src: '../public/fonts/FC-Classy-Vogue.otf', 
  display: 'swap',
});

// --- COMPONENT NHỎ ĐƯỢC ĐƯA RA NGOÀI ---
const TimeUnit = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm border border-stone-200/50 rounded-lg w-16 py-2 shadow-sm">
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
          <Image 
            src="/icon-heart.png" 
            width={Math.round(heart.size)} 
            height={Math.round(heart.size)} 
            alt="" 
            aria-hidden="true" 
          />
        </div>
      ))}
    </div>
  );
};

export default function WeddingInvitation() {
  const [isOpened, setIsOpened] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', relation: '', attending: 'yes', message: ''
  });

  useEffect(() => {
    AOS.init({ duration: 1200, once: false, mirror: true, offset: 50 });
  }, []);

  useEffect(() => {
    if (isOpened) {
      setTimeout(() => { AOS.refresh(); }, 300);
    }
  }, [isOpened]);

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

      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: params });
      alert('Cảm ơn bạn! Thông tin đã được gửi đến Dâu & Rể.');
      setShowRSVP(false);
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-[#F5EFE6] min-h-screen flex justify-center p-0 md:p-4 font-sans text-gray-800 relative ${fcclass.className}`}>
      <audio ref={audioRef} src="/wedding-music.mp3" loop preload="auto" />

      <main className={`w-full max-w-[450px] bg-[#FAF6F0] shadow-2xl relative overflow-x-hidden ${!isOpened ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>
        
        <FallingEffects />

        {isOpened && (
          <div className="fixed top-6 right-6 z-50 md:right-[calc(50%-200px)] animate-in zoom-in duration-500">
            <button
              aria-label={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
              onClick={toggleMusic}
              className={`w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-[#8c7462]/30 active:scale-90 transition-all overflow-hidden ${isPlaying ? 'animate-heartbeat' : ''}`}
            >
              {isPlaying ? (
                <Image src="/gif-icon-music.gif" alt="" width={28} height={28} className="object-contain" />
              ) : (
                <Image src="/stop-music-icon.png" alt="" width={28} height={28} className="object-contain opacity-60" />
              )}
            </button>
          </div>
        )}

        {/* 1. HERO SECTION */}
        <section className={`relative w-full flex flex-col items-center justify-between py-4 ${!isOpened ? 'h-screen' : 'h-[750px]'}`}>
          <div className="absolute inset-0 z-0">
            <Image 
              src="/anh-bia.jpg" 
              fill 
              priority
              className="object-cover animate-zoom-in" 
              alt="Ảnh bìa thiệp cưới Nhất Lập và Quỳnh Như" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAF6F0]"></div>
          </div>

          <div className="relative z-10 text-center px-4 pt-10 mt-6" data-aos="zoom-in" data-aos-duration="1500">
            <h1 className={`text-4xl text-[#910000] drop-shadow-md ${edwardian.className}`}>
              Nhất Lập ♥️ Quỳnh Như
            </h1>
          </div>

          <div className="relative z-10 text-center w-full px-12 mb-10 space-y-8">
            <div className="space-y-2 pt-4 pb-4 border-t border-b border-[#8c7462]/40" data-aos="zoom-in">
              <h2 className="uppercase tracking-[0.4em] text-[16px] text-gray-900 font-bold">Thư mời tiệc cưới</h2>
              
              {isOpened && (
                <div className="animate-in fade-in duration-700 mt-4 space-y-2">
                  <p className="text-lg font-light text-gray-900">11:00 - Thứ ba</p>
                  <div className={`text-4xl font-bold tracking-widest text-gray-900 ${fcclass.className}`}>11.08.2026</div>
                </div>
              )}
            </div>

            {!isOpened && (
              <div className="flex justify-center" data-aos="zoom-in">
                <button
                  onClick={handleOpenInvitation}
                  aria-label="Mở thiệp cưới"
                  className="px-10 mt-5 py-3 bg-[#910000] text-white rounded-full font-bold uppercase text-sm tracking-widest shadow-lg animate-bounce"
                >
                  Mở Thiệp
                </button>
              </div>
            )}

            {isOpened && (
              <div className="animate-in fade-in duration-1000" data-aos="zoom-in">
                 <p className="text-sm uppercase tracking-[0.2em] text-gray-800 italic">Trân trọng kính mời</p>
                 <p className={`text-3xl font-black text-gray-900 mt-5 ${uvfa.className}`}>vc Anh Linh</p>
              </div>
            )}
          </div>
        </section>

        {/* PHẦN NỘI DUNG CHI TIẾT PHÍA DƯỚI */}
        {isOpened && (
          <div className="animate-in fade-in duration-1000">
            
            {/* 2. THÔNG TIN GIA ĐÌNH */}
            <section className="py-8 text-center bg-[#FAF6F0] relative z-20">
              <div className={`mb-12 italic text-[18px] text-gray-900 space-y-1 ${uvfa.className}`} data-aos="fade-up">  
                <p>“Hôn nhân là chuyện cả đời,</p>
                <p>Yêu người vừa ý, Cưới người Mình thương...”</p>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-stretch mb-12 text-xs uppercase tracking-widest leading-loose gap-x-1">
                <div className="flex flex-col items-end text-right justify-center" data-aos="fade-right">
                  <h3 className="font-bold text-black mb-2">Nhà Trai</h3>
                  <p className="text-gray-900 leading-tight">Lê Cao Trung</p>
                  <p className="text-gray-900 leading-tight">Đinh Thị Viên</p>
                  <p className="text-xs text-gray-500 mt-2 lowercase normal-case">Xã Ba Gia, Quảng Ngãi</p>
                </div>

                <div className="flex flex-col items-center relative min-w-[35px]">
                  <Image 
                    src="/cungly.png" 
                    width={28} height={28}
                    className="object-contain z-10 bg-[#FAF6F0] pb-2" 
                    alt="Biểu tượng cạn ly" 
                  />
                  <div className="w-[1px] flex-grow bg-gray-300 my-1"></div>
                </div>
                
                <div className="flex flex-col items-start text-left justify-center" data-aos="fade-left">
                  <h3 className="font-bold text-black mb-2">Nhà Gái</h3>
                  <p className="text-gray-900 leading-tight">Châu Văn Tấn</p>
                  <p className="text-gray-900 leading-tight">Nguyễn Thị Thùy Biên</p>
                  <p className="text-xs text-gray-500 mt-2 lowercase normal-case">Xã Eahleo, Đăk Lăk</p>
                </div>
              </div>

              <div className={`grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 text-4xl text-[#910000] mb-10 ${edwardian.className}`} data-aos="zoom-in">
                <span className="text-right">Nhất Lập</span>
                <div className="flex justify-center min-w-[50px]">
                  <Image src="/chuHy.png" width={48} height={48} className="object-contain rounded shadow-sm hover:scale-105 transition-transform duration-500 -translate-y-1" alt="Chữ Hỷ"/>
                </div>
                <span className="text-left">Quỳnh Như</span>
              </div>
            </section>

            {/* 3. LỄ THÀNH HÔN */}
            <section className="py-8 px-4 bg-[#FAF6F0] text-center border-t border-[#e6dac3]/50">
              <div className="flex justify-center items-center gap-2 mb-2" data-aos="fade-up">
                <div className="w-12 h-[1px] bg-[#8c7462]/50"></div>
                <h2 className={`text-4xl text-gray-900 ${edwardian.className}`}>Thư Mời</h2>
                <div className="w-12 h-[1px] bg-[#8c7462]/50"></div>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-900 mb-10" data-aos="fade-up" data-aos-delay="100">THAM DỰ LỄ THÀNH HÔN CỦA CHÚNG MÌNH</p>
              
              <div className="flex items-end justify-center gap-1.5 mb-10 h-64">
                <Image src="/anh-phu-1.jpg" width={150} height={200} className="w-[30%] h-[80%] object-cover shadow-sm mb-6 border border-[#e6dac3] rounded" alt="Ảnh cưới chú rể và cô dâu" data-aos="fade-right" data-aos-delay="200" />
                <Image src="/anh-chinh.jpg" width={200} height={300} priority className="w-[40%] h-full object-cover shadow-md z-10 border border-[#e6dac3] rounded" alt="Ảnh cưới chính của Nhất Lập và Quỳnh Như" data-aos="zoom-in" data-aos-delay="200" />
                <Image src="/anh-phu-2.jpg" width={150} height={200} className="w-[30%] h-[80%] object-cover shadow-sm mb-6 border border-[#e6dac3] rounded" alt="Ảnh cưới lãng mạn" data-aos="fade-left" data-aos-delay="200" />
              </div>

              <div>
                <h3 className="uppercase tracking-widest font-bold text-xm mb-1 text-[#700000]" >Lễ Thành Hôn</h3>
                <p className="text-xs font-bold text-gray-700 mb-6" >Vào Lúc</p>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-center w-[80px]"><p className="text-sm font-bold" data-aos="fade-right">9:00</p></div>
                  <div className="h-12 w-[1px] bg-[#8c7462]/30"></div>
                  <div className="text-center w-[100px]" data-aos="zoom-in" data-aos-delay="100">
                    <p className="text-xs font-bold uppercase tracking-widest">Thứ ba</p>
                    <p className={`text-4xl font-black tracking-widest my-1 text-[#700000] ${fcclass.className}`}>11</p>
                    <p className="text-xs font-bold tracking-widest">Tháng 8</p>
                  </div>
                  <div className="h-12 w-[1px] bg-[#8c7462]/30"></div>
                  <div className="text-center w-[80px]"><p className="text-sm font-bold" data-aos="fade-left">Năm 2026</p></div>
                </div>
                
                <p className="text-xs italic text-gray-600 mb-4" data-aos="fade-up">(Tức Ngày 29 Tháng 6 Năm Bính Ngọ)</p>
                <p className="text-sm mb-6 italic text-black" data-aos="fade-up">Tại Tư Gia Nhà Trai</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e6dac3] shadow-sm" >
                <h3 className="text-xm font-bold uppercase mb-2 text-[#700000]" >Tiệc Mừng Lễ Thành Hôn</h3>
                <p className="text-sm mb-4 font-bold" data-aos="zoom-in">Vào lúc 11:00 - Thứ Ba</p>
                <div className="flex justify-center items-center gap-4 mb-4">
                  <span className={`text-4xl font-bold tracking-widest text-[#910000] ${fcclass.className}`} data-aos="fade-right">11</span>
                  <div className="text-left border-l pl-4 border-[#8c7462]/30">
                    <p className="text-xs font-bold" data-aos="fade-left">Tháng 8</p>
                    <p className="text-xs font-bold" data-aos="fade-left">Năm 2026</p>
                  </div>
                </div>
                <p className="text-xs italic text-gray-600 mb-4" data-aos="fade-up">
                  (Tức Ngày 29 Tháng 6 Năm Bính Ngọ)
                </p>
                <p className="text-sm text-black font-bold mb-2" data-aos="fade-up">
                  Tại Tư Gia Nhà Trai
                </p>
              </div>
            </section>

            {/* 4. LỊCH THÁNG */}
            <section className="py-8 px-8 bg-[#FDFBF7] border-y border-[#e6dac3]" data-aos="fade-up">
              <div className="flex justify-between items-end mb-6 text-[#910000]">
                <span className={`text-4xl ${uvfa.className}`}>Tháng 8</span>
                <span className={`text-5xl font-black ${fcclass.className}`}>2026</span>
              </div>
              <div className="border border-[#8c7462]/30 rounded overflow-hidden bg-white shadow-sm">
                <div className="grid grid-cols-7 bg-[#8c7462] text-white text-[10px] py-2 font-bold text-center">
                  {['T2','T3','T4','T5','T6','T7','CN'].map(d=>(<div key={d}>{d}</div>))}
                </div>
                <div className="grid grid-cols-7 gap-y-3 py-3 text-center text-xs text-gray-500">
                  {Array.from({ length: 5 }).map((_, i) => <div key={`empty-${i}`} className="h-8"></div>)}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <div key={day} className={`relative flex items-center justify-center h-8 ${day === 11 ? 'font-bold text-[#700000]' : ''}`}>
                      {day === 11 && (
                        <svg className="absolute w-8 h-8 text-[#910000] scale-[1.3] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      )}
                      <span className="relative z-10">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
              <CountdownTimer />
            </section>
          
            {/* 5. ĐỊA ĐIỂM & BẢN ĐỒ */}
            <div className="text-center p-6 bg-[#FAF6F0]">
              <h2 className={`text-3xl text-gray-900 mb-4 ${uvfa.className}`}>Địa điểm tổ chức</h2>
              <div className="bg-white p-4 rounded-xl border border-[#e6dac3] shadow-sm" data-aos="fade-up" data-aos-delay="200">
                <p className="font-bold mb-1 text-black">TẠI TƯ GIA NHÀ TRAI</p>
                <p className="text-xs mb-4">Ba gia – An Điềm, Thôn Xuân Hòa, Xã Ba Gia, Tỉnh Quảng Ngãi</p>
                <div className="w-full h-56 rounded-xl overflow-hidden mb-4 shadow-inner">
                  <iframe
                    title="Bản đồ chỉ đường đến Tư gia nhà trai"
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
                  rel="noopener noreferrer"
                  className="inline-block w-full py-3 bg-[#e9e9e9] text-black rounded-lg text-xs font-bold uppercase hover:bg-[#6b584a] transition-colors"
                >
                  Chỉ đường trên Google Maps
                </a>
              </div>
            </div>

            {/* 6. ALBUM HÌNH CƯỚI */}
            <section className="py-4 px-4 bg-[#FAF6F0]">
              <div className="flex items-center justify-center gap-4 mb-8" data-aos="fade-up">
                <h2 className={`text-3xl text-gray-900 ${uvfa.className}`}>Album hình cưới</h2>
                <div className="flex-1 h-[1px] bg-black/30 relative flex items-center justify-center max-w-[120px]">
                   <span className="absolute bg-[#FAF6F0] px-2 text-[10px]" aria-hidden="true">♥️</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-3">
                  <Image src="/anh-album-1.jpg" width={300} height={400} className="w-full h-auto object-cover rounded shadow-md border border-[#e6dac3]" alt="Album ảnh cưới Nhất Lập Quỳnh Như 1" data-aos="fade-right" data-aos-delay="100" />
                  <Image src="/anh-album-3.jpg" width={300} height={400} className="w-full h-auto object-cover rounded shadow-md border border-[#e6dac3]" alt="Album ảnh cưới Nhất Lập Quỳnh Như 3" data-aos="fade-right" data-aos-delay="150" />
                  <Image src="/anh-album-5.jpg" width={300} height={400} className="w-full h-auto object-cover rounded shadow-md border border-[#e6dac3]" alt="Album ảnh cưới Nhất Lập Quỳnh Như 5" data-aos="fade-right" data-aos-delay="200" />
                  <Image src="/anh-album-7.jpg" width={300} height={400} className="w-full h-auto object-cover rounded shadow-md border border-[#e6dac3]" alt="Album ảnh cưới Nhất Lập Quỳnh Như 7" data-aos="fade-right" data-aos-delay="250" />
                  <Image src="/anh-album-9.jpg" width={400} height={300} className="w-full h-auto object-cover rounded shadow-md border border-[#e6dac3]" alt="Album ảnh cưới Nhất Lập Quỳnh Như 9" data-aos="fade-right" data-aos-delay="300" />
                </div>
                <div className="flex flex-col gap-3">
                  <Image src="/anh-album-2.jpg" width={300} height={400} className="w-full h-auto object-cover rounded shadow-md border border-[#e6dac3]" alt="Album ảnh cưới Nhất Lập Quỳnh Như 2" data-aos="fade-left" data-aos-delay="100" />
                  <Image src="/anh-album-4.jpg" width={300} height={400} className="w-full h-auto object-cover rounded shadow-md border border-[#e6dac3]" alt="Album ảnh cưới Nhất Lập Quỳnh Như 4" data-aos="fade-left" data-aos-delay="150" />
                  <Image src="/anh-album-6.jpg" width={300} height={400} className="w-full h-auto object-cover rounded shadow-md border border-[#e6dac3]" alt="Album ảnh cưới Nhất Lập Quỳnh Như 6" data-aos="fade-left" data-aos-delay="200" />
                  <Image src="/anh-album-8.jpg" width={300} height={400} className="w-full h-auto object-cover rounded shadow-md border border-[#e6dac3]" alt="Album ảnh cưới Nhất Lập Quỳnh Như 8" data-aos="fade-left" data-aos-delay="250" />
                  <Image src="/anh-album-10.jpg" width={400} height={300} className="w-full h-auto object-cover rounded shadow-md border border-[#e6dac3]" alt="Album ảnh cưới Nhất Lập Quỳnh Như 10" data-aos="fade-left" data-aos-delay="300" />
                </div>
              </div>
            </section>

            {/* 7. PHẦN KẾT */}
            <section className="relative min-h-[750px] w-full flex flex-col items-center justify-end overflow-hidden mt-8">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/anh-cuoi-cuoi.jpg"
                  fill
                  className="object-cover brightness-[0.8] blur-[1px]"
                  alt="Ảnh cưới kết thúc thiệp Nhất Lập Quỳnh Như"
                />
              </div>

              <div className="relative z-10 w-full flex flex-col items-center space-y-8" data-aos="fade-up" data-aos-delay="200">
                <div className="w-full px-8 space-y-4 mb-15">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowRSVP(true); }}
                    className="w-full py-4 bg-[#bfbdb8]/90 text-black rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl backdrop-blur-md border border-white/20 active:scale-95 transition-all"
                  >
                    Xác nhận tham dự lễ cưới
                  </button>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowGifts(true); }}
                      className="w-2/5 py-3 bg-[#700000]/90 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg backdrop-blur-md border border-white/20 active:scale-95 transition-all"
                    >
                      Wedding gift
                    </button>
                  </div>
                </div>

                <div className="w-full py-5 mb-2 bg-[#8c7462]/10 backdrop-blur-[6px] border-y border-white/20 text-center">
                  <p className={`text-6xl mb-6 mt-8 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] ${uvfa.className}`}>
                    Thank You
                  </p>
                  
                  <div className="h-[1px] w-40 bg-white/40 mx-auto"></div>
                  
                  <p className="text-[14px] pt-4 px-4 italic font-light text-white/95 tracking-wide drop-shadow-md">
                    Sự hiện diện của Quý Khách là lời chúc phúc trọn vẹn nhất cho chúng tôi và là niềm vinh dự của gia đình!
                  </p>
                </div>
                
                <footer className="px-10 py-3 text-center text-white/80 text-[9px] tracking-[0.4em] uppercase">
                  <p>© 2026 | Design by Morgan</p>
                </footer>
              </div>
            </section>
          </div>
        )}

        {/* MODAL RSVP */}
        {showRSVP && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#FAF6F0] w-full max-w-[340px] rounded-[20px] p-8 relative animate-in zoom-in duration-300 shadow-2xl border border-[#e6dac3]">
              <button onClick={() => setShowRSVP(false)} aria-label="Đóng bảng xác nhận" className="absolute top-4 right-4 text-gray-400 text-xl font-light hover:text-[#8c7462]">✕</button>
              
              <h3 className={`text-2xl text-center mb-1 text-[#8c7462] ${uvfa.className}`}>Xác Nhận Tham Dự</h3>
              <div className="w-24 h-[1px] bg-[#8c7462] mx-auto mb-8 opacity-40"></div>

              <form onSubmit={handleRSVPSubmit} className="space-y-4">
                <input required aria-label="Nhập tên của bạn" placeholder="Tên của bạn là?" className="w-full px-5 py-3 rounded-full border border-[#d8c8b5] bg-white text-sm outline-none placeholder:text-gray-400 focus:border-[#8c7462]" onChange={e=>setFormData({...formData, name: e.target.value})} />
                <input aria-label="Quan hệ với cô dâu chú rể" placeholder="Bạn là gì của Dâu Rể nhỉ?" className="w-full px-5 py-3 rounded-full border border-[#d8c8b5] bg-white text-sm outline-none placeholder:text-gray-400 focus:border-[#8c7462]" onChange={e=>setFormData({...formData, relation: e.target.value})} />
                <input aria-label="Lời chúc" placeholder="Gửi lời chúc đến Dâu Rể nhé!" className="w-full px-5 py-3 rounded-full border border-[#d8c8b5] bg-white text-sm outline-none placeholder:text-gray-400 focus:border-[#8c7462]" onChange={e=>setFormData({...formData, message: e.target.value})} />
                
                <div className="relative">
                  <select aria-label="Tình trạng tham dự" className="w-full px-5 py-3 rounded-full border border-[#d8c8b5] bg-white text-sm outline-none appearance-none text-gray-500 focus:border-[#8c7462]" onChange={e=>setFormData({...formData, attending: e.target.value})}>
                    <option value="yes">Bạn Có Tham Dự Không?</option>
                    <option value="yes">Mình sẽ tham dự!</option>
                    <option value="no">Tiếc quá, mình bận mất rồi</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>

                <button disabled={loading} className="w-full mt-2 py-4 bg-[#8c7462] hover:bg-[#6b584a] transition-colors text-white rounded-full font-bold uppercase text-[11px] tracking-widest shadow-md">
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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#FAF6F0] w-full max-w-[320px] rounded-[20px] p-8 relative text-center shadow-2xl border border-[#e6dac3]">
              <button onClick={() => setShowGifts(false)} aria-label="Đóng bảng mừng cưới" className="absolute top-4 right-4 text-gray-400 text-xl font-light hover:text-[#8c7462]">✕</button>
              <h3 className={`text-3xl text-[#8c7462] mb-1 ${uvfa.className}`}>Gửi Mừng Cưới</h3>
              <div className="w-24 h-[1px] bg-[#8c7462] mx-auto mb-6 opacity-40"></div>

              <div className="bg-white p-4 rounded-xl mb-4 border border-[#e6dac3] shadow-inner">
                <Image src="/QRCODE-CR.png" width={160} height={160} className="mx-auto mix-blend-multiply" alt="Mã QR chuyển khoản mừng cưới" />
              </div>
              <p className="font-bold text-[#8c7462] text-sm uppercase">VCB - Le Cao Nhat Lap</p>
              <p className="text-xl mt-1 text-gray-700 font-bold tracking-wider">3335741122</p>
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
