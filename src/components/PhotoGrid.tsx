import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Photo } from "../data/photos";
import ExpandableNav from "./ExpandableNav";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  padding: 10px;
  width: 100%;
  max-width: 100vw;
  margin: 0;
  background: #000;

  @media (max-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PhotoCard = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  cursor: pointer;
  aspect-ratio: 4/3;
  background: #1a1a1a;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 4px solid #333;
  border-top: 4px solid #666;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #e74c3c;
  text-align: center;
  padding: 10px;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  display: flex;
  gap: 30px;
  max-width: 90%;
  max-height: 90vh;
  position: relative;
  background: transparent;
  padding: 20px;
  border-radius: 10px;

  .image-container {
    flex: 1;
    max-width: 60%;
    display: flex;
    align-items: center;

    img {
      width: 100%;
      height: auto;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 5px;
    }
  }
`;

const ButtonGroup = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 15px;
`;

const IconButton = styled.button`
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

  svg {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  }
`;

const ModalInfo = styled(motion.div)`
  flex: 1;
  max-width: 40%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 30px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    margin-bottom: 20px;
    font-size: 1.5rem;
  }

  p {
    white-space: pre-wrap;
    line-height: 1.6;
  }
`;

const NoticeModal = styled(motion.div)`
  position: fixed;
  top: 35%;
  left: 35%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  border-radius: 15px;
  color: white;
  max-width: 600px;
  width: 90%;
  text-align: center;
  z-index: 2000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const NoticeContent = styled.div`
  font-size: 1.1rem;
  line-height: 2;
  white-space: pre-line;
  margin-bottom: 2rem;
  text-align: center;
`;

const NoticeButton = styled.button`
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #5b4bc4;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1999;
  padding-bottom: 5vh;
  padding-right: 5vw;
`;

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onPhotoClick: (photo: Photo) => void;
}

const PhotoCardComponent: React.FC<PhotoCardProps> = ({
  photo,
  index,
  onPhotoClick,
}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "50px 0px",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (inView && !imageLoaded) {
      const img = new Image();
      img.src = photo.url;
      img.onload = () => {
        setIsLoading(false);
        setImageLoaded(true);
      };
      img.onerror = () => {
        setIsLoading(false);
        setHasError(true);
      };
    }
  }, [inView, photo.url, imageLoaded]);

  return (
    <PhotoCard
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      onClick={() => onPhotoClick(photo)}
    >
      {isLoading && <LoadingSpinner />}
      {hasError && <ErrorMessage>이미지를 불러올 수 없습니다</ErrorMessage>}
      {imageLoaded && (
        <img
          src={photo.url}
          alt={photo.title}
          loading="lazy"
          decoding="async"
        />
      )}
    </PhotoCard>
  );
};

interface PhotoGridProps {
  photos: Photo[];
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  const [apiPhotos, setApiPhotos] = useState<Photo[]>([]);
  const [transformedPhotos, setTransformedPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [showNotice, setShowNotice] = useState(true);

  const handleCloseNotice = () => {
    setShowNotice(false);
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        console.log("API 호출 시작");
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://backend.peopletophoto.site/api/spots/external",
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        // data가 배열이 아닌 경우를 처리
        const spotsArray = Array.isArray(data) ? data : data.spots || [];

        // API 응답을 Photo 형식에 맞게 변환
        const transformedPhotosData = spotsArray.map(
          (item: any, index: number) => {
            return {
              id: item.galContentId || index.toString(),
              title: item.galTitle || "제목 없음",
              url: item.galWebImageUrl || "",
              description: item.galPhotographyLocation || "위치 정보 없음",
              category: item.galCategory || "기타",
              photographer: item.galPhotographer || "촬영자 정보 없음",
              location: item.galPhotographyLocation || "위치 정보 없음",
              source: "한국관광공사",
            };
          }
        );

        setApiPhotos(transformedPhotosData);
        setTransformedPhotos(transformedPhotosData);
      } catch (error) {
        console.error("API 호출 실패:", error);
      }
    };

    fetchPhotos();
  }, []);

  const handlePhotoClick = (photo: Photo) => {
    // transformedPhotos에서 해당 사진을 찾아 설정
    const foundPhoto = transformedPhotos.find((p) => p.id === photo.id);
    if (foundPhoto) {
      setSelectedPhoto(foundPhoto);
    } else {
      setSelectedPhoto(photo);
    }
  };

  return (
    <>
      <Grid>
        {apiPhotos.map((photo, index) => (
          <PhotoCardComponent
            key={photo.id}
            photo={photo}
            index={index}
            onPhotoClick={handlePhotoClick}
          />
        ))}
      </Grid>

      <AnimatePresence>
        {selectedPhoto && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <ButtonGroup>
                <IconButton onClick={() => setSelectedPhoto(null)}>
                  ✕
                </IconButton>
              </ButtonGroup>
              <div className="image-container">
                <img src={selectedPhoto.url} alt={selectedPhoto.title} />
              </div>
              <ModalInfo
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3>{selectedPhoto.title}</h3>
                <p>
                  <strong>위치:</strong> {selectedPhoto.location}
                </p>
                <p>
                  <strong>촬영자:</strong> {selectedPhoto.photographer}
                </p>
                <p>
                  <strong>출처:</strong> {selectedPhoto.source}
                </p>
              </ModalInfo>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default PhotoGrid;
