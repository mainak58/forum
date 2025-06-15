"use client";
import toastNotify from "@/helper/toastNotify";
import ApiResponse from "@/interface/common/ApiResponse";
import {TblCommunity} from "@/interface/database";
import Link from "next/link";
import {useEffect, useState} from "react";

type Props = {
  data: ApiResponse;
  userId: string;
};

function CommunityCard({data, userId}: Props) {
  const [communities, setCommunities] = useState<TblCommunity[]>([]);

  useEffect(() => {
    if (data.isSuccess && data.result) {
      try {
        const parsed = JSON.parse(data.result);
        setCommunities(parsed);
      } catch (err) {
        console.error("Failed to parse data.result", err);
      }
    } else {
      console.log("data", data);
      toastNotify(data.errorMessages?.join(", ") ?? "", "error");
    }
  }, [data]);

  return (
    <div className="flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-3xl space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Your Communities
        </h2>

        <div className="flex flex-col gap-4">
          {communities.length > 0 ? (
            communities.map((d) => (
              <Link
                href={`/question/${userId}/${d.CommunityId}`}
                key={d.CommunityId}
              >
                <div className="border border-gray-300 hover:border-green-500 px-6 py-4 rounded-lg transition duration-200 hover:bg-green-50 cursor-pointer">
                  <p className="text-xl font-semibold text-gray-800">
                    {d.CommunityName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Created on:</span>{" "}
                    {d.CreatedOn}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg">
              You have no community to show.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityCard;
