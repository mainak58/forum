"use client";
import CustomPagination from "@/components/common/CustomPagination";
import Server from "@/helper/Server";
import toastNotify from "@/helper/toastNotify";
import Pagination from "@/interface/common/Pagination";
import {TblQuestion} from "@/interface/database";
import {TBlCommunityTags} from "@/interface/database/TBlCommunityTags";
import Image from "next/image";
import {lazy, Suspense, useEffect, useState} from "react";
import {BiCheckCircle, BiHelpCircle} from "react-icons/bi";
import {BsActivity} from "react-icons/bs";
import {CiCircleQuestion} from "react-icons/ci";
import {GoCommentDiscussion} from "react-icons/go";
import {MdOutlineChatBubbleOutline, MdPerson} from "react-icons/md";
import banner from "../../../../public/static/banner.jpg";
import animation from "../../../../public/static/Rolling@1x-0.4s-200px-200px.svg";
// import QuestionList from "./QuestionList";

const QuestionList = lazy(() => import("./QuestionList"));

type Props = {
  userId?: string;
  communityId?: number;
  communityName: string;
  CommunityTags?: TBlCommunityTags[];
};

function QuestionPage(props: Props) {
  const {userId, communityId} = props;
  const [questionList, setQuestionList] = useState<TblQuestion[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    NoOfPages: 1,
    PageIndex: 1,
  });
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [numberOfAnswers, setNumberOfAnswers] = useState<number>(5);
  const [activeTab, setActiveTab] = useState("activity");

  const questionApi = new Server({
    spName: "spCommunityForumAnonymous",
    mode: 2,
  });

  async function fetchQuestion(
    PageSize: number,
    PageIndex: number,
    TagId?: number
  ) {
    questionApi
      .request({
        CommunityId: communityId,
        CommunityUserId: userId,
        PageSize,
        PageIndex,
        ...(!!TagId && {TagId}),
      })
      .then((json) => {
        const data = JSON.parse(json.result);
        const questions = data[0]?.Questions ?? [];
        const page: Pagination = JSON.parse(data[0].PaginationData);
        setNumberOfPages(page?.NoOfPages!);
        setQuestionList(questions);
        console.log("q", questions);
        setPagination({
          PageIndex: page.PageIndex ?? 1,
          NoOfPages: page.NoOfPages ?? 1,
        });
      })
      .catch((err) => {
        console.log(err);
        toastNotify("failed to fetch data", "error");
      });
  }
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumberOfAnswers(Number(e.target.value));
  };

  useEffect(() => {
    fetchQuestion(numberOfAnswers, pagination?.PageIndex ?? 1);
  }, [communityId, userId, pagination.PageIndex, numberOfAnswers]);

  return (
    <>
      <div>
        <div className="font-sans text-md">
          <Image src={banner} className="h-[300px]" alt="image" />

          <div className="w-full flex justify-around h-13 absolute top-65 p-5 bg-white">
            <div className="flex justify-evenly w-[1500px] items-center font-semibold">
              <div className="flex gap-2 justify-between items-center">
                <MdPerson />
                1980 person
              </div>
              <div className="flex gap-2 justify-between items-center">
                <MdOutlineChatBubbleOutline />
                2050 posts
              </div>
              <div className="flex gap-2 justify-between items-center">
                <GoCommentDiscussion />
                20520 discussion
              </div>
              <div className="flex gap-2 justify-between items-center">
                <CiCircleQuestion />
                20520 questions
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen flex flex-col lg:flex-row w-full justify-evenly items-start font-roboto sm:gap-4 p-2 sm:p-4">
          <div className="flex flex-col justify-start items-start w-full lg:w-auto lg:flex-1 max-w-4xl mx-auto lg:mx-0 sm:gap-5 p-3 mt-3">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight font-sans ml-2">
              {props.communityName}
            </h1>
            <hr className="border-gray-700 w-[850px]" />

            <div className="flex gap-4 font-semibold font-sans ml-2 ">
              <button
                className={`flex items-center gap-1 px-3 py-1 border-b-2 rounded-md transition-all duration-200 cursor-pointer ${
                  activeTab === "activity"
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                    : "border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-400"
                }`}
                onClick={() => {
                  setActiveTab("activity");
                  fetchQuestion(numberOfAnswers, pagination?.PageIndex ?? 1);
                }}
              >
                <BsActivity size={18} /> Activity
              </button>

              <button
                className={`flex items-center gap-1 px-3 py-1 border-b-2 rounded-md transition-all duration-200 cursor-pointer ${
                  activeTab === "answered"
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                    : "border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-400"
                }`}
                onClick={() => {
                  setActiveTab("answered");
                  console.log("hello world");
                }}
              >
                <BiCheckCircle size={18} /> Answered
              </button>

              <button
                className={`flex items-center gap-1 px-3 py-1 border-b-2 rounded-md transition-all duration-200 cursor-pointer ${
                  activeTab === "unanswered"
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                    : "border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-400"
                }`}
                onClick={() => {
                  setActiveTab("unanswered");
                  console.log("hello world");
                }}
              >
                <BiHelpCircle size={18} /> Unanswered
              </button>
            </div>

            <Suspense
              fallback={
                <Image
                  height={100}
                  width={100}
                  src={animation}
                  alt="animation"
                />
              }
            >
              <div className="w-full flex flex-col gap-3">
                {!!questionList?.length ? (
                  <QuestionList
                    data={questionList}
                    userId={userId!}
                    communityId={communityId!}
                    refetch={async () =>
                      await fetchQuestion(
                        numberOfAnswers,
                        pagination?.PageIndex ?? 1
                      )
                    }
                    tagIdRefetch={async (TagId) =>
                      await fetchQuestion(numberOfAnswers, 1, TagId)
                    }
                  />
                ) : (
                  <p>No question to show</p>
                )}
              </div>
            </Suspense>

            <div className="absolute top-13 w-[700px] p-6 rounded-md flex flex-col gap-6">
              <h1 className="text-3xl font-sans font-bold text-gray-800">
                Hi guest! Connect with us
              </h1>
              <div className="w-full flex">
                <input
                  type="text"
                  className=" w-full px-4 py-2 rounded-l-md bg-white text-black placeholder-gray-600 focus:outline-none"
                  placeholder="Enter something..."
                />
                <button className="bg-inherit text-black font-bold px-4 py-2 rounded-r-md transition border-2 border-white cursor-pointer">
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="number"
                  className="block font-medium text-gray-700"
                >
                  Choose a number:
                </label>
                <select
                  name="number"
                  id="number"
                  value={numberOfAnswers}
                  onChange={handleSelectChange}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>

                <p className="text-sm text-gray-600">
                  Selected number of answers: {numberOfAnswers}
                </p>
              </div>

              <CustomPagination
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={numberOfPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={({selected}) =>
                  setPagination((prev) => ({...prev, PageIndex: selected + 1}))
                }
                forcePage={
                  pagination?.PageIndex ? pagination?.PageIndex - 1 : 0
                }
                containerClassName={
                  "flex gap-2 flex-wrap md:justify-end mt-2 md:mt-0"
                }
                activeClassName={"bg-blue-500 text-white"}
                pageClassName={"px-3 py-1 border rounded cursor-pointer"}
                previousClassName={"px-3 py-1 border rounded cursor-pointer"}
                nextClassName={"px-3 py-1 border rounded cursor-pointer"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
              />
            </div>
          </div>
          <CommunityTagGrid
            CommunityTags={props.CommunityTags ?? []}
            onClick={async (TagId) => {
              await fetchQuestion(numberOfAnswers, 1, TagId);
            }}
          />
        </div>
      </div>
    </>
  );
}

const colorClasses = [
  "border-red-500 text-red-500",
  "border-orange-500 text-orange-500",
  "border-yellow-700 text-yellow-400",
  "border-green-500 text-green-500",
  "border-cyan-500 text-cyan-500",
  "border-blue-500 text-blue-500",
  "border-violet-500 text-violet-500",
] as const;

function CommunityTagGrid({
  CommunityTags,
  onClick,
}: {
  CommunityTags: TBlCommunityTags[];
  onClick: (TagId: number) => void;
}) {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const generated = CommunityTags.map(
      () => colorClasses[Math.floor(Math.random() * colorClasses.length)]
    );
    setColors(generated);
  }, [CommunityTags]);

  return (
    <div className="grid grid-cols-2 mt-40 bg-slate-50 p-4 rounded shadow gap-2">
      {CommunityTags.map((tag, index) => (
        <button
          key={tag.TagId}
          className={`${
            colors[index] || "bg-gray-300"
          } border m-1 p-1 rounded-md shadow-sm font-bold text-sm font-sans cursor-pointer
          `}
          onClick={() => onClick(Number(tag.TagId))}
        >
          {tag.TagName}
        </button>
      ))}
    </div>
  );
}

export default QuestionPage;
