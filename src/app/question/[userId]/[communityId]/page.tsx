import QuestionPage from "@/components/page/question/QuestionPage";
import Server from "@/helper/Server";

type Props = {
  params: {
    userId: string;
    communityId: number;
  };
};

async function page({params}: Props) {
  const {userId, communityId} = await params;

  const forumApi = new Server({
    spName: "spCommunityForumAnonymous",
    mode: 3,
  });
  const forumJson = await forumApi.request({
    UserId: userId,
    CommunityId: communityId,
  });

  const communityTag = JSON.parse(forumJson.result)[0].CommunityTags;
  const communityName = JSON.parse(forumJson.result)[0].CommunityName;

  return (
    <>
      <div className="flex justify-center items-center">
        <QuestionPage
          userId={userId}
          communityId={communityId}
          communityName={communityName}
          CommunityTags={communityTag}
        />
      </div>
    </>
  );
}

export default page;
