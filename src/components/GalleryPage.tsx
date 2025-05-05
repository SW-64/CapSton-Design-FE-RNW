import React, { useState, useEffect } from "react";
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
  color: white;
`;

const Subtitle = styled.p`
  font-size: 1rem;
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
  margin-top: 2rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const ApiResponse = styled.div`
  color: white;
  font-size: 1.2rem;
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
`;

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    console.log("hello world");
    const testApi = async () => {
      try {
        const response = await fetch("http://backend.peopletophoto.site", {
          credentials: "include",
        });
        const data = await response.text();
        setResponse(data);
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        setResponse("API 호출 실패");
      }
    };

    testApi();
  }, []);

  return (
    <Container>
      <Header>
        <Title>갤러리</Title>
        <Subtitle>API 테스트</Subtitle>
      </Header>

      <ApiResponse>서버 응답: {response}</ApiResponse>

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

export default GalleryPage;
