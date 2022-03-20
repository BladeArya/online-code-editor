import { useState } from "react";
import "./App.css";
import Compiler from "./components/Compiler";
import Header from "./components/Header";
function App() {
  return (
    <div className="App">
      <Header />
      <Compiler />
    </div>
  );
}

export default App;
