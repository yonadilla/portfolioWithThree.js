import Navbar from "@/components/(navbar)/page";
import ShaderText from "@/components/home/components/shaderText";
import Image from "next/image";

export default function Home() {
  
  return (
    <div className=" bg-slate-300">
      <Navbar/>
      <ShaderText />
    </div>
  );
}
