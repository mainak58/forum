import Link from "next/link";

export default function Home() {
  const userId = "efc464bb-4a27-4a73-ab7e-9a0f832f754f";
  // const userId = "efc464bb-4a27-4a73-ab7e-9a0f832f754f-20";
  // const userId = "";

  return (
    <>
      <Link href={`/forum/${userId}`}>Forum</Link>
      {/* <AnswerPage /> */}
    </>
  );
}
