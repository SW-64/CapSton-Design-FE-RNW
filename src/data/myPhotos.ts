export interface MyPhoto {
  id: number;
  title: string;
  imageUrl: string;
  uploadedAt: string;
  description: string;
}

export const myPhotos: MyPhoto[] = [
  {
    id: 1,
    title: "서울 야경",
    imageUrl:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    uploadedAt: "2024-03-15T14:30:00",
    description: "남산서울타워에서 바라본 서울의 야경입니다.",
  },
  {
    id: 2,
    title: "봄꽃",
    imageUrl:
      "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg",
    uploadedAt: "2024-03-14T09:15:00",
    description: "벚꽃이 만발한 봄날의 풍경입니다.",
  },
  {
    id: 3,
    title: "바다",
    imageUrl:
      "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
    uploadedAt: "2024-03-13T18:45:00",
    description: "부산 해운대의 아름다운 바다 풍경입니다.",
  },
  {
    id: 4,
    title: "도시 풍경",
    imageUrl:
      "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg",
    uploadedAt: "2024-03-12T22:10:00",
    description: "도시의 활기찬 모습을 담았습니다.",
  },
  {
    id: 5,
    title: "산",
    imageUrl:
      "https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg",
    uploadedAt: "2024-03-11T15:20:00",
    description: "설악산의 웅장한 풍경입니다.",
  },
  {
    id: 6,
    title: "거리",
    imageUrl:
      "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg",
    uploadedAt: "2024-03-10T11:05:00",
    description: "서울의 번화한 거리 풍경입니다.",
  },
];
