import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";


const uvfa = localFont({ 
  src: '../public/fonts/UVF-a.ttf', // Kiểm tra xem file này có trong thư mục fonts chưa
  variable: '--font-uvfa',    // Tạo biến CSS để dùng nếu cần
  display: 'swap',
});

const fcclass = localFont({ 
  src: '../public/fonts/FC-Classy-Vogue.otf', // Kiểm tra xem file này có trong thư mục fonts chưa
  variable: '--font-fcclass',    // Tạo biến CSS để dùng nếu cần
  display: 'swap',
});

const edwardian = localFont({ 
  src: '../public/fonts/UTM-Edwardian.ttf', // Kiểm tra xem file này có trong thư mục fonts chưa
  variable: '--font-edwardian',
  display: 'swap',
});

// --- ĐÂY LÀ PHẦN SEO VÀ CHIA SẺ LINK ---
// Đổi DOMAIN thành tên miền thật của bạn nếu có mua tên miền riêng nhé
const DOMAIN = 'https://thiepcuoi-nhatlap-quynhnhu.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: 'Thiệp Mời Đám Cưới | Nhất Lập ❤️ Quỳnh Như',
  description: 'Trân trọng kính mời đến dự lễ thành hôn của Nhất Lập và Quỳnh Như vào ngày 11.08.2026. Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi!',
  openGraph: {
    title: 'Thiệp Mời Đám Cưới | Nhất Lập & Quỳnh Như',
    description: 'Trân trọng kính mời đến dự lễ thành hôn vào lúc 11:00 - Thứ Ba, 11.08.2026. Click để xem chi tiết!',
    url: DOMAIN,
    siteName: 'Đám Cưới Nhất Lập & Quỳnh Như',
    images: [
      {
        url: `${DOMAIN}/anh-web.jpg`, // Đã đổi thành link tuyệt đối
        width: 1200,
        height: 630,
        alt: 'Ảnh cưới Nhất Lập và Quỳnh Như',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thiệp Mời Đám Cưới | Nhất Lập ❤️ Quỳnh Như',
    description: 'Trân trọng kính mời đến dự lễ thành hôn vào ngày 11.08.2026.',
    images: [`${DOMAIN}/anh-web.jpg`], // Đã đổi thành link tuyệt đối
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        // Ép nền sáng và màu chữ tối ở đây để chống lại Dark Mode của điện thoại
        className={`${fcclass.variable} ${uvfa.variable} ${edwardian.variable} antialiased bg-[#f9f1ef] text-gray-800`}
      >
        {children}
      </body>
    </html>
  );
}