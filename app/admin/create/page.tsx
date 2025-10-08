"use client";
import { createAdmin } from "./action";
import { LiaUser } from "react-icons/lia";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaArrowRight, FaFile } from "react-icons/fa";
import { useActionState } from "react";

const Administrator = () => {
  const [state, action, isLoading] = useActionState(createAdmin, {
    username: "",
    email: "",
    error: "",
  });
  return (
    <main className="flex bg-gray-200 h-screen justify-center">
      <div className=" w-full md:w-2/4 bg-white px-8 flex flex-col">
        <h2 className="text-xl text-center p-4 font-medium">
          Register New Admin
        </h2>

        <form
          action={action}
          className="flex flex-col items-center  text-sm text-slate-800 placeholder:text-slate-500"
        >
          {state?.error && (
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden bg-gray-200 w-auto text-center font-medium justify-center text-red-600">
              <p>{state.error}</p>
            </div>
          )}
          <div className="max-w-96 w-full px-4 gap-4 flex flex-col">
            {/* username */}
            <label htmlFor="name" className="font-medium">
              Full Name
            </label>
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
              <LiaUser />
              <input
                type="text"
                defaultValue={state?.username}
                name="username"
                className="h-full px-2 w-full outline-none bg-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* email */}
            <label htmlFor="email-address" className="font-medium mt-4">
              Email Address
            </label>
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
              <MdOutlineMailOutline />
              <input
                type="email"
                name="email"
                defaultValue={state?.email}
                className="h-full px-2 w-full outline-none bg-transparent"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* image */}
            <label htmlFor="email-address" className="font-medium mt-4">
              Picture
            </label>
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
              <FaFile />
              <input
                type="file"
                name="image"
                className="h-full px-2 w-full outline-none bg-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-1 mt-5 cursor-pointer ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              } text-white py-2.5 w-full rounded-full transition`}
            >
              {isLoading ? "Sending..." : "Submit"}
              {!isLoading && <FaArrowRight />}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Administrator;
