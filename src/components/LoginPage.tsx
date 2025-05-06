import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const LoginContainer = styled(motion.div)`
  min-height: 100vh;
  width: 100%;
  background: #121212;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled(motion.div)`
  background: #1e1e1e;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  position: absolute;
  left: 1rem;
  top: 1rem;
  color: #888;
  transition: all 0.3s ease;
  pointer-events: none;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: #2a2a2a;
  border: 2px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: rgb(243, 186, 0);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  }

  &:focus + ${Label}, &:not(:placeholder-shown) + ${Label} {
    top: -0.5rem;
    left: 0.8rem;
    font-size: 0.8rem;
    background: #1e1e1e;
    padding: 0 0.4rem;
    color: rgb(243, 186, 0);
  }
`;

const Button = styled(motion.button)`
  background: rgb(243, 186, 0);
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
    background: rgb(221, 173, 0);
  }
`;

const ForgotPassword = styled.a`
  color: #888;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: rgb(243, 186, 0);
  }
`;

const SignUpLink = styled.div`
  color: #888;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1.5rem;

  a {
    color: rgb(243, 186, 0);
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.5rem;
    transition: color 0.3s ease;

    &:hover {
      color: rgb(221, 173, 0);
    }
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.5rem;
`;

const SignUpModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1e1e1e;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  z-index: 1000;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    profile:
      "https://cphoto.asiae.co.kr/listimglink/1/2013051007205672589_1.jpg",
    nickname: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://backend.peopletophoto.site/api/auth/sign-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("로그인 성공:", result);
        // 토큰을 localStorage에 저장
        localStorage.setItem("token", result.data);
        // 갤러리 페이지로 이동
        navigate("/gallery");
      } else {
        setError(result.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://backend.peopletophoto.site/api/auth/sign-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signUpData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("회원가입 성공:", result);
        setShowSignUp(false);
        setSignUpSuccess(true);
        // 회원가입 성공 후 입력 필드 초기화
        setSignUpData({
          name: "",
          email: "",
          password: "",
          passwordConfirm: "",
          profile:
            "https://cphoto.asiae.co.kr/listimglink/1/2013051007205672589_1.jpg",
          nickname: "",
        });
      } else {
        setError(result.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <LoginContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <LoginCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Title>로그인</Title>
        {signUpSuccess && (
          <div
            style={{
              color: "rgb(243, 186, 0)",
              fontWeight: 600,
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            회원가입 성공했습니다!
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Label>이메일</Label>
          </InputGroup>
          <InputGroup>
            <Input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Label>비밀번호</Label>
          </InputGroup>
          <SignUpLink>
            계정이 없으신가요?
            <a href="#" onClick={() => setShowSignUp(true)}>
              회원가입
            </a>
          </SignUpLink>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            로그인
          </Button>
          <ForgotPassword>비밀번호를 잊으셨나요?</ForgotPassword>
        </Form>
      </LoginCard>

      <AnimatePresence>
        {showSignUp && (
          <>
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignUp(false)}
            />
            <SignUpModal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={() => setShowSignUp(false)}>
                &times;
              </CloseButton>
              <Title>회원가입</Title>
              <Form onSubmit={handleSignUp}>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder=" "
                    value={signUpData.name}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, name: e.target.value })
                    }
                    required
                  />
                  <Label>이름</Label>
                </InputGroup>
                <InputGroup>
                  <Input
                    type="email"
                    placeholder=" "
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, email: e.target.value })
                    }
                    required
                  />
                  <Label>이메일</Label>
                </InputGroup>
                <InputGroup>
                  <Input
                    type="password"
                    placeholder=" "
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, password: e.target.value })
                    }
                    required
                  />
                  <Label>비밀번호</Label>
                </InputGroup>
                <InputGroup>
                  <Input
                    type="password"
                    placeholder=" "
                    value={signUpData.passwordConfirm}
                    onChange={(e) =>
                      setSignUpData({
                        ...signUpData,
                        passwordConfirm: e.target.value,
                      })
                    }
                    required
                  />
                  <Label>비밀번호 확인</Label>
                </InputGroup>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder=" "
                    value={signUpData.nickname}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, nickname: e.target.value })
                    }
                    required
                  />
                  <Label>닉네임</Label>
                </InputGroup>
                <Button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  가입하기
                </Button>
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </Form>
            </SignUpModal>
          </>
        )}
      </AnimatePresence>
    </LoginContainer>
  );
};

export default LoginPage;
