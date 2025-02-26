"use client";
import { useState } from "react";
import { Plus, Pencil, ImagePlus, Layout, RectangleHorizontal, Square, CheckCircle, Circle, Link } from "lucide-react";

export default function ManageAds() {
  const [priority, setPriority] = useState("Important");
  const [visibility, setVisibility] = useState(true);
  const [time, setTime] = useState("Current");

  return (
    <div className="p-6 bg-secondary min-h-screen text-primary">
      <h1 className="text-2xl font-bold">Manage Products and Ads</h1>
      <div className="mt-6 flex gap-4">
        <aside className="w-1/4 bg-white p-4 rounded-3xl shadow-md border-2 border-primary">
          <h2 className="text-lg font-semibold">Products</h2>
          <ul className="mt-2 space-y-2">
            <li className="text-primary flex items-center gap-2"><Plus size={16} /> Add Products</li>
            <li className="text-primary flex items-center gap-2"><Pencil size={16} /> Edit Products</li>
          </ul>
          <h2 className="text-lg font-semibold mt-4">Adverts</h2>
          <ul className="mt-2 space-y-2">
            <li className="text-primary flex items-center gap-2"><Plus size={16} /> Add Adverts</li>
            <li className="text-primary flex items-center gap-2"><Pencil size={16} /> Edit Adverts</li>
          </ul>
        </aside>

        <main className="flex-1 bg-white p-6 rounded-3xl shadow-md border-2 border-primary grid grid-cols-2 gap-4">
          <div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <ul className="flex space-x-4">
              <li className="border border-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-white cursor-pointer active:bg-secondary">
                <Layout size={16} /> Wide
              </li>
              <li className="border border-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-white cursor-pointer active:bg-secondary">
                <RectangleHorizontal size={16} /> Banner
              </li>
              <li className="border border-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-white cursor-pointer active:bg-secondary">
                <Square size={16} /> Small
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-secondary p-4 rounded-3xl border-2 border-primary">
            <div>
              <label className="block text-sm font-semibold text-primary">Company Name</label>
              <input className="border-b-2 border-primary w-full p-2 focus:outline-none bg-secondary" placeholder="Ford" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary">Product</label>
              <input className="border-b-2 border-primary w-full p-2 focus:outline-none bg-secondary" placeholder="F150" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary">Starting Date</label>
              <input type="date" className="border-b-2 border-primary w-full p-2 focus:outline-none bg-secondary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary">End Date</label>
              <input type="date" className="border-b-2 border-primary w-full p-2 focus:outline-none bg-secondary" />
            </div>
          </div>

          <div className="mt-4 flex gap-4">
                {['Current', 'Past'].map(option => (
                  <button
                    key={option}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${time === option ? 'bg-primary text-white border border-primary' : 'bg-secondary text-black border border-black'}`}
                    onClick={() => setTime(option)}
                  >
                    {time === option ? <CheckCircle size={16} /> : <Circle size={16} />}
                    <span>{option}</span>
                  </button>
                ))}
              </div>
        </div>

        <div className="border-2 border-primary p-4 rounded-3xl w-full ">
          <div>
            <div className="h-40 w-full flex flex-col items-center justify-center border-dashed border-2 border-primary rounded-lg">
              <ImagePlus size={40} className="text-primary" />
              <p className="mt-4 text-sm text-primary">Upload media for the campaign</p>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            {['Important', 'Medium', 'Low'].map(option => (
              <button
                key={option}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  priority === option ? 'bg-primary text-white border border-primary' : 'bg-secondary text-black border border-black'
                }`}
                onClick={() => setPriority(option)}
              >
                {priority === option ? <CheckCircle size={16} /> : <Circle size={16} />}
                <span>{option}</span>
              </button>
            ))}
          </div>

          <div className="mt-4">
                <button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${visibility ? 'bg-primary text-white border border-primary' : 'bg-secondary text-black border border-black'}`}
                  onClick={() => setVisibility(!visibility)}
                >
                  {visibility ? <CheckCircle size={16} /> : <Circle size={16} />}
                  <span>Visible</span>
                </button>
              </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-primary">Tag</label>
            <input type="text" className="w-full p-2 border-b-2 border-primary focus:outline-none bg-white" placeholder="#Ford #Ad" />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-primary">Short Description</label>
            <textarea className="w-full p-2 border-b-2 border-primary focus:outline-none bg-white" placeholder="Brief description here..."></textarea>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
