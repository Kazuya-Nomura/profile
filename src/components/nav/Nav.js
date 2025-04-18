import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './nav.css';

gsap.registerPlugin(ScrollTrigger);

const Nav = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const header = document.querySelector('#myHeader');
    const page = document.querySelector('#page');

    const handleScroll = () => {
      setIsSticky(window.scrollY >= 100);
      if (menuOpen) setMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);

    // Initialize ScrollTrigger for smooth scrolling links
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
    setIsSticky((prev) => !prev);
  };

  const smoothScroll = (targetId) => {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header id="myHeader" className={isSticky ? 'sticky' : ''}>
        <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 714.6 401.1">
          <path fill="#fff" fillRule="evenodd" d="M502.8 0h211.8l-23 39.7-138.5 240L483 401H342.7L413 279.6 251.4 0h140.3L483 158.1 538.6 62 502.8 0Zm-201 279.6L140.1 0H0l231.7 401 70-121.4Z" />
        </svg>
        <nav>
          <a href="#vision" onClick={(e) => { e.preventDefault(); smoothScroll('#vision'); }}>Vision</a>
          <a href="#knowledge" onClick={(e) => { e.preventDefault(); smoothScroll('#knowledge'); }}>Knowledge</a>
          <a href="#space" onClick={(e) => { e.preventDefault(); smoothScroll('#space'); }}>Space</a>
          <a href="#future" onClick={(e) => { e.preventDefault(); smoothScroll('#future'); }}>Future</a>
          <button id="openmenu" onClick={handleMenuToggle}>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>
      <div id="page" className={menuOpen ? 'menuopen' : ''}>
        <section id="vision" style={{ backgroundImage: 'url(https://assets.codepen.io/214624/vision.jpg)' }}>
          <h1>Vision.</h1>
        </section>
        <section id="knowledge" style={{ backgroundImage: 'url(https://assets.codepen.io/214624/knowledge.jpg)' }}>
          <h1>Knowledge.</h1>
        </section>
        <section id="space" style={{ backgroundImage: 'url(https://assets.codepen.io/214624/space.jpg)' }}>
          <h1>Space.</h1>
        </section>
        <section id="future" style={{ backgroundImage: 'url(https://assets.codepen.io/214624/future.jpg)' }}>
          <h1>Future.</h1>
        </section>
      </div>
    </>
  );
};

export default Nav;
