import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import PhotoModal from "./PhotoModal";

interface Spot {
  spotId: number;
  spotName: string;
  imageUrl: string;
  userId: number;
  createdAt: string;
}

interface UserSpot {
  userId: number;
  nickName: string;
  profile: string;
  Spot: Spot[];
}

interface BookmarkData {
  spotId: number;
  userId: number;
  type: string;
}

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
  }
`;

const PhotoImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
`;

const PhotoInfo = styled.div`
  padding: 1rem;
  position: relative;
  min-height: 100px;
`;

const PhotoTitle = styled.h3`
  color: white;
  margin-bottom: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const UserProfile = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const UserName = styled.span`
  color: #888;
  font-size: 0.9rem;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const NavigationButton = styled(motion.button)`
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
`;

const GalleryButton = styled(motion.button)`
  background: #00b894;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  width: 100%;
  max-width: 200px;
  margin: 1rem auto;
`;

const MenuButton = styled(motion.button)`
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
  background: ${(props) => (props.disabled ? "#3d3d3d" : "#6c5ce7")};
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
    background: ${(props) => (props.disabled ? "#3d3d3d" : "#5b4bc4")};
  }
`;

const BookmarkButton = styled(motion.button)<{ isBookmarked: boolean }>`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => (props.isBookmarked ? "#ffd700" : "white")};
  font-size: 20px;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [userSpots, setUserSpots] = useState<UserSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserSpot | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarkedSpots, setBookmarkedSpots] = useState<Set<number>>(
    new Set()
  );

  const getSortedSpots = () => {
    const allSpots = userSpots.flatMap((userSpot) =>
      userSpot.Spot.map((spot) => ({
        ...spot,
        userInfo: {
          nickName: userSpot.nickName,
          profile: userSpot.profile,
        },
      }))
    );

    return allSpots.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  useEffect(() => {
    const fetchUserSpots = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/spots/user-photo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("API 호출 실패");
        }

        const data = await response.json();
        setUserSpots(data.data);
      } catch (error) {
        console.error("사용자 스팟 조회 중 오류 발생:", error);
      }
    };

    const fetchBookmarkedSpots = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/spots/bookmark",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("북마크 조회 실패");
        }

        const data = await response.json();
        const bookmarks = data.data as BookmarkData[];
        const bookmarkSet: Set<number> = new Set(
          bookmarks.map((bookmark) => bookmark.spotId)
        );
        setBookmarkedSpots(bookmarkSet);
      } catch (error) {
        console.error("북마크 조회 중 오류 발생:", error);
      }
    };

    fetchUserSpots();
    fetchBookmarkedSpots();
  }, []);

  const toggleBookmark = async (
    spotId: number,
    isCurrentlyBookmarked: boolean
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/spots/${spotId}/bookmark`,
        {
          method: isCurrentlyBookmarked ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("북마크 처리 실패");
      }

      setBookmarkedSpots((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyBookmarked) {
          newSet.delete(spotId);
        } else {
          newSet.add(spotId);
        }
        return newSet;
      });
    } catch (error) {
      console.error("북마크 처리 중 오류 발생:", error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>커뮤니티</Title>
        <Subtitle>다른 사용자들이 공유한 명소를 구경해보세요</Subtitle>
      </Header>

      <PhotoGrid>
        <AnimatePresence>
          {getSortedSpots().map((spot) => (
            <PhotoCard
              key={spot.spotId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => {
                setSelectedSpot(spot);
                setSelectedUser({
                  userId: spot.userId,
                  nickName: spot.userInfo.nickName,
                  profile: spot.userInfo.profile,
                  Spot: [],
                });
              }}
            >
              <PhotoImage imageUrl={spot.imageUrl} />
              <PhotoInfo>
                <PhotoTitle>{spot.spotName}</PhotoTitle>
                <UserInfo>
                  <UserProfile
                    src={spot.userInfo.profile}
                    alt={spot.userInfo.nickName}
                  />
                  <UserName>{spot.userInfo.nickName}</UserName>
                </UserInfo>
                <BookmarkButton
                  isBookmarked={bookmarkedSpots.has(spot.spotId)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(
                      spot.spotId,
                      bookmarkedSpots.has(spot.spotId)
                    );
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {bookmarkedSpots.has(spot.spotId) ? "★" : "☆"}
                </BookmarkButton>
              </PhotoInfo>
            </PhotoCard>
          ))}
        </AnimatePresence>
      </PhotoGrid>

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
            <MenuItem disabled>커뮤니티</MenuItem>
            <MenuItem
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/my-photos")}
            >
              내가 올린 사진
            </MenuItem>
            <MenuItem
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/bookmarks")}
            >
              북마크 모음
            </MenuItem>
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
        onClose={() => {
          setSelectedSpot(null);
          setSelectedUser(null);
        }}
        imageUrl={selectedSpot?.imageUrl || ""}
        spotName={selectedSpot?.spotName || ""}
        notes=""
        nickname={selectedUser?.nickName}
        isBookmarked={
          selectedSpot ? bookmarkedSpots.has(selectedSpot.spotId) : false
        }
        onBookmark={() =>
          selectedSpot &&
          toggleBookmark(
            selectedSpot.spotId,
            bookmarkedSpots.has(selectedSpot.spotId)
          )
        }
      />
    </Container>
  );
};

export default CommunityPage;
