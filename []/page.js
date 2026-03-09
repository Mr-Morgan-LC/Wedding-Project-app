import { Metadata } from 'next';

// Hàm này giúp Google và Facebook "đọc" được nội dung link
export async function generateMetadata({ params }) {
  const { slug } = params;
  
  // Giả sử chú fetch data từ Database dựa vào slug
  // const weddingData = await getWeddingInfo(slug);

  return {
    title: `Thư mời tiệc cưới ${slug} - Lời mời trân trọng`,
    description: `Sự hiện diện của Quý khách là niềm vinh hạnh lớn đối với chúng tôi. Hãy cùng chúng tôi chia sẻ khoảnh khắc đặc biệt này!`,
    openGraph: {
      images: ['/anh-cuoi-cuoi.jpg'], // Ảnh hiện ra khi share link
    },
  };
}

export default function Page({ params }) {
  return <main>Nội dung thiệp mời ở đây...</main>;
}