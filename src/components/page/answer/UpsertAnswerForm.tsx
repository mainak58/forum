"use client";
import {apiErrorToast} from "@/helper/apiErrorToast";
import Server from "@/helper/Server";
import toastNotify from "@/helper/toastNotify";
import TblAnswer from "@/interface/database/TblAnswer";
import TblAnswerAttachment from "@/interface/database/TblAnswerAttachment";
import {useParams} from "next/navigation";
import {useRef, useState} from "react";
import QuillEditor from "../../QuillEditor";

type Props = {
  selectedAnswer: TblAnswer;
  refetch: () => void;
  onDrawerClose: () => void;
};

function UpsertAnswerForm(prop: Props) {
  const param = useParams();

  console.log("p", param);
  const editorRef = useRef<any>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emptyRef = useRef<HTMLFormElement>(null);

  const [quillContent, setQuillContent] = useState<string>(
    prop.selectedAnswer.AnswerText ?? ""
  );

  const [selectedRadio, setSelectedRadio] = useState<"file" | "url">();

  const [attachmentList, setAttachmentList] = useState<TblAnswerAttachment[]>(
    prop.selectedAnswer.AnswerAttachment ?? []
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  function formSaved() {
    if (!selectedRadio || !attachmentInputRef.current) return;

    const inputValue = attachmentInputRef.current.value.trim();
    if (!inputValue) return;

    if (selectedRadio === "url") {
      const newInput: TblAnswerAttachment = {
        localId: Date.now(), // Use timestamp for unique ID
        IsSaved: true,
        AttachmentType: "External",
        ExternalUrl: inputValue,
      };
      setAttachmentList((prev) => [...prev, newInput]);
    } else if (selectedRadio === "file" && fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const newInput: TblAnswerAttachment = {
        localId: Date.now(),
        IsSaved: true,
        AttachmentType: "Internal",
        ExternalUrl: file.name, 
      };
      setAttachmentList((prev) => [...prev, newInput]);
    }

    emptyRef.current?.reset();
    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  }

  function handleEdit(attachment: TblAnswerAttachment) {
    setEditingId(attachment.AttachmentId ?? attachment.localId ?? 0);
    setEditValue(attachment.ExternalUrl ?? "");
  }

  function saveEdit(attachment: TblAnswerAttachment) {
    setAttachmentList((prev) =>
      prev.map((item) =>
        (item.AttachmentId ?? item.localId) ===
        (attachment.AttachmentId ?? attachment.localId)
          ? {...item, ExternalUrl: editValue}
          : item
      )
    );
    setEditingId(null);
    setEditValue("");
  }

  function deleteAttachment(attachment: TblAnswerAttachment) {
    setAttachmentList((prev) =>
      prev.filter(
        (item) =>
          (item.AttachmentId ?? item.localId) !==
          (attachment.AttachmentId ?? attachment.localId)
      )
    );
  }

  const upsertAnsApi = new Server({
    spName: "spCommunityForumAnonymous",
    mode: 5,
  });

  async function handleSubmit() {
    if (!quillContent.trim()) {
      toastNotify("Please enter answer text");
      return;
    }

    const payload = {
      CQId: Number(param.CQId),
      CommunityUserId: String(param.userId),
      AnswerText: quillContent.trim(),
      AnswerAttachment: attachmentList,
      AnswerId: !!prop.selectedAnswer.AnswerId
        ? prop.selectedAnswer.AnswerId
        : undefined,
    };

    try {
      const response = await upsertAnsApi.request(payload);
      console.log("res", response);
      if (response.isSuccess) {
        await prop.refetch();
        toastNotify(response.result);
        prop.onDrawerClose();
      } else {
        apiErrorToast(response);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toastNotify("An error occurred while submitting");
    }
  }

  return (
    <>
      <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-md space-y-6">
        <QuillEditor
          ref={editorRef}
          initialContent={quillContent}
          onChange={(html) => {
            setQuillContent(html);
          }}
        />

        <div className="flex flex-col items-start m-5">
          <div className="flex space-x-6 text-sm font-medium text-gray-700 mt-4">
            <p className="font-semibold text-lg">Answer attachment</p>
            <label className="inline-flex items-center space-x-2">
              <input
                type="radio"
                name="fileInput"
                value="file"
                checked={selectedRadio === "file"}
                onChange={() => setSelectedRadio("file")}
                className="accent-blue-600"
              />
              <span>File</span>
            </label>

            <label className="inline-flex items-center space-x-2">
              <input
                type="radio"
                name="fileInput"
                value="url"
                checked={selectedRadio === "url"}
                onChange={() => setSelectedRadio("url")}
                className="accent-blue-600"
              />
              <span>Link</span>
            </label>
          </div>

          <form ref={emptyRef} className="w-full">
            {selectedRadio && (
              <div className="flex w-full gap-3 mt-3">
                {selectedRadio === "url" ? (
                  <input
                    type="url"
                    ref={attachmentInputRef}
                    placeholder="Paste link here..."
                    className="w-full md:w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="w-full md:w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <input type="hidden" ref={attachmentInputRef} />
                  </>
                )}
                <button
                  type="button"
                  onClick={formSaved}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            )}
          </form>
        </div>

        {attachmentList.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Saved Attachments:</h4>
            {attachmentList.map((m) => {
              const isEditing = editingId === (m.AttachmentId ?? m.localId);
              return (
                <div
                  key={m.AttachmentId ?? m.localId}
                  className="flex justify-between items-center border p-2 rounded-lg bg-gray-100"
                >
                  {isEditing ? (
                    <input
                      value={editValue}
                      type="url"
                      placeholder="Enter URL..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition mr-2"
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    <p className="truncate flex-1 mr-2">{m.ExternalUrl}</p>
                  )}

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          className="text-green-600 hover:underline text-sm bg-green-200 px-3 py-1 rounded"
                          onClick={() => saveEdit(m)}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-600 hover:underline text-sm bg-gray-200 px-3 py-1 rounded"
                          onClick={() => {
                            setEditingId(null);
                            setEditValue("");
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="text-blue-600 hover:underline text-sm bg-blue-200 px-3 py-1 rounded"
                        onClick={() => handleEdit(m)}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      className="text-red-600 hover:underline text-sm bg-red-200 px-3 py-1 rounded"
                      onClick={() => deleteAttachment(m)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default UpsertAnswerForm;
