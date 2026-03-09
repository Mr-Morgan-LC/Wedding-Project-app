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
export const metadata: Metadata = {
  //  Khai báo tên miền gốc của bạn
  metadataBase: new URL('https://thiepcuoi-nhatlap-quynhnhu.vercel.app/'),
  title: 'Thiệp Mời Đám Cưới | Nhất Lập ❤️ Quỳnh Như',
  description: 'Trân trọng kính mời đến dự lễ thành hôn của Nhất Lập và Quỳnh Như vào ngày 11.08.2026. Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi!',
  openGraph: {
    title: 'Thiệp Mời Đám Cưới | Nhất Lập & Quỳnh Như',
    description: 'Trân trọng kính mời đến dự lễ thành hôn vào lúc 9:00 - Thứ Ba, 11.08.2026. Click để xem chi tiết!',
    url: '/', // Đổi thành tên miền thật của bạn sau khi deploy
    siteName: 'Đám Cưới Nhất Lập & Quỳnh Như',
    images: [
      {
        url: '/anh-cuoi-cuoi.jpg', // Nhớ thêm ảnh này vào thư mục public nhé // Next.js sẽ tự ghép thành https://thiepcuoi-nhatlap-quynhnhu.com/anh-cuoi-cuoi.jpg
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
    images: ['/anh-cuoi-cuoi.jpg'],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}