import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";

const App = () => (
  <div>
    <Navbar />
    <div style={{ height: "200vh", background: "#f0f0f0" }}>
      <h1 style={{ textAlign: "center", paddingTop: "50vh" }}>Scroll Down</h1>
    </div>
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
