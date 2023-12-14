import React from "react";
import { useLoaderData } from "react-router-dom";

import { LoaderData } from "../loaders/poll";
import Poll from "../components/poll";

export default function PollResultsPage() {
  const { poll } = useLoaderData() as LoaderData;

  return (
    <>
      <main>
        {poll && (
          <Poll poll={poll} showResults={true} isReadOnly={true} />
        )}
      </main>
    </>
  );
}
