import React from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./components/navbar/Navbar";
import WebGLCanvas from "./components/fire-gl/WebGLCanvas";

const App = () => (
    <div style={{ display: "flex", position: "relative", width: "100%", flexDirection: "column" }}>
        {/* <Navbar />
        <div style={{ height: "200vh", background: "#f0f0f0" }}>
        <h1 style={{ textAlign: "center"}}>Scroll Down</h1>
        </div> */}
        <WebGLCanvas />
    </div>
);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
