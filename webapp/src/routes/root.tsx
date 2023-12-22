import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import { useState } from "react";

import { PollData } from "../../../types";
import PollComponent from "../components/poll";
import PollEditor from "../components/poll-editor";
import { PollService } from "../services/poll";

export default function Root() {
  const [poll, setPoll] = useState<Partial<PollData>>();
  const [isPreview, setPreview] = useState<boolean>(false);

  const onPreviewClick = (poll: Partial<PollData>) => {
    setPoll(poll);
    setPreview(true);
  };

  const onSaveClick = () => {
    if (!poll) return;
    PollService.Create(poll)
      .then((savedPoll: PollData) => {
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
