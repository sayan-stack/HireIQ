"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Pencil, Trash, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useJobForm } from "../context/ContextJobForm";

type QuestionType = "yesno" | "numeric" | "text";

export default function SettingsSection() {
  const { form, setForm } = useJobForm();

  /* ================= Helpers ================= */
  const resetModal = () => {
    setForm((prev) => ({
      ...prev,
      questionModal: {
        open: false,
        editingId: null,
        text: "",
        type: "yesno",
        mandatory: true,
      },
    }));
  };

  const saveQuestion = () => {
    const { text, type, mandatory, editingId } = form.questionModal;
    if (!text.trim()) return;

    if (editingId) {
      console.log("✏️ Editing Question:", {
        id: editingId,
        text,
        type,
        mandatory,
      });

      setForm((prev) => ({
        ...prev,
        screeningQuestions: prev.screeningQuestions.map((q) =>
          q.id === editingId
            ? { ...q, text, type, mandatory }
            : q
        ),
      }));
    } else {
      const newQuestion = {
        id: Date.now(),
        text,
        type,
        mandatory,
      };

      console.log("➕ Adding Question:", newQuestion);

      setForm((prev) => ({
        ...prev,
        screeningQuestions: [...prev.screeningQuestions, newQuestion],
      }));
    }

    resetModal();
  };

  const editQuestion = (q: any) => {
    console.log("📝 Open Edit Modal:", q);
    setForm((prev) => ({
      ...prev,
      questionModal: {
        open: true,
        editingId: q.id,
        text: q.text,
        type: q.type,
        mandatory: q.mandatory,
      },
    }));
  };

  const deleteQuestion = (id: number) => {
    console.log("🗑️ Deleting Question ID:", id);
    setForm((prev) => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.filter(
        (q) => q.id !== id
      ),
    }));
  };

  return (
    <div className="space-y-8">
      {/* ================= Submission Requirements ================= */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">
          Submission Requirements
        </h3>

        {[
          {
            title: "Enable Resume Upload",
            desc: "Candidates must upload a resume to apply.",
            value: form.resumeRequired,
            key: "resumeRequired",
          },
          {
            title: "Require Cover Letter",
            desc: "Make cover letter submission mandatory.",
            value: form.coverLetterRequired,
            key: "coverLetterRequired",
          },
          {
            title: "Allow LinkedIn Import",
            desc: "Let candidates autofill application with LinkedIn.",
            value: form.linkedinImport,
            key: "linkedinImport",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-4 border-b border-white/5 last:border-none"
          >
            <div>
              <p className="text-sm text-white">{item.title}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
            <Switch
              checked={item.value}
              onCheckedChange={(v) => {
                console.log(item.title, v);
                setForm((prev) => ({
                  ...prev,
                  [item.key]: v,
                }));
              }}
              className="cursor-pointer data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-600"
            />
          </div>
        ))}
      </div>

      {/* ================= Screening Questions ================= */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white">
            Screening Questions
          </h3>
          <button
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                questionModal: {
                  open: true,
                  editingId: null,
                  text: "",
                  type: "yesno",
                  mandatory: true,
                },
              }))
            }
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            <Plus size={14} /> Add Question
          </button>
        </div>

        <div className="space-y-3">
          {form.screeningQuestions.map((q) => (
            <div
              key={q.id}
              className="flex justify-between items-start p-4 rounded-lg border border-white/10 bg-[#020617]"
            >
              <div>
                <p className="text-sm text-white">{q.text}</p>
                <div className="mt-2 flex gap-3 text-xs text-slate-400">
                  <span>{q.type}</span>
                  {q.mandatory && <span>Mandatory</span>}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => editQuestion(q)}
                  className="cursor-pointer text-slate-400 hover:text-white"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="cursor-pointer text-slate-400 hover:text-red-400"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= Logistics ================= */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">
          Logistics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Application Deadline
            </label>

            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-[#020617] border border-white/20 text-white text-sm cursor-pointer">
                  {form.deadline
                    ? format(form.deadline, "dd-MM-yyyy")
                    : "Select date"}
                  <CalendarIcon size={16} />
                </button>
              </PopoverTrigger>

              <PopoverContent className="bg-[#020617] border-white/10">
                <Calendar
                  mode="single"
                  selected={form.deadline}
                  onSelect={(d) => {
                    console.log("📅 Deadline:", d);
                    setForm((prev) => ({
                      ...prev,
                      deadline: d,
                    }));
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Confirmation Email Subject
            </label>
            <Input
              value={form.confirmationEmail}
              onChange={(e) => {
                console.log("✉️ Confirmation Email:", e.target.value);
                setForm((prev) => ({
                  ...prev,
                  confirmationEmail: e.target.value,
                }));
              }}
              className="bg-[#020617] border-white/20 text-white"
            />
          </div>
        </div>
      </div>

      {/* ================= Add / Edit Question Modal ================= */}
      <Dialog
        open={form.questionModal.open}
        onOpenChange={(v) =>
          setForm((prev) => ({
            ...prev,
            questionModal: { ...prev.questionModal, open: v },
          }))
        }
      >
        <DialogContent className="bg-[#020617] border border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {form.questionModal.editingId
                ? "Edit Question"
                : "Add Question"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <Input
              placeholder="Enter your question"
              value={form.questionModal.text}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  questionModal: {
                    ...prev.questionModal,
                    text: e.target.value,
                  },
                }))
              }
            />

            <Select
              value={form.questionModal.type}
              onValueChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  questionModal: {
                    ...prev.questionModal,
                    type: v as QuestionType,
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yesno">Yes / No</SelectItem>
                <SelectItem value="numeric">Numeric</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-between items-center">
              <span className="text-sm">Mandatory</span>
              <Switch
                checked={form.questionModal.mandatory}
                onCheckedChange={(v) =>
                  setForm((prev) => ({
                    ...prev,
                    questionModal: {
                      ...prev.questionModal,
                      mandatory: v,
                    },
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={resetModal}>
                Cancel
              </Button>
              <Button onClick={saveQuestion}>
                {form.questionModal.editingId ? "Save" : "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
