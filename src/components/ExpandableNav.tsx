import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const NavContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ExpandButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.5);
  }

  svg {
    width: 30px;
    height: 30px;
    transition: transform 0.3s ease;
  }
`;

const MenuContainer = styled(motion.div)`
  position: absolute;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
`;

const MenuButton = styled(motion.button)`
  padding: 15px 30px;
  border-radius: 25px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  font-size: 1.1rem;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalContent = styled(motion.div)`
  background: #1e1e1e;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  color: white;
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #6c5ce7;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #fff;
`;

const UserNickname = styled.p`
  font-size: 1.2rem;
  color: #6c5ce7;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  font-size: 1rem;
  color: #888;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
`;

const InfoItem = styled.div`
  background: rgba(108, 92, 231, 0.1);
  padding: 1rem;
  border-radius: 10px;

  h3 {
    font-size: 0.9rem;
    color: #6c5ce7;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: #fff;
  }
`;

interface UserInfo {
  userId: number;
  email: string;
  name: string;
  nickName: string;
  profile: string;
  createdAt: string;
  updatedAt: string;
}

const UserInfoModal: React.FC<{
  userInfo: UserInfo;
  onClose: () => void;
}> = ({ userInfo, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>×</CloseButton>
        <ProfileSection>
          <ProfileImage src={userInfo.profile} alt={userInfo.name} />
          <ProfileInfo>
            <UserName>{userInfo.name}</UserName>
            <UserNickname>{userInfo.nickName}</UserNickname>
            <UserEmail>{userInfo.email}</UserEmail>
          </ProfileInfo>
        </ProfileSection>
        <InfoGrid>
          <InfoItem>
            <h3>가입일</h3>
            <p>{formatDate(userInfo.createdAt)}</p>
          </InfoItem>
          <InfoItem>
            <h3>최근 정보 수정일</h3>
            <p>{formatDate(userInfo.updatedAt)}</p>
          </InfoItem>
        </InfoGrid>
      </ModalContent>
    </ModalOverlay>
  );
};

const ExpandableNav: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            "http://backend.peopletophoto.site/api/users/getMyInfo",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );

          if (response.ok) {
            const result = await response.json();
            setUserInfo(result.data);
          } else {
            // 토큰이 유효하지 않은 경우
            localStorage.removeItem("token");
            setUserInfo(null);
          }
        } catch (error) {
          console.error("사용자 정보 조회 중 오류 발생:", error);
          localStorage.removeItem("token");
          setUserInfo(null);
        }
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInfo(null);
    navigate("/");
  };

  const menuItems = userInfo
    ? [
        { label: "홈으로", path: "/" },
        {
          label: `${userInfo.nickName}님의 정보`,
          action: () => setShowUserInfo(true),
        },
        { label: "커뮤니티", path: "/community" },
        { label: "로그아웃", action: handleLogout },
      ]
    : [
        { label: "홈으로", path: "/" },
        { label: "로그인", path: "/login" },
        { label: "커뮤니티", path: "/community" },
      ];

  return (
    <>
      <NavContainer>
        <AnimatePresence>
          {isExpanded && (
            <MenuContainer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {menuItems.map((item, index) => (
                <MenuButton
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.path) {
                      navigate(item.path);
                    }
                    setIsExpanded(false);
                  }}
                >
                  {item.label}
                </MenuButton>
              ))}
            </MenuContainer>
          )}
        </AnimatePresence>
        <ExpandButton
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: isExpanded ? 180 : 0 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </motion.svg>
        </ExpandButton>
      </NavContainer>

      <AnimatePresence>
        {showUserInfo && userInfo && (
          <UserInfoModal
            userInfo={userInfo}
            onClose={() => setShowUserInfo(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ExpandableNav;
