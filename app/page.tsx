'use client';

import React, { useState, useRef, useEffect } from 'react';

// Giả lập hiệu ứng Fade-in trên scroll đơn giản cho "coder lão làng"
const useScrollFadeIn = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          currentRef.classList.add('visible');
          observer.unobserve(currentRef); // Chỉ chạy 1 lần
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return ref;
};

export default function WeddingInvitation() {
  // --- 1. QUẢN LÝ TRẠNG THÁI ---
  const [showRSVP, setShowRSVP] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    attending: 'yes',
    message: ''
  });

  // Sử dụng Hook Scroll
  const secFamilyRef = useScrollFadeIn();
  const secCeremonyRef = useScrollFadeIn();
  const secAdoraRef = useScrollFadeIn();
  const secAlbumRef = useScrollFadeIn();
  const secThankRef = useScrollFadeIn();
  const secActionRef = useScrollFadeIn(0.5);

  // --- LOGIC NHẠC ---
useEffect(() => {
  // Hàm xử lý phát nhạc khi người dùng tương tác lần đầu
  const handleFirstInteraction = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => console.log("Chờ tương tác thêm:", err));
    }
    // Sau khi đã phát hoặc tương tác xong thì gỡ bỏ sự kiện để tránh lặp lại
    window.removeEventListener('touchstart', handleFirstInteraction);
    window.removeEventListener('click', handleFirstInteraction);
  };

  // Lắng nghe sự kiện chạm (mobile) và click (desktop)
  window.addEventListener('touchstart', handleFirstInteraction);
  window.addEventListener('click', handleFirstInteraction);

  return () => {
    window.removeEventListener('touchstart', handleFirstInteraction);
    window.removeEventListener('click', handleFirstInteraction);
  };
}, [isPlaying]);

const toggleMusic = (e: React.MouseEvent) => {
  e.stopPropagation(); // Ngăn sự kiện click lan ra window làm trigger handleFirstInteraction
  if (audioRef.current) {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }
};

  // --- 3. GỬI RSVP ĐI GOOGLE SHEETS ---
  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4aLTKC5U43GI_OP03Gt9VnRq2fQEijGUjQU0XecnbRGyceFkQaLyur2jrj2gZF5Bn/exec'; // THAY ID CỦA BẠN TẠI ĐÂY

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
    <div className="bg-[#1a1a1a] min-h-screen flex justify-center p-0 md:p-4 font-sans text-gray-800">
      
      {/* THÀNH PHẦN NHẠC ẨN (Để file nhạc vào thư mục public) */}
      <audio ref={audioRef} src="/wedding-music.mp3" loop />

      {/* KHUNG NỘI DUNG CHÍNH (Mobile view limit 450px) */}
      <main className="w-full max-w-[450px] bg-[#fdfcfb] min-h-screen shadow-2xl relative overflow-x-hidden">
        
        {/* NÚT NHẠC XOAY TRÒN (Góc phải) */}
        {/* NÚT NHẠC (Sử dụng GIF/Image theo trạng thái) */}
<div className="fixed top-6 right-6 z-50 md:right-[calc(50%-200px)]">
  <button 
    onClick={toggleMusic} // Gọi hàm toggle đã sửa ở trên
    className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40 active:scale-90 transition-all overflow-hidden"
  >
    {isPlaying ? (
      <img src="/gif-icon-music.gif" alt="Playing" className="w-7 h-7 object-contain" />
    ) : (
      <img src="/stop-music-icon.png" alt="Stopped" className="w-7 h-7 object-contain opacity-60" />
    )}
  </button>
</div>

        {/* 1. PHẦN MỞ ĐẦU (HERO) - Yêu cầu: Full screen, text overlaid */}
        <section className="relative h-[750px] w-full flex flex-col items-center justify-between py-4">
          <div className="absolute inset-0">
            <img 
              src="/anh-bia.jpg" 
              className="w-full h-full object-cover animate-zoom-in" 
              alt="Bìa" 
            />
            {/* Gradient trắng dưới chân ảnh để hòa vào nền */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fdfcfb]"></div>
          </div>

          {/* TOP: Tên Cô dâu Chú rể */}
          <div className="relative z-10 text-center px-4 pt-10 mt-6 animate-fade-in-up delay-200">
            <h1 className="text-4xl font-bold italic text-gray-900" style={{ fontFamily: '"Great Vibes", cursive' }}>
              Nhất Lập & Quỳnh Như
            </h1>
          </div>

          {/* BOTTOM: Nhóm thông tin thời gian + Lời mời Anh Long ở dưới cùng */}
          <div className="relative z-10 text-center w-full px-12 mb-10 space-y-8">
            
            {/* Thông tin thời gian */}
            <div className="space-y-2 animate-fade-in-up delay-500">
              <p className="uppercase tracking-[0.4em] text-[10px] text-gray-900 font-bold">Thư mời tiệc cưới</p>
              <p className="text-lg font-light text-gray-900">18:00 - Chủ Nhật</p>
              <div className="text-4xl font-bold tracking-widest text-gray-900">14.12.2025</div>
            </div>

            {/* ĐOẠN MỜI ANH LONG - ĐÃ ĐƯA XUỐNG DƯỚI CÙNG ẢNH BÌA */}
            <div className="animate-fade-in-up delay-700 pt-4 border-t border-gray-200/50">
               <p className="text-[14px] uppercase tracking-[0.2em] text-gray-500 italic">Trân trọng kính mời</p>
               <p className="text-3xl font-black text-gray-900 mt-1">..................</p>
            </div>

          </div>
        </section>

        {/* 2. THÔNG TIN GIA ĐÌNH */}
        <section ref={secFamilyRef} className="py-8  text-center bg-white fade-in-on-scroll">
          <div className="mb-12 italic font-serif text-[20px] text-gray-600 space-y-1 text-xs">
            <p>“Hôn nhân là chuyện cả đời,</p>
            <p>Yêu người vừa ý, cưới người mình thương...”</p>
          </div>
          <div className="flex justify-between mb-12 text-[14px] uppercase tracking-widest leading-loose">
            <div className="w-1/2">
              <p className="font-bold text-gray-900 mb-2">Nhà Trai</p>
              <p className="font-bold text-gray-900 leading-tight">Lê Cao Trung</p>
              <p className="font-bold text-gray-900 leading-tight">Đinh Thị Viên</p>
              <p className="text-[12px] text-gray-500 mt-1 lowercase normal-case">Xã Ba Gia, Tỉnh Quảng Ngãi</p>
            </div>
            <div className="w-1/2">
              <p className="font-bold text-gray-900 mb-2">Nhà Gái</p>
              <p className="font-bold text-gray-900 leading-tight">Châu Văn Tấn</p>
              <p className="font-bold text-gray-900 leading-tight">Nguyễn Thị Thùy Biên</p>
              <p className="text-[12px] text-gray-500 mt-1 lowercase normal-case">Xã Eahleo, Tỉnh Đăk Lăk</p>
            </div>
          </div>
          <div className="text-3xl font-cursive text-gray-800 mb-10" style={{ fontFamily: '"Dancing Script", cursive' }}>
            Nhất Lập ❤️ Quỳnh Như
          </div>
          <div className="flex gap-2 h-72 bg-stone-300 p-2 rounded-sm border border-stone-200 shadow-inner">
             <img src="/chure.png" className="w-1/2 h-full object-cover rounded shadow-sm" alt="Groom" />
             <img src="/codau.JPG" className="w-1/2 h-full object-cover rounded shadow-sm" alt="Bride" />
          </div>
        </section>

        {/* 3. LỄ THÀNH HÔN (Bố cục 3 ảnh chuẩn tham chiếu) */}
        <section ref={secCeremonyRef} className="py-8 px-4 bg-white text-center fade-in-on-scroll">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-12 h-[1px] bg-gray-400"></div>
            <p className="text-4xl font-cursive" style={{ fontFamily: '"Dancing Script", cursive' }}>Thư Mời</p>
            <div className="w-12 h-[1px] bg-gray-400"></div>
          </div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-10">Tham dự lễ cưới Nhất Lập & Quỳnh Như</p>
          
          <div className="flex items-end justify-center gap-1.5 mb-10 h-64 ">
            <img src="/anh-phu-1.jpg" className="w-[30%] h-[80%] object-cover shadow-sm mb-6 border border-stone-200 rounded shadow-inner" alt="Left" />
            <img src="/anh-chinh.jpg" className="w-[40%] h-full object-cover shadow-md z-10 border border-stone-200 rounded shadow-inner" alt="Center" />
            <img src="/anh-phu-2.jpg" className="w-[30%] h-[80%] object-cover shadow-sm mb-6 border border-stone-200 rounded shadow-inner" alt="Right" />
          </div>

          <h3 className="uppercase tracking-widest font-bold text-[13px] mb-1">Lễ Thành Hôn</h3>
          <p className="text-xs font-bold text-gray-700 mb-6">Vào Lúc</p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center w-[60px]"><p className="text-sm font-bold">9:00</p></div>
            <div className="h-12 w-[1px] bg-gray-300"></div>
            <div className="text-center w-[100px]">
              <p className="text-[11px] font-bold uppercase tracking-widest">Thứ ba</p>
              <p className="text-4xl font-black my-1">11</p>
              <p className="text-[11px] font-bold uppercase tracking-widest">Tháng 8</p>
            </div>
            <div className="h-12 w-[1px] bg-gray-300"></div>
            <div className="text-center w-[60px]"><p className="text-sm font-bold">Năm 2026</p></div>
          </div>
          
          <p className="text-[11px] italic font-serif text-gray-600 mb-4">(Tức Ngày 29 Tháng 6 Năm Bính Ngọ)</p>
          <p className="text-sm font-bold">Tại Tư Gia Nhà Trai</p>
        </section>

       {/* 4. LỊCH THÁNG 8/2026 */}
<section className="py-8 px-8 bg-white border-t border-stone-200 shadow-inner">
  <div className="flex justify-between items-end mb-6 text-[#8c7462]">
    <span className="text-4xl font-cursive" style={{ fontFamily: '"Dancing Script", cursive' }}>Tháng 8</span>
    <span className="text-5xl font-serif font-black">2026</span>
  </div>
  
  <div className="border border-[#8c7462] rounded overflow-hidden">
    {/* Header các thứ trong tuần */}
    <div className="grid grid-cols-7 bg-[#8c7462] text-white text-[10px] py-2 font-bold text-center">
      {['T2','T3','T4','T5','T6','T7','CN'].map(d=>(<div key={d}>{d}</div>))}
    </div>
    
    {/* Lưới ngày: Tháng 8/2026 bắt đầu từ Thứ Bảy */}
    <div className="grid grid-cols-7 gap-y-3 py-3 text-center text-xs font-serif text-gray-500">
      {/* Ô TRỐNG: Tháng 8/2026 bắt đầu từ Thứ Bảy, cần 5 ô trống (T2->T6) */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={`empty-${i}`} className="h-8"></div>
      ))}

      {/* CÁC NGÀY TRONG THÁNG */}
      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
        <div key={day} className={`relative flex items-center justify-center h-8 ${day === 11 ? 'font-black text-[#8b0000]' : ''}`}>
          {day === 11 && (
            <svg className="absolute w-8 h-8 text-[#8b0000] scale-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          <span className="relative z-10">{day}</span>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* 5. ĐỊA ĐIỂM & BẢN ĐỒ */}
{/* Phần Lễ Thành Hôn tại Tư Gia */}
<div className="text-center p-6">
  <h2 className="text-xl font-bold uppercase mb-2">Lễ Thành Hôn</h2>
  <p className="text-sm mb-4">Vào lúc 9:00 - Thứ Ba</p>
  <div className="flex justify-center items-center gap-4 mb-4">
    <span className="text-4xl font-serif">11</span>
    <div className="text-left border-l pl-4 border-stone-400">
      <p className="text-xs uppercase">Tháng 8</p>
      <p className="text-xs">Năm 2026</p>
    </div>
  </div>
  <p className="text-xs italic mb-6">(Tức Ngày 29 Tháng 6 Năm Bính Ngọ)</p>
  
  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
    <p className="font-bold mb-1">TẠI TƯ GIA NHÀ TRAI</p>
    <p className="text-xs mb-4">Ba gia – An Điềm, Thôn Xuân Hòa, Xã Ba Gia, Tỉnh Quảng Ngãi</p>
    
    {/* Google Maps nhúng */}
    <div className="w-full h-56 rounded-xl overflow-hidden mb-4 shadow-inner">
      <iframe
       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10890.523089400649!2d108.67466500763612!3d15.192282176372863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3169b1c7e2a8cc8f%3A0xb85077fde744e1b7!2s%C3%94ng%20Cao%20Trung!5e0!3m2!1svi!2s!4v1772958694010!5m2!1svi!2s" 
       className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
       referrerpolicy="no-referrer-when-downgrade">
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

        {/* 6. ALBUM (Chuẩn bố cục tham chiếu) */}
        <section ref={secAlbumRef} className="py-6 px-4 bg-white fade-in-on-scroll">
          <div className="flex items-center justify-center gap-4 mb-10">
            <h3 className="text-3xl font-cursive text-gray-800" style={{ fontFamily: '"Dancing Script", cursive' }}>Album hình cưới</h3>
            <div className="flex-1 h-[1px] bg-gray-300 relative flex items-center justify-center max-w-[120px]">
               <span className="absolute bg-white px-2 text-[10px]">♥️</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Cột Trái: Ảnh dọc lớn, Ảnh ngang nhỏ */}
            <div className="flex flex-col gap-2">
              <img src="/anh-album-1.jpg" className="w-full h-auto object-cover rounded-sm shadow-sm" alt="A1" />
              <img src="/anh-album-3.jpg" className="w-full aspect-[4/3] object-cover rounded-sm shadow-sm" alt="A3" />
               <img src="/anh-album-5.jpg" className="w-full aspect-[4/3] object-cover rounded-sm shadow-sm" alt="A5" />
                <img src="/anh-album-7.jpg" className="w-full aspect-[4/3] object-cover rounded-sm shadow-sm" alt="A7" />
                 <img src="/anh-album-9.jpg" className="w-full aspect-[4/3] object-cover rounded-sm shadow-sm" alt="A9" />
            </div>
            {/* Cột Phải: Ảnh dọc lớn, Ảnh ngang nhỏ, Ảnh dọc lớn */}
            <div className="flex flex-col gap-2">
              <img src="/anh-album-2.jpg" className="w-full h-auto object-cover rounded-sm shadow-sm" alt="A2" />
              <img src="/anh-album-4.jpg" className="w-full aspect-[4/3] object-cover rounded-sm shadow-sm" alt="A4" />
              <img src="/anh-album-6.jpg" className="w-full h-auto object-cover rounded-sm shadow-sm" alt="A6" />
              <img src="/anh-album-8.jpg" className="w-full h-auto object-cover rounded-sm shadow-sm" alt="A8" />
              <img src="/anh-album-10.jpg" className="w-full h-auto object-cover rounded-sm shadow-sm" alt="A10" />
            </div>
          </div>
        </section>

        {/* 7. PHẦN KẾT: TẤT CẢ TRONG MỘT KHỐI */}
<section className="relative min-h-[750px] w-full flex flex-col items-center justify-end overflow-hidden">
  {/* LỚP ẢNH NỀN: Làm mờ nhẹ nhàng, không gây xấu */}
  <div className="absolute inset-0 z-0">
    <img 
      src="/anh-cuoi-cuoi.jpg" 
      className="w-full h-full object-cover brightness-[0.9] blur-[2px]" 
      alt="Final Background" 
    />
    {/* Lớp phủ gradient để các nút bấm nổi bật hơn trên nền ảnh */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40"></div>
  </div>

  {/* NỘI DUNG CHÍNH (Nằm trên cùng một nền ảnh) */}
  <div className="relative z-10 w-full flex flex-col items-center space-y-8">
    
    {/* KHỐI NÚT BẤM: Xác nhận & Gửi tiền */}
    <div className="w-full px-8 space-y-8 mb-20">
      <button 
        onClick={() => setShowRSVP(true)}
        className="w-full py-4 bg-stone-800/90 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl backdrop-blur-md border border-white/10 active:scale-95 transition-all"
      >
        Xác nhận tham dự lễ cưới
      </button>
      
      <div className="flex justify-center">
        <button 
          onClick={() => setShowGifts(true)}
          className="w-2/4 py-3 bg-[#8b0000]/90 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg backdrop-blur-md border border-white/10 active:scale-95 transition-all"
        >
          Gửi mừng cưới
        </button>
      </div>
    </div>

    {/* KHỐI THANK YOU: Tràn viền, Siêu trong suốt */}
    <div className="w-full py-5 mb-50 bg-white/5 backdrop-blur-[4px] border-y border-white/10 text-center">
      <p 
        className="text-6xl font-cursive text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" 
        style={{ fontFamily: '"Great Vibes", cursive' }}
      >
        thank you
      </p>
      
      <div className="h-[1px] w-20 bg-white/20 mx-auto"></div>
      
      <p className="text-lg italic font-light text-white/90 tracking-wide drop-shadow-md">
        Rất hân hạnh được đón tiếp!
      </p>
    </div>
    {/* FOOTER: Design by Morgan */}
<footer className="px-10 py-2 text-center text-white text-[9px] tracking-[0.4em] uppercase">
  <p>© 2026 | Design by Morgan</p>
</footer>
  </div>
</section>



        {/* MODAL RSVP */}
        {showRSVP && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[340px] rounded-[20px] p-8 relative animate-in zoom-in duration-300 shadow-2xl border border-stone-100">
              <button onClick={() => setShowRSVP(false)} className="absolute top-4 right-4 text-gray-400 text-xl font-light">✕</button>
              
              <h3 className="text-3xl font-cursive text-center mb-1 text-gray-800" style={{ fontFamily: '"Great Vibes", cursive' }}>Xác Nhận Tham Dự</h3>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[320px] rounded-[20px] p-8 relative text-center shadow-2xl border border-stone-100">
              <button onClick={() => setShowGifts(false)} className="absolute top-4 right-4 text-gray-400 text-xl font-light">✕</button>
              <h3 className="text-3xl font-cursive text-gray-800 mb-1" style={{ fontFamily: '"Great Vibes", cursive' }}>Gửi Mừng Cưới</h3>
              <div className="w-24 h-[1px] bg-gray-800 mx-auto mb-6 opacity-40"></div>

              <div className="bg-stone-50 p-4 rounded-xl mb-4 border border-stone-200 shadow-inner">
                <img src="/QRCODE-CR.png" className="w-40 h-40 mx-auto mix-blend-multiply" alt="QR" />
              </div>
              <p className="font-bold text-gray-800 text-sm uppercase">VCB - Le Cao Nhat Lap</p>
              <p className="text-xl font-serif mt-1 text-stone-600 font-bold tracking-wider">3335741122</p>
            </div>
          </div>
        )}

      </main>

      {/* CHÈN FONT CHỮ VÀO GLOBAL CSS */}
      <style jsx global>{`
        /* Nhúng fonts: Dancing Script, Great Vibes, Playfair Display (nếu cần Serif) */
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        /* Định nghĩa fonts phổ biến từ tham chiếu */
        .font-cursive { font-family: 'Dancing Script', cursive; }
        .font-cursive-great { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }

        /* Animation cho nút nhạc */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        /* Animation cho Hero Cover Phóng to mượt */
        @keyframes zoomIn {
          from { transform: scale(1); }
          to { transform: scale(1.07); }
        }
        .animate-zoom-in {
          animation: zoomIn 20s ease-out forwards;
        }

        /* Animation Chữ Nổi Lên từ tham chiếu */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        /* Hiệu ứng mờ dần trên Scroll cho Coder Lão Làng */
        .fade-in-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1.2s ease-out, transform 1.2s ease-out;
        }
        .fade-in-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}