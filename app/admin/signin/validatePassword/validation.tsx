"use client";

import { MdOutlineMailOutline } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { useActionState, useEffect } from "react";
import { validatePassword } from "./action";
import { useRouter } from "next/navigation";

export const ValidatePassword = () => {
  const router = useRouter();
  const [state, action, isLoading] = useActionState(validatePassword, {
    code: "",
    error: "",
    success: false,
  });
  useEffect(() => {
    if (state?.success) {
      router.push("/");
    }
  }, [state, action]);

  return (
    <form action={action} className="flex flex-col gap-4 text-slate-800">
      {state?.error && (
        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden bg-gray-200 w-auto text-center font-medium justify-center text-red-600">
          <p>{state.error}</p>
        </div>
      )}

      {/* validation code */}
      <label htmlFor="email-address" className="font-medium mt-4">
        Enter Code
      </label>
      <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
        <MdOutlineMailOutline />
        <input
          type="text"
          name="code"
          defaultValue={state?.code}
          className="h-full px-2 w-full outline-none bg-transparent"
          placeholder="Enter code"
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
    </form>
  );
};
