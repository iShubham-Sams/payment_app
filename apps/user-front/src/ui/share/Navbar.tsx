import React, { ReactNode } from "react";

const Navbar = ({ render }: { render: ReactNode }) => {
  return (
    <section className="flex justify-between py-4 px-[5rem]">
      <span className="font-extrabold text-2xl text-blue-400 ">
        Payment App
      </span>
      {render}
    </section>
  );
};

export default Navbar;
