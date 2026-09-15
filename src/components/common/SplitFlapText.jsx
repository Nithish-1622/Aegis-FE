import React, { useEffect, useState } from 'react';

const CHAR_SET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789->.:';

// Split flap cell component representing a single character tile
const FlapCell = ({ targetChar }) => {
  const [currentChar, setCurrentChar] = useState(' ');

  useEffect(() => {
    // Check if prefers-reduced-motion is true
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCurrentChar(targetChar);
      return;
    }

    let currentIdx = CHAR_SET.indexOf(currentChar);
    if (currentIdx === -1) currentIdx = 0;
    const targetIdx = CHAR_SET.indexOf(targetChar.toUpperCase());
    if (targetIdx === -1) {
      setCurrentChar(targetChar);
      return;
    }

    let intervalId;
    const tick = () => {
      if (currentIdx === targetIdx) {
        clearInterval(intervalId);
        return;
      }
      currentIdx = (currentIdx + 1) % CHAR_SET.length;
      setCurrentChar(CHAR_SET[currentIdx]);
    };

    intervalId = setInterval(tick, 25);
    return () => clearInterval(intervalId);
  }, [targetChar]);

  return (
    <span className="inline-block w-[1ch] text-center bg-slate-900 border-r border-slate-800 text-amber-300 font-mono font-bold select-none shadow-inner">
      {currentChar}
    </span>
  );
};

export const SplitFlapText = ({ text = '', length = 20 }) => {
  const paddedText = text.toUpperCase().padEnd(length, ' ').slice(0, length);

  return (
    <span className="flex">
      {paddedText.split('').map((char, index) => (
        <FlapCell key={index} targetChar={char} />
      ))}
    </span>
  );
};
