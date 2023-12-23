import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import { Link as RouterLink, useLoaderData, useRevalidator } from "react-router-dom";

import RefreshIcon from "@mui/icons-material/Refresh";

import { LoaderData } from "../loaders/poll";
import Poll from "../components/poll";

dayjs.extend(calendar);

export default function PollResultsPage() {
  const { poll, pollFetched } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();

  const refreshVotes = () => {
    revalidator.revalidate();
  };

  return (
    <>
      {poll && (
        <>
          <Poll poll={poll} showResults={true} isReadOnly={true} />
          {poll?.DateLastVote && (
            <Box sx={{ mt: 1 }}>
              <Chip size="md" variant="soft">Last Vote Cast: {dayjs(poll.DateLastVote).calendar()}</Chip>
            </Box>
          )}
          {pollFetched && (
            <Box sx={{ mt: 1 }}>
              <Chip
                variant="soft"
                size="md"
                endDecorator={<RefreshIcon fontSize="medium" />}
                onClick={refreshVotes}
              >
                Last Fetched: {dayjs(pollFetched).calendar()}
              </Chip>
            </Box>
          )}
          <Typography textColor="primary.500" sx={{ mt: 1 }}><Link to={"/"} component={RouterLink} textColor="inherit">Create a Poll</Link></Typography>
        </>
      )}
    </>
  );
}
