import React from "react";
import IconButton from "./IconButton";
import {
  UndoIcon,
  RedoIcon,
  SplitIcon,
  CopyIcon,
  DeleteIcon,
  AddIcon,
  SubtractIcon,
  ExpandIcon,
} from "./ControlIcons";

export function PlaybackControls() {
  return (
    <div className="flex justify-between items-center px-6 py-3 border-t border-solid border-t-gray-500 h-[60px] bg-black">
      <div className="flex gap-4">
        <IconButton icon={UndoIcon} />
        <IconButton icon={RedoIcon} />
        <IconButton icon={SplitIcon} />
        <IconButton icon={CopyIcon} />
        <IconButton icon={DeleteIcon} />
      </div>

      <time className="text-sm font-semibold text-white">
        00:00:00 / 00:15:22
      </time>

      <div className="flex gap-4">
        <IconButton icon={AddIcon} />
        <IconButton icon={SubtractIcon} />
        <IconButton icon={ExpandIcon} />
      </div>
    </div>
  );
}