import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Typography from "@mui/joy/Typography";

import PollComponent from "../components/poll";
import PollEditor from "../components/poll-editor";
import { PollService } from "../services/poll";
import { PollData } from "../../../types";

export default function Root() {
  const [poll, setPoll] = useState<Partial<PollData>>();
  const [isPreview, setPreview] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const navigate = useNavigate();

  const onPreviewClick = (poll: Partial<PollData>) => {
    setPoll(poll);
    setPreview(true);
  };

  const onSaveClick = () => {
    if (!poll) return;
    setSaving(true);
    PollService.Create(poll)
      .then((savedPoll: PollData) => {
        navigate(`/poll/${savedPoll.Id}`);
      })
      .catch((err) => {
        console.error("Root:onSaveClick encountered error:", err);
        setSaving(false);
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
            <Button variant="soft" onClick={() => setPreview(false)} disabled={isSaving}>Edit</Button>
          </FormControl>
          <FormControl sx={{ my: 1 }}>
            <Button onClick={onSaveClick} loading={isSaving}>Save</Button>
          </FormControl>
        </>
      )}
    </>
  );
}
