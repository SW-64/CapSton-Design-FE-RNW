import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { posts, Post } from "../data/posts";
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

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PostCard = styled(motion.div)`
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

const PostImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  padding-top: 100%;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const PostContent = styled.div`
  padding: 1.2rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
`;

const PostTitle = styled.h2`
  color: white;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const PostSpotName = styled.h3`
  color: #6c5ce7;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const PostNotes = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostMeta = styled.div`
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

const Tags = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: #aaa;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)<{ active?: boolean }>`
  background: ${(props) => (props.active ? "#6c5ce7" : "#2d2d2d")};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => (props.active ? "#5b4bc4" : "#3d3d3d")};
  }
`;

const LoadMoreButton = styled(motion.button)`
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 2rem;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background: #5b4bc4;
  }
`;

const NavigationButtons = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 1rem;
  z-index: 1000;
`;

const NavigationButton = styled(motion.button)`
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

  &:hover {
    background: #5b4bc4;
  }
`;

const GalleryButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  left: 30px;
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

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    loadMorePosts();
  }, []);

  const loadMorePosts = () => {
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const newPosts = posts.slice(startIndex, endIndex);
    setVisiblePosts((prev) => [...prev, ...newPosts]);
    setPage((prev) => prev + 1);
  };

  const handleBookmark = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container>
      <Header>
        <Title>커뮤니티</Title>
        <Subtitle>사진가들과 경험과 지식을 공유하세요</Subtitle>
      </Header>

      <PostGrid>
        <AnimatePresence>
          {visiblePosts.map((post, index) => (
            <PostCard
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedPost(post)}
            >
              <PostImage imageUrl={post.imageUrl} />
              <PostContent>
                <PostTitle>{post.spotName}</PostTitle>
                <PostNotes>{post.notes}</PostNotes>
                <PostMeta>
                  <span>{formatDate(post.createdAt)}</span>
                  <BookmarkButton
                    isBookmarked={bookmarkedPosts.includes(post.id)}
                    onClick={(e) => handleBookmark(post.id, e)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {bookmarkedPosts.includes(post.id) ? "북마크됨" : "북마크"}
                    <span>🔖</span>
                  </BookmarkButton>
                </PostMeta>
              </PostContent>
            </PostCard>
          ))}
        </AnimatePresence>
      </PostGrid>

      {visiblePosts.length < posts.length && (
        <LoadMoreButton
          onClick={loadMorePosts}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          더 보기
        </LoadMoreButton>
      )}

      <NavigationButtons>
        <NavigationButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/my-photos")}
        >
          내가 올린 사진
        </NavigationButton>
        <NavigationButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/bookmarks")}
        >
          북마크 모음
        </NavigationButton>
      </NavigationButtons>

      <GalleryButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/gallery")}
      >
        갤러리로 이동
      </GalleryButton>

      <PhotoModal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        imageUrl={selectedPost?.imageUrl || ""}
        spotName={selectedPost?.spotName || ""}
        notes={selectedPost?.notes || ""}
        nickname={selectedPost?.nickname}
        isBookmarked={
          selectedPost ? bookmarkedPosts.includes(selectedPost.id) : false
        }
        onBookmark={(e) => selectedPost && handleBookmark(selectedPost.id, e)}
      />
    </Container>
  );
};

export default CommunityPage;
