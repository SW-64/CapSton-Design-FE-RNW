import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mainSlides } from "../data/mainSlides";

const Container = styled.div`
  min-height: 100vh;
  background: #000;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 4rem;
  text-align: center;
  margin-bottom: 4rem;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
`;

const PhotoCard = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 12px;
  cursor: pointer;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${PhotoCard}:hover & {
    transform: scale(1.05);
  }
`;

const PhotoInfo = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${PhotoCard}:hover & {
    opacity: 1;
  }
`;

const PhotoTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const PhotoLocation = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const Button = styled(motion.button)`
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid white;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 4rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>환영합니다</Title>
      <PhotoGrid>
        {mainSlides.map((slide, index) => (
          <PhotoCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Photo src={slide.imageUrl} alt={slide.title} />
            <PhotoInfo>
              <PhotoTitle>{slide.title}</PhotoTitle>
              <PhotoLocation>{slide.location}</PhotoLocation>
            </PhotoInfo>
          </PhotoCard>
        ))}
      </PhotoGrid>
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/community")}
      >
        사진 구경하러 가기
      </Button>
    </Container>
  );
};

export default MainPage;
