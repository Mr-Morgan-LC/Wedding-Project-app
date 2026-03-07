'use client';

import React, { useState, useRef } from 'react';

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

  // --- 2. LOGIC NHẠC ---
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => console.log("Cần tương tác để phát nhạc"));
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

      {/* KHUNG NỘI DUNG CHÍNH (450px) */}
      <main className="w-full max-w-[450px] bg-[#fdfcfb] min-h-screen shadow-2xl relative overflow-x-hidden">
        
        {/* NÚT NHẠC XOAY TRÒN (Góc phải) */}
        <div className="fixed top-6 right-6 z-50">
          <button 
            onClick={toggleMusic}
            className={`w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-gray-100 transition-all ${isPlaying ? 'animate-spin-slow' : 'opacity-70'}`}
          >
            {isPlaying ? '🎵' : '🔇'}
          </button>
        </div>

        {/* 1. PHẦN MỞ ĐẦU (HERO) */}
        <section className="relative h-[750px] w-full flex flex-col items-center justify-between py-12">
          <div className="absolute inset-0">
            <img src="/anh-bia.jpg" className="w-full h-full object-cover" alt="Bìa" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fdfcfb]"></div>
          </div>
          <div className="relative z-10 text-center px-4 mt-6">
            <h1 className="text-4xl italic font-serif" style={{ fontFamily: "cursive" }}>Nhất Lập & Quỳnh Như</h1>
          </div>
          <div className="relative z-10 text-center w-full px-12 mb-10">
            <div className="  py-6 space-y-2 ">
              <p className="uppercase tracking-[0.4em] text-[10px] text-gray-900">Thư mời tiệc cưới</p>
              <p className="text-lg font-light text-gray-900">18:00 - Chủ Nhật</p>
              <div className="text-4xl font-bold tracking-widest text-gray-900">14.12.2025</div>
            </div>
          </div>
        </section>

        {/* 2. THÔNG TIN GIA ĐÌNH */}
        <section className="py-16 px-6 text-center bg-white">
           <div className="mb-12 italic font-serif text-gray-600 space-y-1 text-sm">

            <p>"Hôn nhân là chuyện cả đời,</p>

            <p>Yêu người vừa ý, cưới người mình thương..."</p>

          </div>
          <div className="flex justify-between mb-12 text-[11px] uppercase tracking-widest leading-loose">
            <div className="w-1/2 border-r border-gray-100 pr-2">
              <p className="text-gray-400 mb-1">Nhà Trai</p>
              <p className="font-bold">Lê Cao Trung</p>
              <p className="font-bold">Đinh Thị Viên</p>
            </div>
            <div className="w-1/2 pl-2">
              <p className="text-gray-400 mb-1">Nhà Gái</p>
              <p className="font-bold">Châu Văn Tấn</p>
              <p className="font-bold">Biên</p>
            </div>
          </div>
          <div className="text-3xl italic mb-10 text-gray-800" style={{ fontFamily: "cursive" }}>Nhất Lập ❤️ Quỳnh Như</div>
          <div className="flex gap-2 h-64 overflow-hidden rounded-lg px-2">
             <img src="/chure.png" className="w-1/2 h-full object-cover" alt="Groom" />
             <img src="/codau.JPG" className="w-1/2 h-full object-cover" alt="Bride" />
          </div>
        </section>

        {/* 3. LỄ THÀNH HÔN (Bố cục 3 ảnh) */}
        <section className="py-16 px-4 bg-stone-50">
          <div className="flex items-center justify-center gap-1 mb-10">
            <img src="/anh-phu-1.jpg" className="w-1/4 aspect-[3/4] object-cover opacity-70 scale-90" alt="1" />
            <img src="/anh-chinh.jpg" className="w-2/5 aspect-[3/4.5] object-cover shadow-xl z-10" alt="2" />
            <img src="/anh-phu-2.jpg" className="w-1/4 aspect-[3/4] object-cover opacity-70 scale-90" alt="3" />
          </div>
          <div className="text-center">
            <h3 className="uppercase tracking-[0.3em] font-bold text-sm">Lễ Thành Hôn</h3>
            <div className="h-[1px] w-20 bg-stone-300 mx-auto my-4"></div>
            <p className="text-3xl font-bold">14 . 12 . 2025</p>
            <p className="text-[10px] text-gray-400 mt-2 uppercase">Tại Tư Gia Nhà Trai</p>
          </div>
        </section>

        {/* 4. LỊCH THÁNG 12 */}
        <section className="py-16 px-8 bg-white">
          <div className="flex justify-between items-end mb-6">
            <span className="text-3xl italic font-serif text-stone-800" style={{ fontFamily: "cursive" }}>Tháng 12</span>
            <span className="text-5xl font-black text-stone-100">2025</span>
          </div>
          <div className="grid grid-cols-7 gap-y-4 text-center text-[10px]">
            {['T2','T3','T4','T5','T6','T7','CN'].map(d=>(<div key={d} className="font-bold text-stone-400">{d}</div>))}
            {Array.from({length: 31}, (_, i) => i + 1).map(day => (
              <div key={day} className={`relative py-2 ${day === 14 ? 'text-white' : 'text-stone-600'}`}>
                {day === 14 && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 bg-[#8b5e3c] rounded-full shadow-lg scale-110"></div></div>}
                <span className="relative z-10">{day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. BẢN ĐỒ & ĐỊA ĐIỂM */}
        <section className="py-16 px-6 bg-stone-50 text-center">
          <h3 className="uppercase tracking-widest font-bold mb-6">Địa Điểm Tổ Chức</h3>
          <div className="bg-white p-4 rounded-3xl shadow-sm space-y-4">
            <div className="w-full h-48 bg-gray-200 rounded-2xl overflow-hidden shadow-inner">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1!2d106.6!3d10.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzAwLjAiTiAxMDbCsDM2JzAwLjAiRQ!5e0!3m2!1svi!2s!4v1"
                className="w-full h-full grayscale border-0"
                allowFullScreen
              ></iframe>
            </div>
            <p className="font-bold text-sm uppercase">Trung tâm tiệc cưới The Adora</p>
            <p className="text-[11px] text-gray-500">431 Hoàng Văn Thụ, Tân Bình, TP. HCM</p>
            <button className="w-full py-3 border border-stone-200 rounded-xl text-[10px] uppercase font-bold tracking-widest active:bg-stone-50">Chỉ đường</button>
          </div>
        </section>

        {/* 6. ALBUM (Pinterest Style) */}
        <section className="py-16 px-4 bg-white">
          <h3 className="text-2xl italic font-serif text-center mb-10" style={{ fontFamily: "cursive" }}>Album Hình Cưới</h3>
          <div className="columns-2 gap-2 space-y-2">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <img key={i} src={`/anh-album-${i}.jpg`} className="w-full rounded shadow-sm" alt="Gallery" />
            ))}
          </div>
        </section>

        {/* 7. PHẦN KẾT (Nút bấm mờ Glassmorphism) */}
        <section className="relative h-[650px] w-full flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="/anh-cuoi-cuoi.jpg" className="w-full h-full object-cover blur-[4px] brightness-75" alt="Final" />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="relative z-10 w-full px-12 space-y-5">
            <button 
              onClick={() => setShowRSVP(true)}
              className="w-full py-4 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl text-gray-900 font-bold text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
            >
              Xác nhận tham dự
            </button>
            <button 
              onClick={() => setShowGifts(true)}
              className="w-full py-4 bg-[#8b0000] rounded-2xl text-white font-bold text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
            >
              Gửi mừng cưới
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-10 text-center text-gray-300 text-[8px] tracking-[0.5em] uppercase">
          <p>© 2025 Nhất Lập & Quỳnh Như - Wedding</p>
        </footer>

        {/* MODAL RSVP */}
        {showRSVP && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[360px] rounded-[40px] p-8 relative animate-in zoom-in duration-300">
              <button onClick={() => setShowRSVP(false)} className="absolute top-6 right-6 text-gray-400">✕</button>
              <h3 className="text-2xl font-serif italic text-center mb-8" style={{ fontFamily: "cursive" }}>Xác Nhận Tham Dự</h3>
              <form onSubmit={handleRSVPSubmit} className="space-y-4">
                <input required placeholder="Họ và tên khách mời" className="w-full p-4 rounded-full border border-gray-100 bg-stone-50 text-sm outline-none" onChange={e=>setFormData({...formData, name: e.target.value})} />
                <input placeholder="Quan hệ với Dâu / Rể" className="w-full p-4 rounded-full border border-gray-100 bg-stone-50 text-sm outline-none" onChange={e=>setFormData({...formData, relation: e.target.value})} />
                <select className="w-full p-4 rounded-full border border-gray-100 bg-stone-50 text-sm outline-none" onChange={e=>setFormData({...formData, attending: e.target.value})}>
                  <option value="yes">Mình sẽ tham dự!</option>
                  <option value="no">Tiếc quá, mình bận mất rồi</option>
                </select>
                <textarea placeholder="Lời chúc gửi Dâu & Rể..." className="w-full p-4 rounded-[25px] border border-gray-100 bg-stone-50 text-sm outline-none h-24 resize-none" onChange={e=>setFormData({...formData, message: e.target.value})} />
                <button disabled={loading} className="w-full py-4 bg-[#333] text-white rounded-full font-bold uppercase text-[10px] tracking-widest shadow-lg">
                  {loading ? "ĐANG GỬI..." : "GỬI XÁC NHẬN"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL QUÀ TẶNG */}
        {showGifts && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[340px] rounded-[40px] p-10 relative text-center">
              <button onClick={() => setShowGifts(false)} className="absolute top-6 right-6 text-gray-400">✕</button>
              <h3 className="text-2xl font-serif italic mb-6" style={{ fontFamily: "cursive" }}>Gửi Mừng Cưới</h3>
              <div className="bg-stone-50 p-4 rounded-3xl mb-4 border-2 border-dashed border-stone-200">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=8838683860" className="w-40 h-40 mx-auto mix-blend-multiply" alt="QR" />
              </div>
              <p className="font-bold text-gray-800 text-sm uppercase">VCBANK - Le Cao Nhat Lap</p>
              <p className="text-xl font-mono mt-1 text-stone-600 font-bold">3335741122</p>
            </div>
          </div>
        )}

      </main>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}