import React from 'react';

export const ContactInfo = ({ icon, text, className = '' }) => (
  <div className={`flex gap-7 ${className}`}>
    <img
      loading="lazy"
      src={icon}
      alt=""
      className="object-contain shrink-0 self-start w-6 aspect-square"
    />
    <div className="basis-auto">{text}</div>
  </div>
);