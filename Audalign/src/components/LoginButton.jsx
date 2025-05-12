import * as React from "react";

export default function LoginButton({ icon, provider, className }) {
  return (
    <div className={`flex flex-col justify-center items-center px-9 py-3 w-full rounded-xl border border-solid border-zinc-900 ${className}`}>
      <div className="flex gap-2 max-w-full w-[162px]">
        <img
          loading="lazy"
          src={icon}
          alt={`${provider} login icon`}
          className="object-contain shrink-0 aspect-square w-[30px]"
        />
        <div className="grow shrink my-auto w-[118px]">
          Login with <span className="font-bold text-white">{provider}</span>
        </div>
      </div>
    </div>
  );
}