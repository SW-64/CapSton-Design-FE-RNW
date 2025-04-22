export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: number;
  imageUrl?: string;
  tags: string[];
}

export const posts: Post[] = [
  {
    id: 1,
    title: "오늘 찍은 풍경 사진 공유합니다",
    content:
      "주말에 산책하면서 찍은 아름다운 풍경 사진입니다. 날씨가 정말 좋았어요.",
    author: "사진가김철수",
    createdAt: "2023-06-15T14:30:00",
    likes: 42,
    comments: 8,
    imageUrl:
      "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg",
    tags: ["풍경", "자연", "주말"],
  },
  {
    id: 2,
    title: "인물 사진 촬영 팁 공유",
    content:
      "인물 사진을 더 잘 찍기 위한 몇 가지 팁을 공유합니다. 조명과 구도가 중요해요.",
    author: "프로포토그래퍼",
    createdAt: "2023-06-14T09:15:00",
    likes: 78,
    comments: 15,
    imageUrl:
      "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg",
    tags: ["인물", "팁", "촬영기법"],
  },
  {
    id: 3,
    title: "새로 구매한 카메라 소개",
    content:
      "드디어 구매한 드림 카메라입니다. 사용 후기와 샘플 사진을 공유합니다.",
    author: "카메라맨",
    createdAt: "2023-06-13T18:45:00",
    likes: 56,
    comments: 12,
    imageUrl:
      "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
    tags: ["장비", "리뷰", "새장비"],
  },
  {
    id: 4,
    title: "도시 야경 촬영 가이드",
    content:
      "도시의 야경을 멋지게 찍는 방법을 공유합니다. 삼각대가 필수입니다.",
    author: "야경마스터",
    createdAt: "2023-06-12T22:10:00",
    likes: 93,
    comments: 21,
    imageUrl:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    tags: ["야경", "도시", "촬영기법"],
  },
  {
    id: 5,
    title: "자연 사진 촬영 여행기",
    content:
      "지난 주말 자연 사진 촬영 여행을 갔습니다. 아름다운 풍경과 함께 여행기를 공유합니다.",
    author: "자연사랑",
    createdAt: "2023-06-11T15:20:00",
    likes: 67,
    comments: 9,
    imageUrl:
      "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg",
    tags: ["여행", "자연", "풍경"],
  },
  {
    id: 6,
    title: "인물 사진 촬영 후기",
    content:
      "모델과 함께한 인물 사진 촬영 후기입니다. 다양한 포즈와 조명 시도해봤어요.",
    author: "인물전문가",
    createdAt: "2023-06-10T11:05:00",
    likes: 45,
    comments: 7,
    imageUrl:
      "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg",
    tags: ["인물", "촬영후기", "모델"],
  },
  {
    id: 7,
    title: "건축물 사진 촬영 팁",
    content:
      "건축물 사진을 더 멋지게 찍는 방법을 공유합니다. 선과 대칭이 중요해요.",
    author: "건축사진가",
    createdAt: "2023-06-09T16:40:00",
    likes: 52,
    comments: 11,
    imageUrl:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    tags: ["건축", "팁", "촬영기법"],
  },
  {
    id: 8,
    title: "음식 사진 촬영 가이드",
    content:
      "음식 사진을 더 맛있게 보이게 찍는 방법을 공유합니다. 조명과 각도가 중요해요.",
    author: "푸드포토",
    createdAt: "2023-06-08T13:25:00",
    likes: 88,
    comments: 18,
    imageUrl:
      "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
    tags: ["음식", "팁", "촬영기법"],
  },
  {
    id: 9,
    title: "여행 사진 촬영 후기",
    content:
      "지난 여행에서 찍은 사진들을 공유합니다. 다양한 장소와 순간을 담았어요.",
    author: "여행사진가",
    createdAt: "2023-06-07T19:50:00",
    likes: 63,
    comments: 14,
    imageUrl:
      "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
    tags: ["여행", "풍경", "후기"],
  },
  {
    id: 10,
    title: "스포츠 사진 촬영 팁",
    content:
      "스포츠 사진을 더 역동적으로 찍는 방법을 공유합니다. 셔터스피드가 중요해요.",
    author: "스포츠포토",
    createdAt: "2023-06-06T10:15:00",
    likes: 71,
    comments: 16,
    imageUrl:
      "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
    tags: ["스포츠", "팁", "촬영기법"],
  },
];
