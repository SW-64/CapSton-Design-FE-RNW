import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { bookmarkedPhotos, BookmarkedPhoto } from "../data/bookmarks";
import { useNavigate } from "react-router-dom";
import PhotoModal from "./PhotoModal";

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
  background: ${(props) => (props.active ? "rgb(243, 186, 0)" : "#2d2d2d")};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => (props.active ? "rgb(221, 173, 0)" : "#3d3d3d")};
  }
`;

const MasonryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
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
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  ${PhotoCard}:hover & {
    transform: scale(1.08);
  }
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
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  display: none;
`;

const PhotoSpotName = styled.h3`
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

const ActionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.9);
  color: #1e1e1e;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  min-width: 120px;
  min-height: 44px;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: white;
  }
`;

const MenuButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgb(243, 186, 0);
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
    background:rgb(221, 173, 0);
  }
`;

const MenuContainer = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
`;

const MenuItem = styled(motion.button)<{ disabled?: boolean }>`
  background: ${(props) => (props.disabled ? "#3d3d3d" : "rgb(243, 186, 0)")};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${(props) => (props.disabled ? "#3d3d3d" : "rgb(221, 173, 0)")};
  }
`;

interface BookmarkSpot {
  spotId: number;
  userId: number;
  type: string;
}

interface SpotDetail {
  spotId: number;
  userId: number;
  spotName: string;
  imageUrl: string;
  isPublic: string;
  extraInfo: string;
  createdAt: string;
  updatedAt: string;
}

const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookmarkedSpots, setBookmarkedSpots] = useState<SpotDetail[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<SpotDetail | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const fetchBookmarkedSpots = async () => {
    try {
      const token = localStorage.getItem("token");
      // 1. 먼저 북마크된 명소 목록을 가져옵니다
      const bookmarkResponse = await fetch(
        "https://backend.peopletophoto.site/api/spots/bookmark",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!bookmarkResponse.ok) {
        throw new Error("북마크 조회 실패");
      }

      const bookmarkData = await bookmarkResponse.json();
      const bookmarks: BookmarkSpot[] = bookmarkData.data;

      // 2. 각 북마크된 명소의 상세 정보를 가져옵니다
      const spotDetailsPromises = bookmarks.map((bookmark) =>
        fetch(
          `https://backend.peopletophoto.site/api/spots/${bookmark.spotId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json())
      );

      const spotDetailsResponses = await Promise.all(spotDetailsPromises);
      const spotDetails = spotDetailsResponses.map((response) => response.data);

      setBookmarkedSpots(spotDetails);
    } catch (error) {
      console.error("북마크된 명소 조회 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchBookmarkedSpots();
  }, []);

  const handleUnbookmark = async (spotId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://backend.peopletophoto.site/api/spots/${spotId}/bookmark`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("북마크 해제 실패");
      }

      // 성공적으로 북마크가 해제되면 목록에서 제거
      setBookmarkedSpots((prev) =>
        prev.filter((spot) => spot.spotId !== spotId)
      );
    } catch (error) {
      console.error("북마크 해제 중 오류 발생:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 상세 명소 API 호출 및 카테고리 추출
  const handlePhotoCardClick = async (spot: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://backend.peopletophoto.site/api/spots/${spot.spotId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("상세 명소 조회 실패");
      const data = await response.json();
      setSelectedSpot(data.data);
      if (data.data.SpotCategory) {
        const categoryNames = data.data.SpotCategory.map(
          (sc: any) => sc.category.name
        );
        setSelectedCategories(categoryNames);
      } else {
        setSelectedCategories([]);
      }
    } catch (error) {
      setSelectedSpot(spot);
      setSelectedCategories([]);
    }
  };

  return (
    <Container>
      <Header>
        <Title>북마크</Title>
        <Subtitle>저장한 명소들을 확인해보세요</Subtitle>
      </Header>

      <MasonryGrid>
        <AnimatePresence>
          {bookmarkedSpots.map((spot, index) => (
            <PhotoCard
              key={spot.spotId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handlePhotoCardClick(spot)}
            >
              <PhotoImage imageUrl={spot.imageUrl} />
              <PhotoInfo>
                <PhotoSpotName>{spot.spotName}</PhotoSpotName>
                <PhotoNotes>{spot.extraInfo}</PhotoNotes>
                <PhotoMeta>
                  <span>{formatDate(spot.createdAt)}</span>
                </PhotoMeta>
              </PhotoInfo>
              <Overlay className="overlay">
                <ActionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePhotoCardClick(spot);
                  }}
                >
                  크게보기
                </ActionButton>
                <ActionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnbookmark(spot.spotId);
                  }}
                >
                  북마크 해제
                </ActionButton>
              </Overlay>
            </PhotoCard>
          ))}
        </AnimatePresence>
      </MasonryGrid>

      <MenuButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? "×" : "≡"}
      </MenuButton>

      <AnimatePresence>
        {isMenuOpen && (
          <MenuContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <MenuItem
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/community")}
            >
              커뮤니티
            </MenuItem>
            <MenuItem
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/my-photos")}
            >
              내가 올린 사진
            </MenuItem>
            <MenuItem disabled>북마크 모음</MenuItem>
            <MenuItem
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/gallery")}
            >
              갤러리로 이동
            </MenuItem>
          </MenuContainer>
        )}
      </AnimatePresence>

      <PhotoModal
        isOpen={!!selectedSpot}
        onClose={() => setSelectedSpot(null)}
        imageUrl={selectedSpot?.imageUrl || ""}
        spotName={selectedSpot?.spotName || ""}
        notes={selectedSpot?.extraInfo || ""}
        nickname=""
        isBookmarked={true}
        onBookmark={() => selectedSpot && handleUnbookmark(selectedSpot.spotId)}
        categories={selectedCategories}
      />
    </Container>
  );
};

export default BookmarksPage;
