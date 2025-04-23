export interface BookmarkedPhoto {
  id: number;
  nickname: string;
  spotName: string;
  imageUrl: string;
  notes: string;
  bookmarks: number;
  createdAt: string;
}

export const bookmarkedPhotos: BookmarkedPhoto[] = [
  {
    id: 1,
    nickname: "여행가1",
    spotName: "남산서울타워",
    imageUrl:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    notes: "야경이 정말 아름다운 곳입니다. 특히 저녁 8시에 가면 더 좋아요.",
    bookmarks: 156,
    createdAt: "2024-03-15T14:30:00",
  },
  {
    id: 2,
    nickname: "여행가2",
    spotName: "경복궁",
    imageUrl:
      "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg",
    notes:
      "봄에는 벚꽃이 만개해서 정말 아름다워요. 주말에는 사람이 많으니 평일에 가는 것을 추천합니다.",
    bookmarks: 243,
    createdAt: "2024-03-14T09:15:00",
  },
  {
    id: 3,
    nickname: "여행가3",
    spotName: "해운대",
    imageUrl:
      "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
    notes: "여름에는 정말 시원하고 좋습니다. 해수욕장 주변에 맛집도 많아요.",
    bookmarks: 189,
    createdAt: "2024-03-13T18:45:00",
  },
];
