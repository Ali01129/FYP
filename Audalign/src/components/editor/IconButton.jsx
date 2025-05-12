import React from "react";

export default function IconButton({ icon: Icon }) {
  return (
    <button className="w-6 h-6 cursor-pointer">
      <Icon className="w-full h-full text-gray-400" />
    </button>
  );
}
