import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Typography from "@mui/joy/Typography";
import { useState } from "react";

import PollComponent from "../components/poll";
import PollEditor from "../components/poll-editor";
import { PollService } from "../services/poll";
import { PollData } from "../../../types";

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
          <Typography level="h1" sx={{ mb: 2 }}>Create a Poll</Typography>
          <PollEditor poll={poll} onPreviewClick={onPreviewClick} />
        </>
      )}
      {isPreview && poll && (
        <>
          <Typography level="h2" sx={{ mb: 2 }}>Previewing Your Poll</Typography>
          <PollComponent poll={poll} isReadOnly={true} />
          <FormControl sx={{ my: 1 }}>
            <Button variant="soft" onClick={() => setPreview(false)}>Edit</Button>
          </FormControl>
          <FormControl sx={{ my: 1 }}>
            <Button onClick={onSaveClick}>Save</Button>
          </FormControl>
        </>
      )}
    </>
  );
}
