export interface BookmarkedPhoto {
  id: number;
  title: string;
  imageUrl: string;
  bookmarkedAt: string;
  likes: number;
  author: string;
  description: string;
}

export const bookmarkedPhotos: BookmarkedPhoto[] = [
  {
    id: 1,
    title: "도시 야경",
    imageUrl:
      "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg",
    bookmarkedAt: "2024-03-15T14:30:00",
    likes: 156,
    author: "사진작가1",
    description: "도시의 밤 풍경을 담은 작품입니다.",
  },
  {
    id: 2,
    title: "자연 풍경",
    imageUrl:
      "https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg",
    bookmarkedAt: "2024-03-14T09:15:00",
    likes: 243,
    author: "사진작가2",
    description: "아름다운 자연의 모습을 담았습니다.",
  },
  {
    id: 3,
    title: "인물 사진",
    imageUrl:
      "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg",
    bookmarkedAt: "2024-03-13T18:45:00",
    likes: 189,
    author: "사진작가3",
    description: "인물의 표정과 감정을 담은 작품입니다.",
  },
];
