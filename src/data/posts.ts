export interface Post {
  id: number;
  nickname: string;
  spotName: string;
  imageUrl: string;
  notes: string;
  bookmarks: number;
  createdAt: string;
}

export const posts: Post[] = [
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
  {
    id: 4,
    nickname: "인물사진가1",
    spotName: "인물사진촬영장소1",
    imageUrl:
      "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg",
    notes:
      "인물 사진을 더 잘 찍기 위한 몇 가지 팁을 공유합니다. 조명과 구도가 중요해요.",
    bookmarks: 123,
    createdAt: "2024-03-12T09:15:00",
  },
  {
    id: 5,
    nickname: "자연사진가1",
    spotName: "자연사진촬영장소1",
    imageUrl:
      "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg",
    notes:
      "지난 주말 자연 사진 촬영 여행을 갔습니다. 아름다운 풍경과 함께 여행기를 공유합니다.",
    bookmarks: 159,
    createdAt: "2024-03-11T15:20:00",
  },
  {
    id: 6,
    nickname: "인물사진가2",
    spotName: "인물사진촬영장소2",
    imageUrl:
      "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg",
    notes:
      "모델과 함께한 인물 사진 촬영 후기입니다. 다양한 포즈와 조명 시도해봤어요.",
    bookmarks: 102,
    createdAt: "2024-03-10T11:05:00",
  },
  {
    id: 7,
    nickname: "건축사진가1",
    spotName: "건축물사진촬영장소1",
    imageUrl:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    notes:
      "건축물 사진을 더 멋지게 찍는 방법을 공유합니다. 선과 대칭이 중요해요.",
    bookmarks: 135,
    createdAt: "2024-03-09T16:40:00",
  },
  {
    id: 8,
    nickname: "푸드포토1",
    spotName: "음식사진촬영장소1",
    imageUrl:
      "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
    notes:
      "음식 사진을 더 맛있게 보이게 찍는 방법을 공유합니다. 조명과 각도가 중요해요.",
    bookmarks: 178,
    createdAt: "2024-03-08T13:25:00",
  },
  {
    id: 9,
    nickname: "여행사진가1",
    spotName: "여행사진촬영장소1",
    imageUrl:
      "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
    notes:
      "지난 여행에서 찍은 사진들을 공유합니다. 다양한 장소와 순간을 담았어요.",
    bookmarks: 147,
    createdAt: "2024-03-07T19:50:00",
  },
  {
    id: 10,
    nickname: "스포츠포토1",
    spotName: "스포츠사진촬영장소1",
    imageUrl:
      "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
    notes:
      "스포츠 사진을 더 역동적으로 찍는 방법을 공유합니다. 셔터스피드가 중요해요.",
    bookmarks: 165,
    createdAt: "2024-03-06T10:15:00",
  },
];
