import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { myPhotos, MyPhoto } from "../data/myPhotos";
import { useNavigate } from "react-router-dom";

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
  position: relative;
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    .overlay {
      opacity: 1;
    }
  }
`;

const PhotoImage = styled.div<{ imageUrl: string }>`
  height: 300px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
`;

const PhotoInfo = styled.div`
  padding: 1.5rem;
`;

const PhotoTitle = styled.h2`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const PhotoDescription = styled.p`
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PhotoDate = styled.span`
  color: #666;
  font-size: 0.8rem;
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const ActionButton = styled(motion.button)`
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: #5b4bc4;
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

  const handleEdit = (id: number) => {
    console.log("Edit photo:", id);
  };

  const handleDelete = (id: number) => {
    setPhotos(photos.filter((photo) => photo.id !== id));
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
            >
              <MyBadge>My</MyBadge>
              <PhotoImage imageUrl={photo.imageUrl} />
              <PhotoInfo>
                <PhotoTitle>{photo.title}</PhotoTitle>
                <PhotoDescription>{photo.description}</PhotoDescription>
                <PhotoDate>{formatDate(photo.uploadedAt)}</PhotoDate>
              </PhotoInfo>
              <Overlay className="overlay">
                <ActionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(photo.id)}
                >
                  수정
                </ActionButton>
                <ActionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(photo.id)}
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
    </Container>
  );
};

export default MyPhotosPage;
