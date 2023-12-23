import { ChangeEvent, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { useMediaQuery } from "@mui/material";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Link from "@mui/joy/Link";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

import { PollService } from "../services/poll";
import { PollData, PollOption } from "../../../types";

import "./poll.css";

type PollComponentProps = {
  poll?: Partial<PollData>;
  isReadOnly?: boolean;
  showResults?: boolean;
  showResultsLink?: boolean;
};

const PollComponent = (props: PollComponentProps) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isVotingDisabled, setVotingDisabled] = useState(true);
  const [isVotingSubmitting, setVotingSubmitting] = useState(false);
  const poll = props.poll;

  const pickOption = (ev: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(ev && ev.target ? ev.target.value : "");
    setVotingDisabled(false);
  };

  const submitVote = () => {
    if (!poll || !poll.Id || !selectedOption) {
      return;
    }
    setVotingSubmitting(true);
    PollService.Vote(poll.Id, selectedOption)
      .then(() => {
        window.location.pathname = `/poll/${props.poll?.Id}/results`;
      });
  };

  const stackOptions = useMediaQuery("(max-width:600px)") || (poll && poll.Options ? poll.Options.length > 4 : false);
  const getOptionVotes = (id: string) => (poll && poll.Votes && poll.Votes[id] ? poll.Votes[id] : 0);
  return (
    <div className="poll">
      {!poll && (
        <Typography level="title-md" sx={{ my: 1 }}>
          Loading...
        </Typography>
      )}
      {poll && (
        <>
          <Typography level="h1" sx={{ my: 1 }}>{poll?.Question}</Typography>
          <Typography sx={{ mb: 2 }}>{poll?.Description}</Typography>
          <FormControl>
            <RadioGroup
              overlay
              name="member"
              defaultValue="person1"
              orientation={stackOptions ? "vertical" : "horizontal"}
              sx={{ gap: 2 }}
            >
              {poll?.Options?.map((option: PollOption) => (
                <Sheet
                  component="label"
                  key={option.Id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: "sm",
                    borderRadius: "md",
                  }}
                >
                  {props.showResults && option.Id && (
                    <Typography level="title-md" sx={{ mb: 2 }}>
                      {getOptionVotes(option.Id)} votes
                    </Typography>
                  )}
                  {option.ImageUrl && (
                    <Box sx={{ m: "auto", maxWidth: "80%" }}>
                      <img
                        src={option.ImageUrl}
                        alt={option.Text}
                        width="100%"
                        style={{ maxHeight: "240px" }}
                      />
                    </Box>
                  )}
                  <Typography level="title-md" sx={{ mt: 1 }}>
                    {option.Text}
                  </Typography>
                  {!props.showResults && (
                    <Radio
                      value={option.Id}
                      onChange={pickOption}
                      variant="outlined"
                      sx={{
                        mt: 2,
                      }}
                    />
                  )}
                </Sheet>
              ))}
            </RadioGroup>
          </FormControl>
          {!props.isReadOnly && (
            <FormControl sx={{ my: 2 }}>
              <Button onClick={submitVote} disabled={isVotingDisabled} loading={isVotingSubmitting}>
                Submit Vote
              </Button>
            </FormControl>
          )}
          {props.showResultsLink && (
            <Typography textColor="primary.300" sx={{ my: 2 }}>
              <Link to={`/poll/${poll?.Id}/results`} component={RouterLink}>See the Results</Link>
            </Typography>
          )}
        </>
      )}
    </div>
  );
};

export default PollComponent;
