import {UserRegisterDTO} from "@/interface/database";
import {TBlCommunityTags} from "@/interface/database/TBlCommunityTags";
import Image from "next/image";
import {CiClock1} from "react-icons/ci";
import {FaReply} from "react-icons/fa";
import {FiUsers} from "react-icons/fi";
import {SlCalender} from "react-icons/sl";

type Props = {
  createdUser: UserRegisterDTO;
  createdOn: string;
  replies: number;
  questionTags: TBlCommunityTags[];
};

function AnswerHelper(prop: Props) {
  return (
    <div className="w-full max-w-sm mx-auto bg-white border border-gray-100 rounded-lg shadow-sm p-6">
      {/* Stats */}
      <div className="flex flex-wrap justify-between gap-y-4 mb-6">
        <div className="flex items-center gap-2">
          <FaReply className="w-4 h-4 text-gray-400" />
          <span className="text-[16px] text-gray-600 font-medium">
            {prop.replies ?? 0} Replies
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiUsers className="w-4 h-4 text-gray-400" />
          <span className="text-[16px] text-gray-600 font-medium">
            5 Participants
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-300 mb-6" />

      <div className="mb-6">
        <p className="text-gray-800 text-md font-semibold mb-3">
          Want to subscribe?
        </p>
        <button className="bg-[#0073dc] text-white font-semibold rounded-lg py-2 px-5 mt-2">
          Sign In
        </button>
      </div>

      <div className="h-px bg-gray-300 mb-6" />

      {/* CREATED BY — unchanged as requested */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-3 font-semibold">CREATED BY</p>
        <div className="flex items-center gap-3">
          <Image
            width={24}
            height={24}
            src={
              prop.createdUser.ProfileImageDocumentUrl ??
              "https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png"
            }
            alt="User Icon"
            className="rounded-full"
          />
          <span className="text-sm text-gray-800 font-medium">
            {prop.createdUser.FullName}
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-300 mb-6" />

      {/* Info Details */}
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Platform</span>
          <span className="text-blue-800 font-medium">ReactJS</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Control</span>
          <span className="text-blue-800 font-medium">
            {prop.questionTags.map((m) => m.TagName).join(", ") || "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <SlCalender className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 font-medium">Created</span>
          </div>
          <span className="text-gray-800 font-medium">{prop.createdOn}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <CiClock1 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 font-medium">Last Activity</span>
          </div>
          <span className="text-gray-800 font-medium">Feb 10, 2025</span>
        </div>
      </div>
    </div>
  );
}

export default AnswerHelper;
