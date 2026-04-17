"use client";
import React, { useEffect, useState } from "react";
import toTitleCase from "@/app/components/ToTitleCase";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const [todoInput, setTodoInput] = useState("");
  const [admin, setAdmin] = useState(false);
  const [edit, isEdit] = useState(false);
  const [todos, setTodos] = useState(null);
  const [isId, setIsID] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession();

  const fetchData = async () => {
    try {
      const res = await fetch("https://ecommercedb-five.vercel.app/api/todos");
      if (!res.ok) throw new Error("Server response issues");
      const result = await res.json();
      const allTodos = result.data;
      console.log(allTodos);

      let fillterdData = [];
      if (session?.user?.email === "admin@gmail.com") {
        fillterdData = allTodos;
        setAdmin(true);
      } else {
        fillterdData = allTodos.filter(
          (todo) => todo.email === session.user?.email,
        );
        setAdmin(false);
      }

      setTodos(fillterdData);
    } catch (error) {
      console.log("Server is not connecting...", error.message);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Verifying Session...</p>
      </div>
    );
  }

  if (!session) return null;

  const handleAdd = async () => {
    if (todoInput === "") return alert("Please Enter Todo");
    const response = await fetch(
      "https://ecommercedb-five.vercel.app/api/todo",
      {
        method: "POST",
        body: JSON.stringify({ title: todoInput, email: session.user?.email }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await response.json();
    alert(data.message);
    setTodoInput("");
    isEdit(false);
    setIsID("");
    fetchData();
  };

  const haldleUpdate = async () => {
    if (todoInput === "") return alert("Please Enter Todo");
    const response = await fetch(
      `https://ecommercedb-five.vercel.app/api/todo/${isId}`,
      {
        method: "PUT",
        body: JSON.stringify({ title: todoInput }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await response.json();
    alert(data.message);
    setTodoInput("");
    isEdit(false);
    setIsID("");
    fetchData();
  };

  const haldleEdit = (todo) => {
    isEdit(true);
    setTodoInput(todo.title);
    setIsID(todo._id);
  };

  const handleDelete = async (todo) => {
    try {
      const response = await fetch(
        `https://ecommercedb-five.vercel.app/api/todo/${todo._id}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      setTodoInput("");
      isEdit(false);
      setIsID("");
      alert(data.message);
      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <>
      <title>Todo Application</title>

      <div>WelCome</div>
    </>
  );
}
