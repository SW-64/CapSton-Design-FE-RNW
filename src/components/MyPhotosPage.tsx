import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import PhotoModal from "./PhotoModal";

interface Spot {
  spotId: number;
  userId: number;
  spotName: string;
  like: number;
  imageUrl: string;
  isPublic: string;
  extraInfo: string;
  createdAt: string;
  updatedAt: string;
}

interface UserSpot {
  userId: number;
  nickName: string;
  profile: string;
  Spot: Spot[];
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
`;

const PhotoTitle = styled.h3`
  color: white;
  margin-bottom: 0.5rem;
`;

const PhotoExtraInfo = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const PhotoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #888;
  font-size: 0.8rem;
`;

const LikeCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const PublicBadge = styled.span<{ isPublic: boolean }>`
  background: ${(props) => (props.isPublic ? "#00b894" : "#e74c3c")};
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const ToggleSwitch = styled.div<{ isPublic: boolean }>`
  position: relative;
  width: 50px;
  height: 24px;
  background: ${(props) => (props.isPublic ? "#00b894" : "#e74c3c")};
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:before {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${(props) => (props.isPublic ? "28px" : "2px")};
    transition: left 0.3s ease;
  }
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

const MyPhotosPage: React.FC = () => {
  const navigate = useNavigate();
  const [userSpots, setUserSpots] = useState<UserSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const togglePublicStatus = async (spotId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/spots/${spotId}/visibility`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "공개 상태 변경 실패");
      }

      const updatedSpot = responseData.data;

      setUserSpots((prevSpots) =>
        prevSpots.map((userSpot) => ({
          ...userSpot,
          Spot: userSpot.Spot.map((spot) =>
            spot.spotId === spotId
              ? { ...spot, isPublic: updatedSpot.isPublic }
              : spot
          ),
        }))
      );
    } catch (error) {
      console.error("공개 상태 변경 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    const fetchMySpots = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/users/getMySpot",
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
        console.error("내 스팟 조회 중 오류 발생:", error);
      }
    };

    fetchMySpots();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePhotoCardClick = async (spot: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/spots/${spot.spotId}`,
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
        <Title>내가 올린 사진</Title>
        <Subtitle>나만의 갤러리를 관리하세요</Subtitle>
      </Header>

      <PhotoGrid>
        <AnimatePresence>
          {userSpots.map((userSpot) =>
            userSpot.Spot.map((spot) => (
              <PhotoCard
                key={spot.spotId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => handlePhotoCardClick(spot)}
              >
                <PhotoImage imageUrl={spot.imageUrl} />
                <PhotoInfo>
                  <PhotoTitle>{spot.spotName}</PhotoTitle>
                  <PhotoExtraInfo>{spot.extraInfo}</PhotoExtraInfo>
                  <PhotoMeta>
                    <span>{formatDate(spot.createdAt)}</span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <PublicBadge isPublic={spot.isPublic === "PUBLIC"}>
                        {spot.isPublic === "PUBLIC" ? "공개" : "비공개"}
                      </PublicBadge>
                      <ToggleSwitch
                        isPublic={spot.isPublic === "PUBLIC"}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePublicStatus(spot.spotId);
                        }}
                      />
                    </div>
                  </PhotoMeta>
                </PhotoInfo>
              </PhotoCard>
            ))
          )}
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
            <MenuItem
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/community")}
            >
              커뮤니티
            </MenuItem>
            <MenuItem disabled>내가 올린 사진</MenuItem>
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
        onClose={() => setSelectedSpot(null)}
        imageUrl={selectedSpot?.imageUrl || ""}
        spotName={selectedSpot?.spotName || ""}
        notes={selectedSpot?.extraInfo || ""}
        nickname={userSpots[0]?.nickName}
        isBookmarked={false}
        onBookmark={() => {}}
        categories={selectedCategories}
      />
    </Container>
  );
};

export default MyPhotosPage;
