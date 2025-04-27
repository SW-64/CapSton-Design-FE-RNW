import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mainSlides } from "../data/mainSlides";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Shadows Into Light', cursive;
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
  position: relative;
  overflow: hidden;
`;

const SlideContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const SlideImage = styled(motion.div)<{ imageUrl: string }>`
  width: 100%;
  height: 100%;
  position: absolute;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  filter: brightness(0.3);
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: "Shadows Into Light", cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 11rem;
  margin-bottom: 4rem;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: -1px;
  transform: rotate(-1deg);
  line-height: 0.9;
`;

const Subtitle = styled.p`
  font-family: "Poor Story", cursive;
  font-weight: 400;
  font-size: 2.5rem;
  margin-bottom: 5rem;
  opacity: 0.95;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
`;

const Button = styled(motion.button)`
  font-family: "Poor Story", cursive;
  padding: 1.2rem 2.8rem;
  font-size: 1.8rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid white;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 400;
  letter-spacing: 1px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainSlides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        <SlideContainer>
          <AnimatePresence mode="wait">
            <SlideImage
              key={currentSlide}
              imageUrl={mainSlides[currentSlide].imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
        </SlideContainer>
        <Content>
          <Title>Spot-Right</Title>
          <Subtitle>저작권 무료 사진 사이트</Subtitle>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/gallery")}
          >
            사진 구경하러 가기
          </Button>
        </Content>
      </Container>
    </>
  );
};

export default LandingPage;
