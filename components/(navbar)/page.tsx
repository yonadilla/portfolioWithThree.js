"use client";

import { useEffect, useRef, useState } from "react";
import Menu from "./components/menu";
import Navigate from "./components/navigate";
import { AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = () => {
      setIsOpen(true);
    };

    const menuRef = ref.current;
    if (menuRef) {
      menuRef.addEventListener("click", handleClick);
    }

    return () => {
      if (menuRef) {
        menuRef.removeEventListener("click", handleClick);
      }
    };
  }, []);

  
  return (
    <div className="bg-gray-500 w-screen h-screen">
      <Menu ref={ref} />
          <Navigate isOpen={isOpen} setIsOpen={() => setIsOpen(false)} />
    </div>
  );
};

export default Navbar;
