import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useLoaderData, useRevalidator } from "react-router-dom";

import { LoaderData } from "../loaders/poll";
import Poll from "../components/poll";

export default function PollResultsPage() {
  const { poll, pollFetched } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();

  const refreshVotes = () => {
    revalidator.revalidate();
  };

  return (
    <>
      <main>
        {poll && (
          <>
            <Poll poll={poll} showResults={true} isReadOnly={true} />
            {poll?.DateLastVote && (
              <Typography level="body-sm" sx={{ mt: 1 }}>
                Last Vote Cast: {(new Date(poll.DateLastVote)).toLocaleString()}
              </Typography>
            )}
            {pollFetched && (
              <Typography level="body-sm" sx={{ mt: 1 }}>
                Results As Of: {(new Date(pollFetched)).toLocaleString()}
                <Button onClick={refreshVotes}>Refresh</Button>
              </Typography>
            )}
          </>
        )}
      </main>
    </>
  );
}
