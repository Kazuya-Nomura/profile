import React from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./components/navbar/Navbar";
import WebGLCanvas from "./components/fire-gl/FireGL";
import BurningPaper from "./components/burning-payper/BurningPaper";
import Nav from "./components/nav/Nav"
import Footer from "./components/footer/Footer";
// <div style={{ display: "flex", position: "relative", width: "100%", flexDirection: "column" }}>
//     <Navbar />

// <BurningPaper />
//     <WebGLCanvas />
// </div>
const App = () => (
    <>
        <Nav />
        <Footer />
    </>
);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
