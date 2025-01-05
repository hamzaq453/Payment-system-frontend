"use client";

const Footer = () => {
  return (
    <footer className="bg-indigo-700 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} MicroPedro Remittance. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
