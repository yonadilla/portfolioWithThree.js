"use client"

import React, { FC, useEffect, useRef } from 'react'

interface closeMenuProps {
  isOpen : boolean;
  setIsOpen : (value : boolean) => void;
}

const CloseMenu : React.FC<closeMenuProps> = ( {isOpen, setIsOpen}) => {
const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.addEventListener("click", () => {
      setIsOpen(false);
    });

    return () => {
      ref?.current?.removeEventListener("click", () => {});
    };
  });
  return (
    <div ref={ref} className=''>CloseMenu</div>
  )
}

export default CloseMenu
