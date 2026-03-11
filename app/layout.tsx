import type { Metadata, Viewport } from "next";
import "./globals.css";

// --- TỐI ƯU METADATA (Dành cho việc chia sẻ link) ---
export const metadata: Metadata = {
  title: "Thiệp mời đám cưới Nhất Lập & Quỳnh Như",
  description: "Trân trọng kính mời bạn đến tham dự lễ thành hôn của chúng mình vào ngày 11/08/2026. Sự hiện diện của bạn là niềm vinh dự cho gia đình chúng mình!",
  keywords: ["Wedding Invitation", "Nhất Lập", "Quỳnh Như", "Thiệp cưới online"],
  authors: [{ name: "Morgan" }],
  openGraph: {
    title: "Thiệp mời đám cưới Nhất Lập & Quỳnh Như",
    description: "Trân trọng kính mời bạn đến dự tiệc cưới của Nhất Lập & Quỳnh Như!",
    url: "https://wedding-nhatlap-quynhnhu.vercel.app/", // Thay bằng domain thật của bạn
    siteName: "Nhất Lập & Quỳnh Như Wedding",
    images: [
      {
        url: "/anh-web.jpg", // Bạn nên tạo 1 ảnh 1200x630px để khi gửi link Zalo/FB sẽ hiện ảnh này
        width: 1200,
        height: 630,
        alt: "Thiệp cưới Nhất Lập & Quỳnh Như",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lễ Thành Hôn: Nhất Lập & Quỳnh Như",
    description: "Trân trọng kính mời bạn đến dự tiệc cưới của chúng mình!",
    images: ["/anh-web.jpg"],
  },
  icons: {
    icon: "/MG.png", // Nhớ thêm file icon nhỏ ở public để hiện trên tab trình duyệt
  },
};

// --- CẤU HÌNH VIEWPORT (Đảm bảo hiển thị chuẩn trên mọi điện thoại) ---
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased overflow-x-hidden selection:bg-[#910000] selection:text-white">
        {/* Bạn có thể thêm các thành phần dùng chung như:
            - Thanh loading
            - Google Analytics (nếu cần)
            - Background cố định
        */}
        {children}
      </body>
    </html>
  );
}