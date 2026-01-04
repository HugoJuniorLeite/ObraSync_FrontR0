import styled from "styled-components";
import { motion } from "framer-motion";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.75);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1200;
  padding: 2px;
`;

export const BigBtn = styled.button`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border: 1px solid ${(props) => (props.$primary ? "#38bdf8" : "#0ea5e9")};
  background: ${(props) => (props.$primary ? "#38bdf8" : "#0ea5e9")};
  color: ${(props) => (props.$primary ? "#081018" : "white")};
  cursor: pointer;
`;

export const Panel = styled(motion.div)`
  width: 100%;
  max-width: 520px;
  height: 92vh;
  background: #071827;
  border-radius: 12px 12px 8px 8px;
  border: 1px solid #00396b;
  box-shadow: 0 18px 50px rgba(2, 6, 23, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  background: linear-gradient(
    90deg,
    rgba(8, 24, 39, 1),
    rgba(6, 18, 30, 0.9)
  );
`;

export const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  color: #f59e0b;
  font-weight: 700;
  font-size: 1.05rem;
`;

export const Sub = styled.div`
  color: #9fb4c9;
  font-size: 0.85rem;
`;

export const CloseBtn = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  color: #e5f0ff;
  cursor: pointer;
    transition: all 0.2s ease;
      width: 36px;
  height: 36px;
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.4);
    color: #f87171;
  }
`;

export const Progress = styled.div`
  height: 8px;
  width: 100%;
  background: #052033;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${(p) => p.$pct}%;
  background: linear-gradient(90deg, #38bdf8, #0ea5e9);
  transition: width 0.22s ease;
`;

export const Body = styled.div`
  padding: 12px 14px;
  overflow-y: auto;
  flex: 1;
  color: #dbeafe;
`;

export const TabBar = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: space-around;
  padding: 8px 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  background: linear-gradient(
    180deg,
    rgba(4, 12, 20, 0.6),
    rgba(3, 10, 18, 0.6)
  );
`;

export const TabBtn = styled.button`
  flex: 1;
  padding: 8px;
  border-radius: 10px;
  background: transparent;
  color: ${(p) => (p.$active ? "#e5f0ff" : "#9fb4c9")};
  border: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  font-size: 0.82rem;
  cursor: pointer;
  opacity: ${(p) => (p.$active ? 1 : 0.8)};
`;

export const Banner = styled.div`
  background: linear-gradient(90deg, #0ea5e9, #2563eb);
  color: white;
  padding: 10px 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  box-shadow: 0 6px 18px rgba(13, 71, 161, 0.22);
`;

export const Card = styled.div`
  background: #0d2234;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #00396b;
  margin-top: 10px;
  color: #dbeafe;
`;

export const Field = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  color: #94a3b8;
  font-size: 0.92rem;
`;

export const Input = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #00396b;
  background: #071827;
  color: #e5f0ff;

  &:focus {
    outline: none;
    border-color: #38bdf8;
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.07);
  }
`;

export const Select = styled.select`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #00396b;
  background: #071827;
  color: #e5f0ff;

  &:focus {
    outline: none;
    border-color: #38bdf8;
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.07);
  }
`;

export const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  outline: none;
  resize: vertical;
  border: 1px solid #00396b;
  background: #071827;
  color: #e5f0ff;

  &:focus {
    box-shadow: 0 0 0 2px #38bdf866;
    border-color: #38bdf8;
  }
`;

export const ImgThumb = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #00396b;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #e11d48;
    border: none;
    color: white;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    cursor: pointer;
  }
`;

