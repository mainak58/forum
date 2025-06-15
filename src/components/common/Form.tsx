"use client";

import toastNotify from "@/helper/toastNotify";
import Image from "next/image";
import {FormEvent, useEffect, useRef, useState} from "react";
import {z} from "zod";
import Input from "./Input";

function Form() {
  const [formData, setFormData] = useState({
    answer: "",
    file: null as File | null,
    url: "",
  });

  const [showAddButton, setShowAddButton] = useState<boolean>(false);

  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFileType, setSelectedFileType] = useState<
    "file" | "link" | null
  >(null);
  const [fileInputs, setFileInputs] = useState<
    Array<{type: "file" | "link"; value: File | string | null}>
  >([]);
  const [savedFileInputs, setSavedFileInputs] = useState<
    Array<{type: "file" | "link"; value: File | string | null}>
  >([]);
  const [isLastFileInputSaved, setIsLastFileInputSaved] =
    useState<boolean>(true);



  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };



  const base64ToFile = (base64String: string, filename: string): File => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  };

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
  
  async function formSubmit(e: FormEvent) {
    e.preventDefault();
    
    try {
      const processedInputs = await Promise.all(
        // file reader / readAsDataUrl
        savedFileInputs.map(async (input, index) => {
          if (input.type === "file" && input.value instanceof File) {
            const base64String = await convertFileToBase64(input.value);
            return {
              id: index + 1,
              type: input.type,
              fileName: input.value.name,
              fileSize: input.value.size,
              fileType: input.value.type,
              lastModified: input.value.lastModified,
              base64Data: base64String, // This is what you send to database
              // Original file object (for local use only, don't send to DB)
              originalFile: input.value,
            };
          } else {
            return {
              id: index + 1,
              type: input.type,
              url: input.value as string,
            };
          }
        })
      );


      const databasePayload = {
        answer: formData.answer,
        fileInputs: processedInputs.map((input) => {
          if (input.type === "file") {
            return {
              id: input.id,
              type: input.type,
              fileName: input.fileName,
              fileSize: input.fileSize,
              fileType: input.fileType,
              lastModified: input.lastModified,
              base64Data: input.base64Data, // Send this to database
            };
          } else {
            return {
              id: input.id,
              type: input.type,
              url: input.url,
            };
          }
        }),
      };

      const schema = z.object({
        answer: z
          .string()
          .refine((val) => val.trim().split(/\s+/).length >= 5, {
            message: "At least 5 words needed for answer",
          }),
      });

      const result = schema.safeParse({answer: formData.answer});

      if (!result.success) {
        toastNotify("Please give at least 5 words to continue", "error");
      } else {
        console.log("Database Payload:", databasePayload);
        toastNotify(
          "Form submitted successfully - Check console for database payload",
          "success"
        );

        setFormData({answer: "", file: null, url: ""});
        setFileInputs([]);
        setSavedFileInputs([]);
        setSelectedFileType(null);
        setIsLastFileInputSaved(true);
        setShowAddButton(false);
      }
    } catch (error) {
      console.error("Error processing files:", error);
      toastNotify("Error processing files", "error");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setFilePreviewUrl(null);
  }


  function handleFileTypeChange(type: "file" | "link") {
    setSelectedFileType(type);
    setShowAddButton(true);
  }

  function addFileInput() {
    if (!isLastFileInputSaved && fileInputs.length > 0) {
      toastNotify(
        "Please save the current file/link input before adding a new one.",
        "error"
      );
      return;
    }

    if (!selectedFileType) {
      toastNotify("Please select File or Link first.", "error");
      return;
    }

    setFileInputs((prev) => [...prev, {type: selectedFileType, value: null}]);
    setIsLastFileInputSaved(false);
    setShowAddButton(false);
  }

  function handleFileInputChange(index: number, value: File | string | null) {
    const newFileInputs = [...fileInputs];
    newFileInputs[index] = {...newFileInputs[index], value};
    setFileInputs(newFileInputs);
    setIsLastFileInputSaved(false);
  }

  function saveFileInput() {
    const lastFileInput = fileInputs[fileInputs.length - 1];

    if (
      !lastFileInput?.value ||
      (lastFileInput.type === "link" &&
        typeof lastFileInput.value === "string" &&
        !lastFileInput.value.trim()) ||
      (lastFileInput.type === "file" && !lastFileInput.value)
    ) {
      toastNotify(
        "Please select a file or enter a URL before saving.",
        "error"
      );
      return;
    }

    // If it's a file, we'll handle the conversion in the submit function
    const updatedSavedFileInputs = [...savedFileInputs];
    updatedSavedFileInputs[fileInputs.length - 1] = lastFileInput;
    setSavedFileInputs(updatedSavedFileInputs);
    setIsLastFileInputSaved(true);
    setShowAddButton(true);
    toastNotify("File/Link saved successfully", "success");
  }

  function deleteFileInput() {
    if (fileInputs.length > 0) {
      setFileInputs((prev) => prev.slice(0, -1));
      setSavedFileInputs((prev) => prev.slice(0, -1));
      setIsLastFileInputSaved(true);
      setShowAddButton(true);
    }
  }

  function deleteSavedFileInput(index: number) {
    const updatedSavedFileInputs = savedFileInputs.filter(
      (_, i) => i !== index
    );
    setSavedFileInputs(updatedSavedFileInputs);
    toastNotify("Saved file/link deleted successfully", "success");
  }

  return (
    <form
      onSubmit={formSubmit}
      className="w-full max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md space-y-4"
    >
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
          className="border border-gray-300 rounded px-3 py-2 h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div className="m-2">
        <div className="flex items-center space-x-4 mb-2">
          <label className="text-sm font-medium text-gray-700">
            Choose type:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="fileType"
              id="fileRadio"
              checked={selectedFileType === "file"}
              onChange={() => handleFileTypeChange("file")}
            />
            <label htmlFor="fileRadio" className="text-sm">
              File
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="fileType"
              id="linkRadio"
              checked={selectedFileType === "link"}
              onChange={() => handleFileTypeChange("link")}
            />
            <label htmlFor="linkRadio" className="text-sm">
              Link
            </label>
          </div>
        </div>

        {/* Add button - only show when a radio button is selected and no unsaved input */}
        {showAddButton && selectedFileType && (
          <button
            type="button"
            onClick={addFileInput}
            className="mb-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Add {selectedFileType === "file" ? "File" : "Link"}
          </button>
        )}

        {/* Display saved file/link inputs */}
        {savedFileInputs.map((savedInput, index) => (
          <div
            key={`saved-${index}`}
            className="mb-2 p-2 bg-gray-50 rounded border flex justify-between items-center"
          >
            <div>
              <span className="text-xs text-gray-600 font-medium">
                Saved {savedInput.type}:
              </span>
              {savedInput.type === "file" &&
              savedInput.value instanceof File ? (
                <span className="text-sm ml-2">{savedInput.value.name}</span>
              ) : (
                <span className="text-sm ml-2">{String(savedInput.value)}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => deleteSavedFileInput(index)}
              className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs"
            >
              Delete
            </button>
          </div>
        ))}

        {fileInputs.length > 0 && !isLastFileInputSaved && (
          <div className="space-y-2">
            {fileInputs[fileInputs.length - 1].type === "file" ? (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileInputChange(
                      fileInputs.length - 1,
                      e.target.files?.[0] || null
                    )
                  }
                  className="border border-gray-300 rounded px-3 py-2 bg-white file:bg-blue-50 file:border-none file:rounded file:px-3 file:py-1 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            ) : (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Enter URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  onChange={(e) =>
                    handleFileInputChange(fileInputs.length - 1, e.target.value)
                  }
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            )}


              <p className="text-sm">Click save to add multiple files..</p>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={saveFileInput}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={deleteFileInput}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

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

export default Form;
