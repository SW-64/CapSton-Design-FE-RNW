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
  max-width: 90%;
  max-height: 90vh;
  position: relative;
  background: transparent;
  padding: 20px;
  border-radius: 10px;

  img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 5px;
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
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 0 0 10px 10px;
  white-space: pre-wrap;
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

  console.log("hello world");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        console.log("API 호출 시작");
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3001/api/spots/external",
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
        const transformedPhotos = spotsArray.map((item: any, index: number) => {
          return {
            id: item.galContentId || index.toString(),
            title: item.galTitle || "제목 없음",
            url: item.galWebImageUrl || "",
            description: `촬영 장소: ${
              item.galPhotographyLocation || "정보 없음"
            }\n\n촬영 시기: ${
              item.galPhotographyMonth
                ? `${item.galPhotographyMonth.substring(
                    0,
                    4
                  )}년 ${item.galPhotographyMonth.substring(4, 6)}월`
                : "정보 없음"
            }\n\n촬영자: ${item.galPhotographer || "정보 없음"}\n\n키워드: ${
              item.galSearchKeyword || "정보 없음"
            }`,
          };
        });

        setApiPhotos(transformedPhotos.filter((photo: Photo) => photo.url)); // URL이 있는 사진만 필터링
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    fetchPhotos();
  }, []);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [scrollY, setScrollY] = useState(0);

  const handleDownload = async (photo: Photo) => {
    try {
      // 파일 확장자 추출
      const extension = photo.url.split(".").pop() || "jpg";
      const fileName = `${photo.title}.${extension}`;

      // 백엔드 서버를 통해 이미지 다운로드
      const response = await fetch("http://localhost:3001/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          imageUrl: photo.url,
          fileName: fileName,
        }),
      });

      if (!response.ok) {
        throw new Error("다운로드 실패");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("이미지 다운로드 중 오류가 발생했습니다:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Grid>
        {apiPhotos.map((photo, index) => (
          <PhotoCardComponent
            key={photo.id}
            photo={photo}
            index={index}
            onPhotoClick={setSelectedPhoto}
          />
        ))}
      </Grid>

      <ExpandableNav />

      <AnimatePresence>
        {selectedPhoto && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <ModalContent
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedPhoto.url} alt={selectedPhoto.title} />
              <ButtonGroup>
                <IconButton
                  onClick={() => handleDownload(selectedPhoto)}
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
                </IconButton>
                <IconButton onClick={() => setSelectedPhoto(null)} title="닫기">
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
                </IconButton>
              </ButtonGroup>
              <ModalInfo
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3>{selectedPhoto.title}</h3>
                <p>{selectedPhoto.description}</p>
              </ModalInfo>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default PhotoGrid;
