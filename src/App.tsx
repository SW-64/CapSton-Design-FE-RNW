import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import PhotoGrid from "./components/PhotoGrid";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import CommunityPage from "./components/CommunityPage";
import MyPhotosPage from "./components/MyPhotosPage";
import BookmarksPage from "./components/BookmarksPage";
import { photos } from "./data/photos";

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #000;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const Gallery = () => (
  <AppContainer>
    <PhotoGrid photos={photos} />
  </AppContainer>
);

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/my-photos" element={<MyPhotosPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
