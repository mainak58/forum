"use client";
import toastNotify from "@/helper/toastNotify";
import Image from "next/image";
import {FormEvent, useEffect, useRef, useState} from "react";
import {z} from "zod";
import Input from "./Input";

function QuestionForm() {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    file: null as File | null,
  });

  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value, files, type} = event.target;
    const file = type === "file" ? files?.[0] || null : null;

    setFormData((prev) => ({
      ...prev,
      [id]: file || value,
    }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreviewUrl(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  function formSubmit(e: FormEvent) {
    e.preventDefault();

    const schema = z.object({
      question: z
        .string()
        .min(5, {message: "Question must be at least 5 characters"}) // optional
        .max(100, {message: "Question must be less than 100 characters"})
        .refine((val) => val.trim().split(/\s+/).length >= 5, {
          message: "At least 5 words needed for question",
        }),
      answer: z.string().refine((val) => val.trim().split(/\s+/).length >= 5, {
        message: "At least 5 words needed for answer",
      }),
      file: z
        .instanceof(File)
        .refine((file) => /\.(jpg|jpeg|png|pdf)$/i.test(file.name), {
          message: "Unsupported file type",
        })
        .refine((file) => file.size <= 2 * 1024 * 1024, {
          message: "File size must be ≤ 2MB",
        })
        .optional()
        .nullable(),
    });

    const result = schema.safeParse(formData);
    console.log(result.error);

    if (!result.success) {
      toastNotify("please give at least 5 word to continue", "error");
    } else {
      setFormData({
        question: "",
        answer: "",
        file: null,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFilePreviewUrl(null);

    console.log("All valid:", result.data);
  }

  return (
    <form
      onSubmit={formSubmit}
      className="w-full max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md space-y-4"
    >
      {/* Question Field */}
      <div className="flex flex-col">
        <label
          htmlFor="question"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Question
        </label>
        <Input
          type="text"
          id="question"
          value={formData.question}
          required
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Answer Field */}
      <div className="flex flex-col">
        <label
          htmlFor="answer"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Answer
        </label>
        <Input
          type="text"
          id="answer"
          value={formData.answer}
          required
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* File Upload */}
      <div className="flex flex-col">
        <label
          htmlFor="file"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Upload File (optional)
        </label>
        <Input
          type="file"
          id="file"
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 bg-white file:bg-blue-50 file:border-none file:rounded file:px-3 file:py-1 file:text-blue-700 hover:file:bg-blue-100"
          ref={fileInputRef}
          required={false}
        />
      </div>

      {/* Image Preview */}
      {filePreviewUrl && formData.file?.type.startsWith("image/") && (
        <div className="flex justify-start">
          <Image
            height={80}
            width={80}
            src={filePreviewUrl}
            alt="Preview"
            className="rounded-md border"
          />
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition font-semibold"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default QuestionForm;
