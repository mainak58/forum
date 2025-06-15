import Footer from "@/components/common/Footer";
import CommunityCard from "@/components/page/forum/CommunityCard";
import Server from "@/helper/Server";
import ApiResponse from "@/interface/common/ApiResponse";
import Link from "next/link";
import {Suspense} from "react";

type Props = {
  params: {
    userId: string;
  };
};

// const ForumComponent = React.lazy(
//   () => import("../../../components/ForumComponent")
// );

export default async function Page({params}: Props) {
  const {userId} = await params;
  const server = new Server({spName: "spCommunityForumAnonymous", mode: 1});
  const json: ApiResponse = await server.request({
    CommunityUserId: userId,
  });

  console.log(json);

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white shadow-lg font-sans">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-3xl font-black tracking-tight">ForumHub</div>

          <div className="hidden md:flex space-x-6 text-lg font-medium">
            <Link href="/">
              <p className="hover:bg-indigo-800 px-4 py-2 rounded-lg transition duration-200 ease-in-out">
                Home
              </p>
            </Link>
            <Link href={`/forum/${userId}`}>
              <p className="hover:bg-indigo-800 px-4 py-2 rounded-lg transition duration-200 ease-in-out">
                forum
              </p>
            </Link>
            <Link href="/trending">
              <p className="hover:bg-indigo-800 px-4 py-2 rounded-lg transition duration-200 ease-in-out">
                Trending
              </p>
            </Link>
            <Link href="/new-post">
              <p className="hover:bg-indigo-800 px-4 py-2 rounded-lg transition duration-200 ease-in-out">
                New Post
              </p>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="hidden md:block px-4 py-2 rounded-lg text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />

            <div className="bg-white text-indigo-700 font-bold text-lg px-4 py-2 rounded-full cursor-pointer">
              U
            </div>
          </div>
        </div>
      </nav>

      <div className="m-4 p-2">
        <Suspense
          fallback={
            <div className="text-center py-4 text-gray-600">
              Loading forum...
            </div>
          }
        >
          <CommunityCard data={json} userId={userId} />
        </Suspense>
      </div>

      <Footer />
    </>
  );
}
