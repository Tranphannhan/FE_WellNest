"use client";

import { Fab } from "@mui/material";
import { RiRobot2Fill } from "react-icons/ri";
import { styled, keyframes } from "@mui/system";
import {
  motion,
  useMotionValue,
  useAnimationControls,
  PanInfo,
} from "framer-motion";
import { useRef, useLayoutEffect, useState } from "react";

const pulse = keyframes`
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 12px rgba(33, 150, 243, 0);
  }
  100% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
`;

const AnimatedFab = styled(Fab)({
  animation: `${pulse} 2.5s infinite ease-in-out`,
  zIndex: 1000,
});

interface DragConstraints {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export default function AIChatButton({ callBack }: { callBack: () => void }) {
  const pressTimeRef = useRef<number>(0);
  const startPosition = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState<DragConstraints | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimationControls();

  useLayoutEffect(() => {
    const updateConstraints = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const buttonSize = 56;

      setConstraints({
        top: -height + buttonSize + 34,
        bottom: -34,
        left: -width + buttonSize + 34,
        right: -34,
      });
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    pressTimeRef.current = Date.now();
    startPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const timeDiff = Date.now() - pressTimeRef.current;
    const endPosition = { x: e.clientX, y: e.clientY };

    const distance = Math.sqrt(
      Math.pow(endPosition.x - (startPosition.current?.x ?? 0), 2) +
        Math.pow(endPosition.y - (startPosition.current?.y ?? 0), 2)
    );

    const isClick = timeDiff < 200 && distance < 5;
    if (isClick) callBack();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { x: offsetX, y: offsetY } = info.point;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Tính vùng trung tâm 70%
    const leftBound = width * 0.15;
    const rightBound = width * 0.85;
    const topBound = height * 0.15;
    const bottomBound = height * 0.85;

    // Nếu nằm trong vùng trung tâm thì snap về góc gần nhất
    if (
      offsetX > leftBound &&
      offsetX < rightBound &&
      offsetY > topBound &&
      offsetY < bottomBound
    ) {
      const isLeft = offsetX < width / 2;
      const isTop = offsetY < height / 2;

      const targetX = isLeft
        ? (constraints?.left ?? 0)
        : (constraints?.right ?? 0);
      const targetY = isTop
        ? (constraints?.top ?? 0)
        : (constraints?.bottom ?? 0);

      controls.start({ x: targetX, y: targetY });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      drag
      dragMomentum={false}
      dragConstraints={constraints ?? undefined}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragEnd={handleDragEnd}
      style={{
  position: "fixed",
  bottom: 25,   // cách mép dưới 20px
  right: 25,    // cách mép phải 20px
  cursor: "grab",
        x,
        y,
      }}
      animate={controls}
    >
      <AnimatedFab color="primary" aria-label="chat">
        <RiRobot2Fill fontSize="25px" />
      </AnimatedFab>
    </motion.div>
  );
}
