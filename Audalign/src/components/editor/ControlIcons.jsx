import React from "react";

export function UndoIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M6.96045 6.22027C7.25334 5.92738 7.25334 5.4525 6.96045 5.15961C6.66755 4.86672 6.19268 4.86672 5.89979 5.15961L3.33979 7.71961C3.04689 8.0125 3.04689 8.48738 3.33979 8.78027L5.89979 11.3403C6.19268 11.6332 6.66755 11.6332 6.96045 11.3403C7.25334 11.0474 7.25334 10.5725 6.96045 10.2796L5.74081 9.05998H15.1302C17.476 9.05998 19.3802 10.9642 19.3802 13.31C19.3802 15.6558 17.476 17.56 15.1302 17.56H7.13021C6.71599 17.56 6.38021 17.8958 6.38021 18.31C6.38021 18.7242 6.71599 19.06 7.13021 19.06H15.1302C18.3044 19.06 20.8802 16.4842 20.8802 13.31C20.8802 10.1358 18.3044 7.55998 15.1302 7.55998H5.62074L6.96045 6.22027Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function RedoIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M17.0396 6.22027C16.7467 5.92738 16.7467 5.4525 17.0396 5.15961C17.3325 4.86672 17.8073 4.86672 18.1002 5.15961L20.6602 7.71961C20.9531 8.0125 20.9531 8.48738 20.6602 8.78027L18.1002 11.3403C17.8073 11.6332 17.3325 11.6332 17.0396 11.3403C16.7467 11.0474 16.7467 10.5725 17.0396 10.2796L18.2592 9.05998H8.86979C6.524 9.05998 4.61979 10.9642 4.61979 13.31C4.61979 15.6558 6.524 17.56 8.86979 17.56H16.8698C17.284 17.56 17.6198 17.8958 17.6198 18.31C17.6198 18.7242 17.284 19.06 16.8698 19.06H8.86979C5.69561 19.06 3.11979 16.4842 3.11979 13.31C3.11979 10.1358 5.69561 7.55998 8.86979 7.55998H18.3793L17.0396 6.22027Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AddIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SubtractIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DeleteIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M3 6H5H21M8 6V4H16V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CopyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M8 7H16V19H8V7ZM4 5H14V15H4V5ZM18 7H20V21H8V19H18V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SplitIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 3V21M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExpandIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 10V4H10M14 4H20V10M20 14V20H14M10 20H4V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// More icons can be added similarly...

export function PlayIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M7 4V20L19 12L7 4Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="currentColor" />
    </svg>
  );
}

export function ResetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5V2L8 6L12 10V7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13H4C4 17.42 7.58 21 12 21C16.42 21 20 17.42 20 13C20 8.58 16.42 5 12 5Z"
        fill="currentColor"
      />
    </svg>
  );
}