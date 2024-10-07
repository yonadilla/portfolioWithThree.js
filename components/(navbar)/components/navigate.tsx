"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface NavigateProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

const Navigate: React.FC<NavigateProps> = ({ isOpen, setIsOpen }) => {
  const [link, setLink] = useState<string | null>(null);
  const polygon = {
    dot: "polygon(49.75% 49.75%, 50.25% 49.75%, 50.25% 50.25%, 49.75% 50.25%)",
    vertical: "polygon(49.75% 0%, 50.25% 0%, 50.25% 100%, 49.75% 100%)",
    horizontal: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  };

  const clipPathVariants = {
    initial: {
      clipPath:
        "polygon(49.75% 49.75%, 50.25% 49.75%, 50.25% 50.25%, 49.75% 50.25%)",
    },
    open: {
      clipPath: [polygon.dot, polygon.vertical, polygon.horizontal],
      transition: {
        duration: 1,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
    close: {
      clipPath: [polygon.horizontal, polygon.vertical, polygon.dot],
      transition: {
        duration: 1,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
  };

  const divider = {
    initial: {
      scaleY: 0,
    },
    start: {
      scaleY: 1,
      transition: {
        duration: 0.5,
        delay: 1,
      },
    },
    exit: {
      scaleY: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const textItems = ["Home", "About", "Project"];

  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="bg-black fixed inset-0 flex"
          initial="initial"
          animate="open"
          exit="close"
          variants={clipPathVariants}
          onClick={setIsOpen}
        >
          <motion.div className="flex flex-col w-1/2 h-screen justify-center items-center gap-3 text-4xl ">
            {textItems.map((text, index) => (
              <div
                key={text}
                className="whitespace-nowrap relative overflow-hidden  text-white inline-block"
              >
                <motion.p
                  className="h-12"
                  onHoverStart={() => setLink(text)}
                  onHoverEnd={() => setLink(null)}
                  initial={{ y: 50 }}
                  animate={{ y: 0, transition: { delay: 1 + index * 0.2 } }}
                  exit={{ y: 50 }}
                >
                  {text}
                </motion.p>
              </div>
            ))}
          </motion.div>
          <motion.div
            variants={divider}
            className="bg-white w-[1px]"
            initial={"initial"}
            animate={"start"}
            exit={"exit"}
            style={{ height: "100vh" }}
          />
          <AnimatePresence>
            {link == "Home" && (
              <motion.div
                className="w-1/2 text-white h-screen grid place-content-center text-8xl"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                exit={{ y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <p>home</p>
              </motion.div>
            )}
            {link == "About" && (
              <motion.div
                className="w-1/2 text-white h-screen grid place-content-center text-8xl"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                exit={{ y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <p>About</p>
              </motion.div>
            )}
            {link == "Project" && (
              <motion.div
                className="w-1/2 text-white h-screen grid place-content-center text-8xl"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                exit={{ y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <p>Project</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navigate;
