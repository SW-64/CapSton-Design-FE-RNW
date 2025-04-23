import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const PhotoCard = styled(motion.div)`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const PhotoImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
`;

const PhotoContent = styled.div`
  padding: 1rem;
`;

const PhotoTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const PhotoNotes = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const NavigationButton = styled(motion.button)`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled(motion.div)`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  position: relative;
  width: 80%;
  max-width: 800px;
`;

const ModalHeader = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const HeaderButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.8);
  border: none;
  color: black;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 1);
  }
`;

const InfoContainer = styled.div`
  margin-top: 1rem;
`;

const SpotName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const Notes = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

interface Photo {
  id: number;
  spotName: string;
  imageUrl: string;
  notes: string;
}

const photos: Photo[] = [
  {
    id: 1,
    spotName: "남산서울타워",
    imageUrl: "https://picsum.photos/800/600",
    notes: "야경이 정말 아름다운 곳입니다. 특히 저녁 8시에 가면 더 좋아요.",
  },
  {
    id: 2,
    spotName: "경복궁",
    imageUrl: "https://picsum.photos/800/600",
    notes:
      "봄에는 벚꽃이 만개해서 정말 아름다워요. 주말에는 사람이 많으니 평일에 가는 것을 추천합니다.",
  },
  {
    id: 3,
    spotName: "해운대",
    imageUrl: "https://picsum.photos/800/600",
    notes: "여름에는 정말 시원하고 좋습니다. 해수욕장 주변에 맛집도 많아요.",
  },
];

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleDownload = async () => {
    if (!selectedPhoto) return;
    try {
      const response = await fetch(selectedPhoto.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `photo-${selectedPhoto.spotName}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("다운로드 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>갤러리</Title>
        <Subtitle>아름다운 순간들을 감상하세요</Subtitle>
      </Header>

      <PhotoGrid>
        <AnimatePresence>
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <PhotoImage imageUrl={photo.imageUrl} />
              <PhotoContent>
                <PhotoTitle>{photo.spotName}</PhotoTitle>
                <PhotoNotes>{photo.notes}</PhotoNotes>
              </PhotoContent>
            </PhotoCard>
          ))}
        </AnimatePresence>
      </PhotoGrid>

      <NavigationButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/community")}
      >
        커뮤니티로 이동
      </NavigationButton>

      <AnimatePresence>
        {selectedPhoto && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <HeaderButton
                  onClick={handleDownload}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ↓
                </HeaderButton>
                <HeaderButton
                  onClick={() => setSelectedPhoto(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </HeaderButton>
              </ModalHeader>
              <PhotoImage imageUrl={selectedPhoto.imageUrl} />
              <InfoContainer>
                <SpotName>{selectedPhoto.spotName}</SpotName>
                <Notes>{selectedPhoto.notes}</Notes>
              </InfoContainer>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default GalleryPage;
