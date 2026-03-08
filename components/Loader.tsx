import Image from "next/image";
import React from "react";

export default function Loader() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-center min-h-screen ">
        <Image src={"/Logo.png"} width={100} height={100} alt="test"/>
      </div>
    </div>
  );
}
