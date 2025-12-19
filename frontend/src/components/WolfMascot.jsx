import React from 'react';

export default function WolfMascot({ mood = 'happy', size = 120 }) {
  const eye = mood === 'happy' ? '#0ea5e9' : '#f97316';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
      role="img"
      aria-label="Golden wolf mascot"
      className="drop-shadow-xl"
    >
      <defs>
        <linearGradient id="wolfBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="110" r="100" fill="url(#wolfBody)" opacity="0.95" />
      <path
        d="M60 130 C70 105 90 95 110 95 C130 95 150 105 160 130"
        fill="#fef3c7"
        stroke="#92400e"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M80 70 L95 95 L65 90 Z"
        fill="#f59e0b"
        stroke="#92400e"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path
        d="M140 70 L125 95 L155 90 Z"
        fill="#f59e0b"
        stroke="#92400e"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <circle cx="90" cy="110" r="12" fill="#fef3c7" stroke="#92400e" strokeWidth="6" />
      <circle cx="130" cy="110" r="12" fill="#fef3c7" stroke="#92400e" strokeWidth="6" />
      <circle cx="90" cy="110" r="6" fill={eye} />
      <circle cx="130" cy="110" r="6" fill={eye} />
      <path
        d="M105 135 Q110 142 115 135"
        stroke="#92400e"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M85 148 Q110 165 135 148"
        fill="#fef3c7"
        stroke="#92400e"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
