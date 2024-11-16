import React from "react";
import "./App.css";
import 'font-awesome/css/font-awesome.min.css';
import ToDoProvider from "./ToDoContext";
import Header from "./components/Header";
import InputForm from "./components/InputForm";
import ToDoList from "./components/ToDoList";

function App() {

  return (
    <ToDoProvider>
    <div className="container">
      <Header />
      <InputForm />
      <ToDoList />
    </div>
    </ToDoProvider>
  );
}

export default App;
