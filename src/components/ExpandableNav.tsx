import React, { useState } from "react";
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
  width: 40px;
  height: 40px;
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
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }
`;

const MenuContainer = styled(motion.div)`
  position: absolute;
  bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const MenuButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }
`;

const ExpandableNav: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "홈으로", path: "/" },
    { label: "로그인", path: "/login" },
    { label: "커뮤니티", path: "/community" },
  ];

  return (
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
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  navigate(item.path);
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
  );
};

export default ExpandableNav;
