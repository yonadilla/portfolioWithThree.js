import React from 'react';

const Menu = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="fixed flex gap-1 flex-col">
      <div className="bg-white h-1 w-10" />
      <div className="bg-white h-1 w-10" />
      <div />
    </div>
  );
});

export default Menu;
