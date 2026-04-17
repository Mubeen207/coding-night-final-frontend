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

      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 sm:py-10 px-4">
        <div className="w-full max-w-md flex justify-between items-center mb-4 px-1">
          <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate max-w-37.5 sm:max-w-none">
            User: {session.user?.name || session.user?.email}
          </span>
          <button
            onClick={() => signOut()}
            className="text-[10px] sm:text-xs text-red-500 hover:underline cursor-pointer font-bold whitespace-nowrap"
          >
            Logout
          </button>
        </div>

        <div className="w-full max-w-md bg-white p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center tracking-tight">
            Todo Application
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(toTitleCase(e.target.value))}
              placeholder="What needs to be done?"
              className="w-full py-2.5 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700 text-sm sm:text-base"
            />

            {edit ? (
              <button
                onClick={haldleUpdate}
                className="w-full sm:w-auto px-6 py-2.5 text-white font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all rounded-lg shadow-md cursor-pointer text-sm sm:text-base"
              >
                Update
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full sm:w-auto px-6 py-2.5 text-white font-bold bg-orange-800 hover:bg-orange-900 active:scale-95 transition-all rounded-lg shadow-md cursor-pointer text-sm sm:text-base"
              >
                Add
              </button>
            )}
          </div>

          <ul className="space-y-3">
            {!todos ? (
              <p className="text-center text-gray-500 py-4 text-sm">
                Loading...
              </p>
            ) : todos.length > 0 ? (
              todos.map((todo) => (
                <li
                  key={todo._id}
                  className="group border border-gray-100 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-lg hover:shadow-md transition-shadow gap-3"
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-gray-800 font-semibold truncate text-sm sm:text-base">
                      {todo.title}
                    </span>
                    {admin && (
                      <span className="text-[10px] text-indigo-500 mt-1 italic">
                        {todo.email}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end sm:shrink-0">
                    <button
                      className="flex-1 sm:flex-none p-2 px-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold transition-colors text-xs cursor-pointer"
                      onClick={() => haldleEdit(todo)}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 sm:flex-none p-2 px-3 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold transition-colors text-xs cursor-pointer"
                      onClick={() => handleDelete(todo)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400 py-4 italic text-sm">
                No tasks found. Add one!
              </p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}