"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-indigo-700 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">MicroPedro Remittance</Link>
        </h1>

        {/* Mobile Menu Icon */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Navigation Links */}
        <nav
          className={`absolute lg:static bg-indigo-700 lg:bg-transparent w-full lg:w-auto top-16 left-0 lg:top-auto lg:left-auto transition-all ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } lg:opacity-100 lg:pointer-events-auto lg:flex lg:space-x-6`}
        >
          <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 text-center lg:text-left">
            <li>
              <Link href="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/payment" onClick={() => setIsOpen(false)}>
                Payment
              </Link>
            </li>
            <li>
              <Link href="/Verifyotp" onClick={() => setIsOpen(false)}>
                Verify OTP
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
