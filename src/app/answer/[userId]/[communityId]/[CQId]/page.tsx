"use client";

import CustomPagination from "@/components/common/CustomPagination";
import AnswerPage from "@/components/page/answer/AnswerPage";
import Server from "@/helper/Server";
import Pagination from "@/interface/common/Pagination";
import {TblQuestion} from "@/interface/database";
import TblAnswer from "@/interface/database/TblAnswer";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
function page() {
  const params = useParams();

  const [question, setQuestion] = useState<TblQuestion[]>([]);
  const [answer, setAnswer] = useState<TblAnswer[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    NoOfPages: 1,
    PageIndex: 1,
  });
  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  const [numberOfAnswers, setNumberOfAnswers] = useState<number>(5);

  const questionApi = new Server({
    spName: "spCommunityForumAnonymous",
    mode: 6,
  });

  const answerApi = new Server({spName: "spCommunityForumAnonymous", mode: 7});

  function answerApiPage(PageSize: number, PageIndex: number) {
    answerApi
      .request({
        CommunityUserId: params.userId,
        CQId: params.CQId,
        PageSize: PageSize,
        PageIndex: PageIndex,
      })
      .then((req) => {
        const data = JSON.parse(req.result);
        const answerList = data[0].Answers ?? [];
        const page: Pagination = JSON.parse(data[0].PaginationData);
        setNumberOfPages(page?.NoOfPages!);
        setAnswer(answerList);
        setPagination({
          PageIndex: page.PageIndex ?? 1,
          NoOfPages: page.NoOfPages ?? 1,
        });
      })
      .catch((err) => {
        return console.log(err);
      });
  }

  function answerPage() {
    questionApi
      .request({
        CommunityUserId: params.userId,
        CommunityId: params.communityId,
        CQId: params.CQId,
      })
      .then((res) => {
        const requestQuestion = JSON.parse(res.result);
        console.log("req", requestQuestion);
        setQuestion(requestQuestion);
      })
      .catch((err) => {
        return console.log(err);
      });
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumberOfAnswers(Number(e.target.value));
  };

  useEffect(() => {
    answerPage();
  }, []);
  useEffect(() => {
    answerApiPage(numberOfAnswers, pagination?.PageIndex ?? 1);
  }, [
    params.userId,
    params.communityId,
    pagination.PageIndex,
    numberOfAnswers,
  ]);

  return (
    <>
      {!!question.length && (
        <AnswerPage
          data={question[0]}
          answerList={answer}
          userId={String(params.userId)}
          refetch={async () => {
            await answerApiPage(numberOfAnswers, pagination?.PageIndex ?? 1);
          }}
        />
      )}

      <div className="w-full flex justify-center px-4 bg-gray-50">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-auto max-w-xs">
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Choose a number:
                </label>
                <div className="relative">
                  <select
                    name="number"
                    id="number"
                    value={numberOfAnswers}
                    onChange={handleSelectChange}
                    className="w-full appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                    ▼
                  </div>
                </div>
              </div>

              <CustomPagination
                previousLabel="←"
                nextLabel="→"
                breakLabel="..."
                breakClassName="text-gray-400 text-sm px-2"
                pageCount={numberOfPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={({selected}) =>
                  setPagination((prev) => ({...prev, PageIndex: selected + 1}))
                }
                forcePage={pagination?.PageIndex ? pagination.PageIndex - 1 : 0}
                containerClassName="flex flex-wrap justify-center md:justify-end gap-2"
                activeClassName="bg-blue-600 text-white border-blue-600 shadow-sm"
                pageClassName="px-4 py-2 rounded-full border text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                previousClassName="px-4 py-2 rounded-full border text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                nextClassName="px-4 py-2 rounded-full border text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabledClassName="opacity-40 cursor-not-allowed pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
