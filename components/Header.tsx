"use client";

import { useState } from "react";

const Header = ({ toggleSubscribe }: { toggleSubscribe: () => void }) => {
  const [activateConfetti, setConfetti] = useState(false);
  const triggerConfetti = () => {
    setConfetti(true);
    toggleSubscribe();
  };

  return (
    <section className="sticky top-0 z-20">
      <aside className="bg-yellow-300  text-black  items-center justify-center flex p-1 w-full">
        <div className="rounded-lg px-1 border border-slate-100 bg-yellow-200 flex items-center mr-1 ">
          <small>New</small>
        </div>

        <small>
          ✨ Get Noticed by Thousands! Promote your brand:
          market@opportunityarchives.com
        </small>
      </aside>

      <header className="bg-[#0F141E] h-14 text-white p-4 gap-4 flex justify-between items-center ">
        <h1>Opportunity Archives</h1>
        <nav className="hidden md:flex space-x-12">
          <a
            className="hover:text-white/50 transition-all duration-100 ease-out"
            href="/job"
          >
            Jobs
          </a>
          <a
            className="hover:text-white/50 transition-all duration-100 ease-out"
            href="/scholarship"
          >
            Scholarships
          </a>
        </nav>
        <button
          onClick={triggerConfetti}
          className={
            activateConfetti
              ? "bg-slate-100 p-2 rounded-3xl text-[12px] text-black font-bold motion-preset-confetti"
              : "bg-slate-100 p-2 rounded-3xl text-[12px] text-black font-bold"
          }
        >
          SUBSCRIBE
        </button>
      </header>
    </section>
  );
};

export default Header;
