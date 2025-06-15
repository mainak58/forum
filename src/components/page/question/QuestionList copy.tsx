"use client";
import {apiErrorToast} from "@/helper/apiErrorToast";
import Server from "@/helper/Server";
import {TblQuestion} from "@/interface/database";
import Link from "next/link";
import {BiDislike, BiLike, BiSolidDislike, BiSolidLike} from "react-icons/bi";
import {FaReply} from "react-icons/fa";

type Props = {
  data: TblQuestion[];
  userId: string;
  communityId: number;
  refetch: () => void;
};

function QuestionList(props: Props) {
  const {userId, communityId} = props;

  console.log(props.data);

  const likeDislikeApi = new Server({
    spName: "spCommunityForumAnonymous",
    mode: 4,
  });

  async function toggleLikeDislike(q: TblQuestion, type: "like" | "dislike") {
    const likeJson = await likeDislikeApi.request({
      CommunityUserId: userId,
      CQId: q.CQId,
      IsLiked:
        (q.IsLiked && type === "like") || type === "dislike" ? false : true,
      IsDisLiked:
        (q.IsDisLiked && type === "dislike") || type === "like" ? false : true,
    });

    if (likeJson.isSuccess) props.refetch();
    else apiErrorToast(likeJson);
  }

  return (
    <>
      {props.data.map((q) => (
        <div
          className="flex flex-col gap-4 w-[850px] p-4 font-sans border-none border-gray-400 rounded-lg shadow-sm transition hover:shadow-md"
          key={q.CQId}
        >
          <p className="text-lg sm:text-xl font-semibold text-blue-700 leading-relaxed break-words hover:underline">
            <Link href={`/answer/${userId}/${communityId}/${q.CQId}`}>
              {q.QuestionText}
            </Link>
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base text-gray-600">
            <div className="flex items-center gap-2 min-w-0">
              <img
                width={24}
                height={24}
                src={
                  q?.CreatedUser?.[0]?.ProfileImageDocumentUrl ||
                  "https://ui-avatars.com/api/?name=Moinak+Kajumdar&background=random"
                }
                alt="User Icon"
                className="rounded-full w-6 h-6 object-cover"
              />
              <span className="text-gray-800 font-medium truncate">
                {q?.CreatedUser?.[0]?.FullName}
              </span>
            </div>

            <span className="flex items-center gap-1">
              <span className="whitespace-nowrap font-medium text-gray-500">
                Created:
              </span>
              <span>{q?.CreatedOn}</span>
            </span>

            {!!q.LastReplied && (
              <span className="flex items-center gap-1">
                <span className="whitespace-nowrap font-medium text-gray-500">
                  Last Replied:
                </span>
                <span>{q?.LastReplied}</span>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3 text-blue-600">
              <button className="flex items-center gap-1 hover:text-blue-800 transition">
                <FaReply className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium">
                  {q?.NoOfReplies} Replies
                </span>
              </button>

              <button onClick={() => toggleLikeDislike(q, "like")}>
                {q.IsLiked ? <BiSolidLike /> : <BiLike />}
              </button>
              {<p>{q.LikeCount}</p>}

              <button onClick={() => toggleLikeDislike(q, "dislike")}>
                {q.IsDisLiked ? <BiSolidDislike /> : <BiDislike />}
              </button>
              {<p>{q.DisLikeCount}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              {q.QuestionTags?.map((tag) => (
                <button
                  key={tag.TagId}
                  className="border border-green-500 text-green-600 px-2 py-1 rounded-md text-xs sm:text-sm hover:bg-green-100 transition"
                >
                  {tag.TagName}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default QuestionList;
