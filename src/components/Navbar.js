import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navbarStyle = {
    position: "fixed",
    top: 0,
    width: "100%",
    background: "#333",
    color: "#fff",
    padding: "20px",
    textAlign: "center",
    zIndex: 1000,
};

const shrinkStyle = {
    padding: "10px",
};

const Navbar = () => {
    useEffect(() => {
        const navbar = document.querySelector(".navbar");

        gsap.to(navbar, {
            scrollTrigger: {
                trigger: navbar,
                start: "top top",
                end: "+=500",
                scrub: true,
                toggleClass: { targets: navbar, className: "shrink" },
            },
        });
    }, []);

    return (
        <nav className="navbar" style={navbarStyle}>
            <h1>GSAP Navbar</h1>
        </nav>
    );
};

export default Navbar;
