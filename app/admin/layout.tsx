import "../globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="flex bg-gray-100 h-screen justify-center">
          <div className=" w-full md:w-2/4 bg-white  px-8 flex flex-col">
            <div className="m-auto w-2/3 text-slate-800">
              <div className=" md:flex md:flex-row flex flex-col justify-between mb-8 items-center">
                <p className=" text-2xl whitespace-nowrap">@administrator</p>
              </div>
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
