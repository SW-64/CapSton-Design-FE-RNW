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
  extraInfo?: string;
  categories?: string[];
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
  background: transparent;
  width: 95%;
  max-width: 1600px;
  max-height: 95vh;
  display: flex;
  gap: 30px;
  padding: 20px;
  border-radius: 10px;
`;

const ModalImage = styled.div<{ imageUrl: string }>`
  flex: 1;
  max-width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${(props) => props.imageUrl});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 600px;
  border-radius: 5px;
`;

const InfoContainer = styled.div`
  flex: 1;
  max-width: 30%;
  background: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
`;

const SpotName = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const Notes = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-wrap;
  margin-bottom: 20px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-bottom: 20px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
`;

const BookmarkButton = styled(motion.button)<{ isBookmarked: boolean }>`
  background: ${(props) => (props.isBookmarked ? "#6c5ce7" : "#2d2d2d")};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => (props.isBookmarked ? "#5b4bc4" : "#3d3d3d")};
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }
`;

const ExtraInfo = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
`;

const CategoryBadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CategoryBadge = styled.span`
  background: #6c5ce7;
  color: #fff;
  border-radius: 12px;
  padding: 0.3rem 0.9rem;
  font-size: 0.95rem;
  font-weight: 500;
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
  extraInfo,
  categories,
}) => {
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
            <CloseButton
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </CloseButton>
            <ModalImage imageUrl={imageUrl} />
            <InfoContainer>
              {nickname && (
                <UserInfo>
                  <span>👤</span>
                  <span>{nickname}</span>
                </UserInfo>
              )}
              <SpotName>{spotName}</SpotName>
              {extraInfo && <ExtraInfo>📍 {extraInfo}</ExtraInfo>}
              {categories && categories.length > 0 && (
                <CategoryBadgeList>
                  {categories.map((cat, idx) => (
                    <CategoryBadge key={idx}>{cat}</CategoryBadge>
                  ))}
                </CategoryBadgeList>
              )}
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
