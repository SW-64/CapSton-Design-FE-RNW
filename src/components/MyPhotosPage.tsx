import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PhotoModal from "./PhotoModal";

interface MyPhoto {
  id: number;
  spotName: string;
  imageUrl: string;
  notes: string;
  bookmarks: number;
  createdAt: string;
}

const myPhotos: MyPhoto[] = [
  {
    id: 1,
    spotName: "남산서울타워",
    imageUrl:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    notes: "야경이 정말 아름다운 곳입니다. 특히 저녁 8시에 가면 더 좋아요.",
    bookmarks: 156,
    createdAt: "2024-03-15T14:30:00",
  },
  {
    id: 2,
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
    spotName: "해운대",
    imageUrl:
      "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
    notes: "여름에는 정말 시원하고 좋습니다. 해수욕장 주변에 맛집도 많아요.",
    bookmarks: 189,
    createdAt: "2024-03-13T18:45:00",
  },
];

const Container = styled.div`
  min-height: 100vh;
  background: #121212;
  padding: 2rem;
  padding-bottom: 100px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #888;
  font-size: 1.1rem;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PhotoCard = styled(motion.div)`
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    .overlay {
      opacity: 1;
    }
  }
`;

const PhotoImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  padding-top: 100%;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const PhotoInfo = styled.div`
  padding: 1.2rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
`;

const PhotoTitle = styled.h2`
  color: white;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const PhotoNotes = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PhotoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const BookmarkCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: white;
`;

const MyBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #6c5ce7;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const ToggleButton = styled(motion.button)<{ isPublic: boolean }>`
  background: ${(props) => (props.isPublic ? "#4CAF50" : "#f44336")};
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${(props) => (props.isPublic ? "#45a049" : "#d32f2f")};
  }
`;

const ActionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.9);
  color: #1e1e1e;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: white;
  }
`;

const UploadButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #6c5ce7;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  &:hover {
    background: #5b4bc4;
  }
`;

const NavigationButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  &:hover {
    background: #5b4bc4;
  }
`;

const MyPhotosPage: React.FC = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<MyPhoto[]>(myPhotos);
  const [isPublic, setIsPublic] = useState<{ [key: number]: boolean }>({});
  const [selectedPhoto, setSelectedPhoto] = useState<MyPhoto | null>(null);

  const handleEdit = (id: number) => {
    console.log("Edit photo:", id);
  };

  const handleDelete = (id: number) => {
    setPhotos(photos.filter((photo) => photo.id !== id));
  };

  const handleTogglePublic = (id: number) => {
    setIsPublic((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container>
      <Header>
        <Title>내가 올린 사진</Title>
        <Subtitle>나만의 갤러리를 관리하세요</Subtitle>
      </Header>

      <PhotoGrid>
        <AnimatePresence>
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <MyBadge>My</MyBadge>
              <PhotoImage imageUrl={photo.imageUrl} />
              <PhotoInfo>
                <PhotoTitle>{photo.spotName}</PhotoTitle>
                <PhotoNotes>{photo.notes}</PhotoNotes>
                <PhotoMeta>
                  <span>{formatDate(photo.createdAt)}</span>
                  <BookmarkCount>
                    <span>🔖</span>
                    <span>{photo.bookmarks}</span>
                  </BookmarkCount>
                </PhotoMeta>
              </PhotoInfo>
              <Overlay className="overlay">
                <ToggleButton
                  isPublic={isPublic[photo.id] || false}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePublic(photo.id);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPublic[photo.id] ? "공개" : "비공개"}
                </ToggleButton>
                <ActionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(photo.id);
                  }}
                >
                  수정
                </ActionButton>
                <ActionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(photo.id);
                  }}
                >
                  삭제
                </ActionButton>
              </Overlay>
            </PhotoCard>
          ))}
        </AnimatePresence>
      </PhotoGrid>

      <UploadButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => console.log("Upload new photo")}
      >
        +
      </UploadButton>

      <NavigationButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/community")}
      >
        커뮤니티로 이동
      </NavigationButton>

      <PhotoModal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        imageUrl={selectedPhoto?.imageUrl || ""}
        spotName={selectedPhoto?.spotName || ""}
        notes={selectedPhoto?.notes || ""}
        nickname="나"
        isBookmarked={false}
        onBookmark={() => {}}
      />
    </Container>
  );
};

export default MyPhotosPage;
