import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  spotName: string;
  notes: string;
  nickname?: string;
  isBookmarked: boolean;
  onBookmark: (e: React.MouseEvent) => void;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  position: relative;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalHeader = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const HeaderButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.8);
  border: none;
  color: black;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
`;

const PhotoImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  padding-top: 75%;
  background-image: url(${(props) => props.imageUrl});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 1rem;
`;

const InfoContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  color: white;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const SpotName = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: white;
`;

const Notes = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
`;

const BookmarkButton = styled(motion.button)<{ isBookmarked: boolean }>`
  background: ${(props) =>
    props.isBookmarked ? "#6c5ce7" : "rgba(255, 255, 255, 0.1)"};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.isBookmarked ? "#5b4bc4" : "rgba(255, 255, 255, 0.2)"};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const DownloadButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  spotName,
  notes,
  nickname,
  isBookmarked,
  onBookmark,
}) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `photo-${spotName}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("다운로드 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            <ModalHeader>
              <HeaderButton
                onClick={handleDownload}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="이미지 저장"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </HeaderButton>
              <HeaderButton
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </HeaderButton>
            </ModalHeader>
            <PhotoImage imageUrl={imageUrl} />
            <InfoContainer>
              {nickname && (
                <UserInfo>
                  <span>👤</span>
                  <span>{nickname}</span>
                </UserInfo>
              )}
              <SpotName>{spotName}</SpotName>
              <Notes>{notes}</Notes>
              <ModalActions>
                <BookmarkButton
                  isBookmarked={isBookmarked}
                  onClick={onBookmark}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isBookmarked ? "북마크됨" : "북마크"}
                  <span>🔖</span>
                </BookmarkButton>
              </ModalActions>
            </InfoContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default PhotoModal;
