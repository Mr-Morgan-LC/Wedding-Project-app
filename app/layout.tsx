import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- ĐÂY LÀ PHẦN SEO VÀ CHIA SẺ LINK ---
// Nhớ đổi thành domain thật của bạn sau khi gắn tên miền
const DOMAIN = 'https://thiepcuoi-nhatlap-quynhnhu.vercel.app'; 

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: 'Thiệp Mời Đám Cưới | Nhất Lập ❤️ Quỳnh Như',
  description: 'Trân trọng kính mời đến dự lễ thành hôn của Nhất Lập và Quỳnh Như vào ngày 11.08.2026...',
  openGraph: {
    title: 'Thiệp Mời Đám Cưới | Nhất Lập & Quỳnh Như',
    description: 'Trân trọng kính mời đến dự lễ thành hôn vào lúc 9:00 - Thứ Ba, 11.08.2026. Click để xem chi tiết!',
    url: DOMAIN,
    siteName: 'Đám Cưới Nhất Lập & Quỳnh Như',
    images: [
      {
        // 🔥 DÙNG LINK TUYỆT ĐỐI Ở ĐÂY
        url: `${DOMAIN}/anh-cuoi-cuoi.jpg`, 
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
    images: [`${DOMAIN}/anh-cuoi-cuoi.jpg`], // 🔥 Link tuyệt đối
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f4f4f4] text-gray-800`}>
  {children}
</body>
    </html>
  );
}