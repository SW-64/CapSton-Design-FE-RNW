import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { bookmarkedPhotos, BookmarkedPhoto } from "../data/bookmarks";
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

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled(motion.button)<{ active?: boolean }>`
  background: ${(props) => (props.active ? "#6c5ce7" : "#2d2d2d")};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => (props.active ? "#5b4bc4" : "#3d3d3d")};
  }
`;

const MasonryGrid = styled.div`
  column-count: 4;
  column-gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    column-count: 3;
  }

  @media (max-width: 900px) {
    column-count: 2;
  }

  @media (max-width: 600px) {
    column-count: 1;
  }
`;

const PhotoCard = styled(motion.div)`
  break-inside: avoid;
  margin-bottom: 1.5rem;
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;

  &:hover {
    .overlay {
      opacity: 1;
    }
  }
`;

const PhotoImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  padding-top: 75%;
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

const PhotoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 0.8rem;
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

const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<BookmarkedPhoto[]>(bookmarkedPhotos);
  const [filter, setFilter] = useState<"date" | "likes">("date");

  const handleUnbookmark = (id: number) => {
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

  const sortedPhotos = [...photos].sort((a, b) => {
    if (filter === "date") {
      return (
        new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()
      );
    }
    return b.likes - a.likes;
  });

  return (
    <Container>
      <Header>
        <Title>북마크</Title>
        <Subtitle>저장한 사진들을 모아보세요</Subtitle>
      </Header>

      <FilterContainer>
        <FilterButton
          active={filter === "date"}
          onClick={() => setFilter("date")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          최신순
        </FilterButton>
        <FilterButton
          active={filter === "likes"}
          onClick={() => setFilter("likes")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          인기순
        </FilterButton>
      </FilterContainer>

      <MasonryGrid>
        <AnimatePresence>
          {sortedPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <PhotoImage imageUrl={photo.imageUrl} />
              <PhotoInfo>
                <PhotoTitle>{photo.title}</PhotoTitle>
                <PhotoDescription>{photo.description}</PhotoDescription>
                <PhotoMeta>
                  <span>{photo.author}</span>
                  <span>좋아요 {photo.likes}개</span>
                </PhotoMeta>
              </PhotoInfo>
              <Overlay className="overlay">
                <ActionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUnbookmark(photo.id)}
                >
                  북마크 해제
                </ActionButton>
              </Overlay>
            </PhotoCard>
          ))}
        </AnimatePresence>
      </MasonryGrid>

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

export default BookmarksPage;
