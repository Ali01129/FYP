import * as React from "react";
import LoginForm from "../components/LoginForm";
import MenuButton from "../components/MenuButton";

export default function AuthPage() {
  return (
    <div className="flex overflow-hidden flex-col bg-stone-200">
      <div className="pt-8 pr-20 pb-20 pl-9 w-full bg-black max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
              <div className="gap-2.5 self-start px-5 py-3.5">
                <MenuButton />
              </div>
              <LoginForm />
            </div>
          </div>
          <div className="flex flex-col ml-5 w-5/12 max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f86ac156f59e4f1caf71b8c3b9f52f1c7bdcc653444921459e745a8b7da8a843?placeholderIfAbsent=true&apiKey=5c70ca3f18714fc893785ac3990400f6"
              alt="Login page decorative image"
              className="object-contain grow mt-20 w-full aspect-[1.2] rounded-[30px] max-md:mt-10 max-md:max-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}