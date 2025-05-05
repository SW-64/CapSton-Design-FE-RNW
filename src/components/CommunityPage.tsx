import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import PhotoModal from "./PhotoModal";

interface Spot {
  spotId: number;
  spotName: string;
  imageUrl: string;
  extraInfo: string;
  userId: number;
  user: {
    nickName: string;
    profile: string;
  };
}

interface Category {
  categoryId: number;
  name: string;
  isCustom: boolean;
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

const MasonryGrid = styled.div`
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
  margin-top: 0.5rem;
`;

const DateText = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const UserName = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  pointer-events: none;
  z-index: 2;
  transition: opacity 0.3s ease;

  ${PhotoCard}:hover & {
    opacity: 1;
    pointer-events: auto;
  }
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

const GuideModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const GuideModalContent = styled(motion.div)`
  background: #222;
  color: #fff;
  padding: 3rem 4rem;
  border-radius: 16px;
  max-width: 800px;
  width: 98vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  text-align: left;
  position: relative;
  font-size: 1.22rem;
`;

const GuideCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
`;

const GuideButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2.5rem;
  background: none;
  border: none;
  font-size: 2.8rem;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  color: #fff;
  z-index: 1100;
  transition: color 0.2s;
  &:hover {
    color: #6c5ce7;
  }
`;

const RegisterButton = styled.button`
  background: #6c5ce7;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: background 0.2s;
  font-family: inherit;
  &:hover {
    background: #5b4bc4;
  }
`;

const RegisterModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`;

const RegisterModalContent = styled(motion.div)`
  background: #222;
  color: #fff;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  border-radius: 16px;
  max-width: 600px;
  width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  text-align: left;
  position: relative;
`;

const RegisterCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
`;

const RegisterInput = styled.input`
  width: 100%;
  padding: 0.9rem;
  background: #2a2a2a;
  border: 2px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 1.2rem;
  outline: none;
  transition: border 0.2s;
  &::placeholder {
    color: #aaa;
    font-size: 1rem;
    font-family: inherit;
    opacity: 1;
  }
  &:focus {
    border-color: #6c5ce7;
  }
`;

const RegisterTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  background: #2a2a2a;
  border: 2px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  margin-bottom: 1.2rem;
  padding: 0.9rem;
  outline: none;
  resize: vertical;
  transition: border 0.2s;
  &::placeholder {
    color: #aaa;
    font-size: 1rem;
    font-family: inherit;
    opacity: 1;
  }
  &:focus {
    border-color: #6c5ce7;
  }
`;

const RegisterLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
`;

const RegisterError = styled.div`
  color: #ff6b6b;
  font-size: 0.98rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const RegisterSuccess = styled.div`
  color: #00b894;
  font-size: 1.05rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Button = styled(motion.button)`
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  &:hover {
    background: #5b4bc4;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const CategoryButton = styled(motion.button)<{ active?: boolean }>`
  background: ${({ active }) => (active ? "#6c5ce7" : "#2a2a2a")};
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.7rem 0.2rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
  min-width: 0;
  box-shadow: ${({ active }) => (active ? "0 0 0 2px #a29bfe" : "none")};

  &:hover {
    background: #6c5ce7;
  }
`;

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarkedSpots, setBookmarkedSpots] = useState<Set<number>>(
    new Set()
  );
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [registerData, setRegisterData] = useState({
    spotName: "",
    extraInfo: "",
    image: null as File | null,
  });
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [registerCategoryList, setRegisterCategoryList] = useState<string[]>(
    []
  );
  const [selectedSpotCategories, setSelectedSpotCategories] = useState<
    string[]
  >([]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://backend.peopletophoto.site/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("카테고리 조회 실패");
        const data = await response.json();
        console.log("카테고리 API 응답:", data);
        const filteredCategories = data.data.filter(
          (category: Category) => !category.isCustom
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error("카테고리 조회 중 오류 발생:", error);
      }
    };

    const fetchSpots = async () => {
      try {
        const token = localStorage.getItem("token");
        let url = "https://backend.peopletophoto.site/api/spots/user-photo";
        if (selectedCategories.length > 0) {
          const params = selectedCategories
            .map((id) => `category=${id}`)
            .join("&");
          url += `?${params}`;
        }
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("API 호출 실패");
        const data = await response.json();
        setSpots(data.data);
      } catch (error) {
        console.error("명소 전체 조회 중 오류 발생:", error);
      }
    };
    const fetchBookmarkedSpots = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://backend.peopletophoto.site/api/spots/bookmark",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("북마크 조회 실패");
        const data = await response.json();
        const bookmarks = data.data as { spotId: number }[];
        const bookmarkSet: Set<number> = new Set(
          bookmarks.map((b) => b.spotId)
        );
        setBookmarkedSpots(bookmarkSet);
      } catch (error) {
        console.error("북마크 조회 중 오류 발생:", error);
      }
    };
    fetchCategories();
    fetchSpots();
    fetchBookmarkedSpots();
  }, [selectedCategories]);

  const toggleBookmark = async (spotId: number, isBookmarked: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://backend.peopletophoto.site/api/spots/${spotId}/bookmark`,
        {
          method: isBookmarked ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("북마크 처리 실패");
      setBookmarkedSpots((prev) => {
        const newSet = new Set(prev);
        if (isBookmarked) newSet.delete(spotId);
        else newSet.add(spotId);
        return newSet;
      });
    } catch (error) {
      console.error("북마크 처리 중 오류 발생:", error);
    }
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;
    if (name === "image") {
      if (files && files.length > 1) return;
      setRegisterData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegisterCategoryToggle = (categoryId: number) => {
    setRegisterCategoryList((prev) =>
      prev.includes(String(categoryId))
        ? prev.filter((id) => id !== String(categoryId))
        : [...prev, String(categoryId)]
    );
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    if (!registerData.spotName || !registerData.image) {
      setRegisterError("명소 이름과 이미지를 모두 입력해 주세요.");
      return;
    }
    if (registerCategoryList.length === 0) {
      setRegisterError("카테고리를 1개 이상 선택해 주세요.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("spotName", registerData.spotName);
      formData.append("extraInfo", registerData.extraInfo);
      formData.append("image", registerData.image);
      registerCategoryList.forEach((id) => formData.append("categoryList", id));
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://backend.peopletophoto.site/api/spots",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) throw new Error("등록 실패");
      setRegisterSuccess("명소가 성공적으로 등록되었습니다.");
      setRegisterData({ spotName: "", extraInfo: "", image: null });
      setRegisterCategoryList([]);
      setIsRegisterOpen(false);
      window.location.reload();
    } catch (err) {
      setRegisterError("명소 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePhotoCardClick = async (spot: Spot) => {
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
      console.log("상세 명소 API 응답:", data);
      setSelectedSpot(data.data);
      if (data.data.SpotCategory) {
        const categoryNames = data.data.SpotCategory.map(
          (sc: any) => sc.category.name
        );
        setSelectedSpotCategories(categoryNames);
      } else {
        setSelectedSpotCategories([]);
      }
    } catch (error) {
      setSelectedSpot(spot);
      setSelectedSpotCategories([]);
    }
  };

  return (
    <Container>
      <Header>
        <Title>커뮤니티</Title>
        <Subtitle>다른 사용자들이 공유한 명소를 구경해보세요</Subtitle>
      </Header>
      <GuideButton
        onClick={() => setIsGuideOpen(true)}
        title="사진 업로드 안내"
      >
        📖
      </GuideButton>
      {isGuideOpen && (
        <GuideModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsGuideOpen(false)}
        >
          <GuideModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GuideCloseButton
              onClick={() => setIsGuideOpen(false)}
              title="닫기"
            >
              ×
            </GuideCloseButton>
            <h2 style={{ marginBottom: "1.2rem", fontSize: "1.3rem" }}>
              📸 사진 업로드 및 이용 안내
            </h2>
            <div
              style={{
                whiteSpace: "pre-line",
                fontSize: "1.05rem",
                lineHeight: "1.7",
              }}
            >
              커뮤니티에 업로드된 사진은 다른 이용자들이 자유롭게 사용할 수 있는
              콘텐츠로 간주됩니다.
              <br />
              누구나 해당 사진을 블로그, 영상, SNS 등 다양한 매체에 활용할 수
              있으며,
              <br />
              출처(작성자명 또는 커뮤니티 링크)를 함께 표기해 주실 것을
              권장드립니다.
              <br />
              <br />
              📥 사진 저장 방법
              <br />
              사진에 마우스 오른쪽 버튼을 클릭하고 <b>'다른 이름으로 저장'</b>을
              선택하면
              <br />
              이미지를 간편하게 저장하실 수 있습니다.
              <br />
              <br />
              🔒 비공개 설정 안내
              <br />
              사진 공유가 부담스러우신 경우,{" "}
              <b>
                내가 올린 사진 페이지에서 비공개 설정을 선택하실 수 있습니다.
              </b>
              <br />
              비공개로 등록된 사진은 다른 이용자에게 노출되지 않습니다.
              <br />
              <br />
              사진을 업로드하실 경우, 해당 사진이 저작권 걱정 없이 자유롭게
              사용될 수 있다는 점에 동의하신 것으로 간주됩니다.
              <br />
            </div>
          </GuideModalContent>
        </GuideModalOverlay>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "-1.5rem",
        }}
      >
        <RegisterButton onClick={() => setIsRegisterOpen(true)}>
          명소 등록
        </RegisterButton>
      </div>

      <CategoryGrid>
        {categories.map((category) => (
          <CategoryButton
            key={category.categoryId}
            active={selectedCategories.includes(category.categoryId)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.categoryId)}
          >
            {category.name}
          </CategoryButton>
        ))}
      </CategoryGrid>

      <MasonryGrid>
        <AnimatePresence>
          {spots.map((spot) => (
            <PhotoCard
              key={spot.spotId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => handlePhotoCardClick(spot)}
            >
              <PhotoImage imageUrl={spot.imageUrl} />
              <PhotoInfo>
                <PhotoMeta>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <PhotoSpotName>{spot.spotName}</PhotoSpotName>
                  </div>
                  <UserName>{spot.user?.nickName || ""}</UserName>
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
        onClose={() => setSelectedSpot(null)}
        imageUrl={selectedSpot?.imageUrl || ""}
        spotName={selectedSpot?.spotName || ""}
        notes={selectedSpot?.extraInfo || ""}
        nickname={selectedSpot?.user?.nickName || ""}
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
        categories={selectedSpotCategories}
      />

      {isRegisterOpen && (
        <RegisterModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsRegisterOpen(false)}
        >
          <RegisterModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <RegisterCloseButton
              onClick={() => setIsRegisterOpen(false)}
              title="닫기"
            >
              ×
            </RegisterCloseButton>
            <h2
              style={{
                marginBottom: "1.2rem",
                fontSize: "1.3rem",
                textAlign: "center",
              }}
            >
              명소 등록
            </h2>
            {registerError && <RegisterError>{registerError}</RegisterError>}
            {registerSuccess && (
              <RegisterSuccess>{registerSuccess}</RegisterSuccess>
            )}
            <form onSubmit={handleRegisterSubmit}>
              <RegisterLabel htmlFor="spotName">명소 이름</RegisterLabel>
              <RegisterInput
                id="spotName"
                name="spotName"
                type="text"
                value={registerData.spotName}
                onChange={handleRegisterChange}
                autoComplete="off"
                placeholder="명소 이름을 입력하세요"
              />
              <RegisterLabel htmlFor="extraInfo">추가 정보</RegisterLabel>
              <RegisterTextarea
                id="extraInfo"
                name="extraInfo"
                value={registerData.extraInfo}
                onChange={handleRegisterChange}
                placeholder="명소에 대한 설명이나 위치 등 추가 정보를 입력하세요"
              />
              <RegisterLabel htmlFor="image">
                이미지 (1장만 업로드 가능)
              </RegisterLabel>
              <RegisterInput
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleRegisterChange}
              />
              <RegisterLabel>카테고리 선택 (복수 선택 가능)</RegisterLabel>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: "1rem",
                  marginBottom: "1.2rem",
                  width: "100%",
                  maxWidth: "600px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {categories.map((category) => (
                  <label
                    key={category.categoryId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      fontSize: "0.8em",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={registerCategoryList.includes(
                        String(category.categoryId)
                      )}
                      onChange={() =>
                        handleRegisterCategoryToggle(category.categoryId)
                      }
                      style={{ accentColor: "#6c5ce7" }}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
              <Button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: "100%", marginTop: "1.2rem" }}
              >
                등록하기
              </Button>
            </form>
          </RegisterModalContent>
        </RegisterModalOverlay>
      )}
    </Container>
  );
};

export default CommunityPage;
