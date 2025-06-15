"use client";
import {TblQuestion} from "@/interface/database";
import TblAnswer from "@/interface/database/TblAnswer";
import {useState} from "react";
import DrawerComponent from "../../Drawer";
import AnswerHelper from "./AnswerHelper";
import AnswerList from "./AnswerList";
import UpsertAnswerForm from "./UpsertAnswerForm";

type Props = {
  data: TblQuestion;
  answerList: TblAnswer[];
  userId?: string;
  refetch: () => void;
};

function AnswerPage(prop: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<TblAnswer | null>(null);

  return (
    <div className="w-full flex justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md px-6 py-8 space-y-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">
            {prop.data.QuestionText}
          </h1>

          <p className="text-slate-700 text-base leading-relaxed">
            Hello, welcome to the Sync fusion Essential Studio ReactJS Platform.
            Post all issues related to Sync fusion Essential Studio ReactJS and
            feedback in this forum.
            <br />
            <span className="block mt-3">
              Regards, Sync fusion Essential Studio ReactJS Team
            </span>
          </p>


          <div className="flex items-center space-x-4 pt-2">
            <button className="bg-blue-100 text-blue-700 border border-blue-100 text-sm font-semibold rounded-md py-2 px-4 transition hover:bg-blue-200">
              Sign In
            </button>
            <span className="text-sm text-gray-600">to post a reply</span>
          </div>


          <div className="space-y-4">
            {prop.answerList.map((a, index) => (
              <AnswerList
                key={index}
                answer={a}
                userId={String(prop.userId)}
                refetch={prop.refetch}
                onAnswerSelect={(a) => setSelectedAnswer(a)}
              />
            ))}
          </div>

          <div className="border-t border-gray-200" />

          <button
            className="bg-slate-100 text-slate-800 border border-slate-300 text-sm font-semibold rounded-md py-2 px-4 transition hover:bg-slate-200"
            onClick={() =>
              setSelectedAnswer({
                AnswerText: undefined,
                AnswerAttachment: [],
              })
            }
          >
            Add Comment
          </button>
        </div>

        {selectedAnswer && (
          <DrawerComponent
            open={!!selectedAnswer}
            onClose={() => setSelectedAnswer(null)}
            title={selectedAnswer?.AnswerId ? "Update Answer" : "Create Answer"}
            size="lg"
          >
            <UpsertAnswerForm
              selectedAnswer={selectedAnswer}
              refetch={prop.refetch}
              onDrawerClose={() => setSelectedAnswer(null)}
            />
          </DrawerComponent>
        )}

        <div className="w-full md:w-1/3 space-y-6">
          <AnswerHelper
            createdUser={prop.data.CreatedUser?.[0]!}
            createdOn={prop.data.CreatedOn!}
            replies={prop.data.NoOfReplies!}
            questionTags={prop.data.QuestionTags!}
          />
        </div>
      </div>
    </div>
  );
}

export default AnswerPage;
