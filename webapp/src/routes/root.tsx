import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import React from "react";

import { Poll } from "../types";
import PollComponent from "../components/poll";
import PollEditor from "../components/poll-editor";
import { PollService } from "../services/poll";

export default function Root() {
  const [poll, setPoll] = React.useState<Partial<Poll>>();
  const [isPreview, setPreview] = React.useState<boolean>(false);

  const onPreviewClick = (poll: Partial<Poll>) => {
    setPoll(poll);
    setPreview(true);
  };

  const onSaveClick = () => {
    if (!poll) return;
    PollService.Create(poll)
      .then((savedPoll: Poll) => {
        window.location.pathname = `/poll/${savedPoll.Id}`;
      });
  };

  return (
    <>
      {!isPreview && (
        <>
          <h1>Would you like to create a poll?</h1>
          <PollEditor poll={poll} onPreviewClick={onPreviewClick} />
        </>
      )}
      {isPreview && poll && (
        <>
          <h4>Previewing your poll...</h4>
          <PollComponent poll={poll} isReadOnly={true} />
          <FormControl>
            <Button onClick={() => setPreview(false)}>Edit</Button>
          </FormControl>
          <FormControl>
            <Button onClick={onSaveClick}>Save</Button>
          </FormControl>
        </>
      )}
    </>
  );
}
