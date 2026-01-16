"use client";

import { useRef, useState } from "react";
import { Video, Phone, Calendar, Clock } from "lucide-react";

export default function QuickSchedule() {
  const hiddenDateRef = useRef<HTMLInputElement>(null);
  const hiddenTimeRef = useRef<HTMLInputElement>(null);

  const [candidate, setCandidate] = useState("Alex Morgan");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [formatType, setFormatType] = useState<"video" | "phone">("video");

  /* ---------------- Handlers ---------------- */

  const handleSchedule = () => {
    console.log("Schedule button clicked");
    console.log({
      candidate,
      date,
      time,
      formatType,
    });

    if (!date || !time) {
      console.warn("Date or time missing");
      return;
    }

    console.log("Interview scheduled successfully!");
  };

  return (
    <div className="rounded-xl p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] transition-colors duration-300">
      <h3 className="text-[var(--text-primary)] font-semibold">Quick Schedule</h3>
      <p className="text-[var(--text-tertiary)] text-sm mb-5">
        Set up an interview instantly
      </p>

      {/* Candidate */}
      <label className="text-xs text-[var(--text-tertiary)] font-medium uppercase">CANDIDATE</label>
      <select
        value={candidate}
        onChange={(e) => {
          setCandidate(e.target.value);
          console.log("Candidate selected:", e.target.value);
        }}
        className="w-full mt-1 mb-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-secondary)] cursor-pointer hover:border-[var(--border-accent)] transition"
      >
        <option>Alex Morgan</option>
        <option>John Doe</option>
      </select>

      {/* DATE */}
      <label className="text-xs text-[var(--text-tertiary)] font-medium uppercase">DATE</label>
      <div className="relative mt-1 mb-4">
        <input
          type="text"
          value={date}
          readOnly
          placeholder="dd-mm-yyyy"
          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 pr-10 text-[var(--text-secondary)] cursor-pointer hover:border-[var(--border-accent)] transition"
          onClick={() => {
            console.log("Date input clicked");
            hiddenDateRef.current?.showPicker();
          }}
        />

        <Calendar
          size={16}
          onClick={() => {
            console.log("Calendar icon clicked");
            hiddenDateRef.current?.showPicker();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)]"
        />

        <input
          ref={hiddenDateRef}
          type="date"
          className="absolute inset-0 opacity-0 pointer-events-none"
          onChange={(e) => {
            setDate(e.target.value);
            console.log("Date selected:", e.target.value);
          }}
        />
      </div>

      {/* TIME */}
      <label className="text-xs text-[var(--text-tertiary)] font-medium uppercase">TIME</label>
      <div className="relative mt-1 mb-4">
        <input
          type="text"
          value={time}
          readOnly
          placeholder="--:--"
          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 pr-10 text-[var(--text-secondary)] cursor-pointer hover:border-[var(--border-accent)] transition"
          onClick={() => {
            console.log("Time input clicked");
            hiddenTimeRef.current?.showPicker();
          }}
        />

        <Clock
          size={16}
          onClick={() => {
            console.log("Clock icon clicked");
            hiddenTimeRef.current?.showPicker();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)]"
        />

        <input
          ref={hiddenTimeRef}
          type="time"
          className="absolute inset-0 opacity-0 pointer-events-none"
          onChange={(e) => {
            setTime(e.target.value);
            console.log("Time selected:", e.target.value);
          }}
        />
      </div>

      {/* FORMAT */}
      <label className="text-xs text-[var(--text-tertiary)] font-medium uppercase">FORMAT</label>
      <div className="grid grid-cols-2 gap-3 my-3">
        <button
          onClick={() => {
            setFormatType("video");
            console.log("Format selected: Video Call");
          }}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer font-medium transition ${formatType === "video"
              ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md"
              : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)]"
            }`}
        >
          <Video size={16} /> Video Call
        </button>

        <button
          onClick={() => {
            setFormatType("phone");
            console.log("Format selected: Phone Call");
          }}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer font-medium transition ${formatType === "phone"
              ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md"
              : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)]"
            }`}
        >
          <Phone size={16} /> Phone Call
        </button>
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSchedule}
        className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-indigo-500 py-3 rounded-lg text-white font-medium cursor-pointer hover:from-cyan-600 hover:to-indigo-600 transition shadow-lg"
      >
        Schedule & Send Link
      </button>
    </div>
  );
}
