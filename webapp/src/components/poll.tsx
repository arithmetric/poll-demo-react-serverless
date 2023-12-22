import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";

import { useMediaQuery } from "@mui/material";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
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

  const pickOption = (ev: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(ev && ev.target ? ev.target.value : "");
    setVotingDisabled(false);
  };

  const submitVote = () => {
    if (!props?.poll || !props?.poll.Id || !selectedOption) {
      return;
    }
    setVotingSubmitting(true);
    PollService.Vote(props.poll?.Id, selectedOption)
      .then(() => {
        window.location.pathname = `/poll/${props.poll?.Id}/results`;
      });
  };

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const poll = props.poll;
  const getOptionVotes = (id: string) => (poll && poll.Votes && poll.Votes[id] ? poll.Votes[id] : 0);
  return (
    <div className="poll">
      {!poll && (
        <div>Loading...</div>
      )}
      {poll && (
        <>
          <h1>{poll?.Question}</h1>
          <div>{poll?.Description}</div>
          <FormControl>
            <RadioGroup
              overlay
              name="member"
              defaultValue="person1"
              orientation={isSmallScreen ? 'vertical' : 'horizontal'}
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
                    width: "100%",
                  }}
                >
                  {props.showResults && option.Id && (
                    <h4>{getOptionVotes(option.Id)} votes</h4>
                  )}
                  {!props.showResults && (
                    <Radio
                      value={option.Id}
                      onChange={pickOption}
                      variant="soft"
                      sx={{
                        mb: 2,
                      }}
                    />
                  )}
                  {option.ImageUrl && (
                    <Box sx={{ m: "auto" }}>
                      <img
                        src={option.ImageUrl}
                        alt={option.Text}
                        width="100%"
                      />
                    </Box>
                  )}
                  <Typography level="body-md" sx={{ mt: 1 }}>
                    {option.Text}
                  </Typography>
                </Sheet>
              ))}
            </RadioGroup>
          </FormControl>
          {!props.isReadOnly && (
            <FormControl>
              <Button onClick={submitVote} disabled={isVotingDisabled} loading={isVotingSubmitting}>
                Submit Vote
              </Button>
            </FormControl>
          )}
          {props.showResultsLink && (
            <Link to={`/poll/${poll?.Id}/results`}>See the results</Link>
          )}
        </>
      )}
    </div>
  );
};

export default PollComponent;
