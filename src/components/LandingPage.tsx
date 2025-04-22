import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { photos } from "../data/photos";

const LandingContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
`;

const WelcomeText = styled(motion.h1)`
  font-size: 5rem;
  color: white;
  text-align: center;
  margin-bottom: 4rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const SlideshowContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  margin-bottom: 4rem;
  overflow: hidden;
`;

const Slide = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
`;

const EnterButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.5rem;
  background: transparent;
  border: 2px solid white;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 30px;

  &:hover {
    background: white;
    color: black;
  }
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const shuffledPhotos = [...photos]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % shuffledPhotos.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [shuffledPhotos.length]);

  return (
    <LandingContainer>
      <WelcomeText
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        환영합니다
      </WelcomeText>

      <SlideshowContainer>
        <AnimatePresence mode="wait">
          <Slide
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <SlideImage
              src={shuffledPhotos[currentSlide].url}
              alt={shuffledPhotos[currentSlide].title}
            />
          </Slide>
        </AnimatePresence>
      </SlideshowContainer>

      <EnterButton
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/gallery")}
      >
        사진 구경하러 가기
      </EnterButton>
    </LandingContainer>
  );
};

export default LandingPage;
