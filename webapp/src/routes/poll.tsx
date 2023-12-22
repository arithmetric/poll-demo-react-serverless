import { useLoaderData } from "react-router-dom";

import Poll from "../components/poll";
import { LoaderData } from "../loaders/poll";

export default function PollPage() {
  const { poll } = useLoaderData() as LoaderData;

  return (
    <>
      <Poll poll={poll} showResultsLink={true} />
    </>
  );
}