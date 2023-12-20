import React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";

import Delete from "@mui/icons-material/Delete";

import { PollData, PollOption } from "../../../types";
import "./poll.css";

type PollEditorComponentProps = {
  poll?: Partial<PollData>;
  onPreviewClick?: (poll: Partial<PollData>) => void;
};

const PollEditorComponent = (props: PollEditorComponentProps) => {
  const [question, setQuestion] = React.useState(props?.poll?.Question);
  const [description, setDescription] = React.useState(props?.poll?.Description);
  const [options, setOptions] = React.useState<PollOption[]>(props?.poll?.Options || [{ Id: window.crypto.randomUUID() }, { Id: window.crypto.randomUUID() }]);

  const setOption = (id: string, option: Partial<PollOption>) => {
    setOptions((options) => {
      const editingOption = options.find((o) => o.Id === id);
      if (editingOption) {
        if (option.Text) editingOption.Text = option.Text;
        if (option.ImageUrl) editingOption.ImageUrl = option.ImageUrl;
      }
      return options;
    });
  };

  const removeOption = (id: string) => {
    setOptions((options) => {
      return options.filter((o) => o.Id !== id);
    });
  };

  const addOption = () => {
    setOptions((options) => [...options, { Id: window.crypto.randomUUID() }]);
  };

  const preview = () => {
    const poll: Partial<PollData> = {
      Question: question,
      Description: description,
      Options: options,
    };
    if (props?.onPreviewClick) props.onPreviewClick(poll);
  };

  return (
    <div className="poll-editor">
      <Sheet>
        <FormControl>
          <FormLabel>Question *</FormLabel>
          <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea minRows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormControl>
        {options.map((option, index) => (
          <Card
            variant="outlined"
            key={option.Id}
            sx={{
              maxHeight: "max-content",
              maxWidth: "100%",
              mx: "auto",
              overflow: "auto",
              resize: "horizontal",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography level="title-lg" sx={{ mr: "auto" }}>
                Option #{index + 1}
              </Typography>
              <IconButton variant="soft" color="danger" sx={{ ml: "auto" }}>
                <Delete onClick={() => removeOption(option.Id)} />
              </IconButton>
            </Box>
            <Divider inset="none" />
            <CardContent
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
                gap: 1.5,
              }}
            >
              <FormControl sx={{ gridColumn: "1/-1" }}>
                <FormLabel>Answer *</FormLabel>
                <Input value={option.Text} onChange={(e) => setOption(option.Id, { Text: e.target.value })} />
              </FormControl>
              <FormControl sx={{ gridColumn: "1/-1" }}>
                <FormLabel>Answer Image URL</FormLabel>
                <Input value={option.ImageUrl} onChange={(e) => setOption(option.Id, { ImageUrl: e.target.value })} />
              </FormControl>
            </CardContent>
          </Card>          
        ))}
        <FormControl>
          <Button onClick={addOption}>Add Option</Button>
        </FormControl>
        <FormControl>
          <Button onClick={preview}>Preview</Button>
        </FormControl>
      </Sheet>
    </div>
  );
};

export default PollEditorComponent;
