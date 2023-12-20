import React, { ChangeEvent, Component } from "react";
import { Link } from "react-router-dom";

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

type PollComponentState = {
  selectedOption?: string;
  isVotingDisabled?: boolean;
  isVotingSubmitting?: boolean;
}

class PollComponent extends Component<PollComponentProps, PollComponentState> {
  constructor(props: PollComponentProps) {
    super(props);
    this.state = {
      isVotingDisabled: true,
      isVotingSubmitting: false,
    };
    this.pickOption = this.pickOption.bind(this);
    this.submitVote = this.submitVote.bind(this);
  }

  pickOption(ev: ChangeEvent<HTMLInputElement>) {
    this.setState({
      selectedOption: ev && ev.target ? ev.target.value : undefined,
      isVotingDisabled: false,
    });
  }

  submitVote() {
    if (!this.props.poll || !this.props.poll.Id || !this.state.selectedOption) {
      return;
    }
    this.setState({ isVotingSubmitting: true });
    PollService.Vote(this.props.poll?.Id, this.state.selectedOption)
      .then(() => {
        setTimeout(() => {
          window.location.pathname = `/poll/${this.props.poll?.Id}/results`;
        }, 3000);
      });
  }

  render() {
    const poll = this.props.poll;
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
                orientation="horizontal"
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
                    {this.props.showResults && option.Id && (
                      <h4>{getOptionVotes(option.Id)} votes</h4>
                    )}
                    {!this.props.showResults && (
                      <Radio
                        value={option.Id}
                        onChange={this.pickOption}
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
            {this.props.showResults && poll.DateLastVote && (
              <Typography level="body-sm" sx={{ mt: 1 }}>
                Last Vote Cast: {(new Date(poll.DateLastVote)).toLocaleString()}
              </Typography>
            )}
            {!this.props.isReadOnly && (
              <FormControl>
                <Button onClick={this.submitVote} disabled={this.state.isVotingDisabled} loading={this.state.isVotingSubmitting}>
                  Submit Vote
                </Button>
              </FormControl>
            )}
            {this.props.showResultsLink && (
              <Link to={`/poll/${poll?.Id}/results`}>See the results</Link>
            )}
          </>
        )}
      </div>
    );
  }
}

export default PollComponent;
