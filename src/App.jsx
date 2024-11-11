import { useState } from "react";

import "./App.css";
import Login from "./pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signUp";
import TodoList from "./pages/todoList";
import ProtectedRoute from "./pages/ProtectedRoute";
import NotFound from "./pages/error";

const App = () => {
  return (
    <>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
           <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
             {/* <Route path="/todolist" element={<TodoList />} /> */}
            <Route
              path="/todolist"
              element={
                <ProtectedRoute>
                  <TodoList />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
