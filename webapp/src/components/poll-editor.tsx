import { ChangeEvent, FormEvent, useState } from "react";

import Alert from "@mui/joy/Alert";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { PollData, PollOption } from "../../../types";

import "./poll.css";

type PollEditorComponentProps = {
  poll?: Partial<PollData>;
  onPreviewClick?: (poll: Partial<PollData>) => void;
};

const PollEditorComponent = (props: PollEditorComponentProps) => {
  const [question, setQuestion] = useState(props?.poll?.Question);
  const [description, setDescription] = useState(props?.poll?.Description);
  const [options, setOptions] = useState<PollOption[]>(props?.poll?.Options || [{ Id: window.crypto.randomUUID() }, { Id: window.crypto.randomUUID() }]);
  const [showError, setShowError] = useState("");

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
    setShowError("");
  };

  const preview = (e: FormEvent) => {
    e.preventDefault();
    if (options.length < 2) {
      setShowError("The poll should have at least two options.");
      return;
    }
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
        <form onSubmit={preview}>
          <FormControl sx={{ my: 2 }}>
            <FormLabel>Question *</FormLabel>
            <Input
              variant="outlined"
              value={question}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
              required
            />
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Description</FormLabel>
            <Textarea
              minRows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          {options.map((option, index) => (
            <Card
              variant="outlined"
              key={option.Id}
              sx={{
                maxHeight: "max-content",
                maxWidth: "100%",
                mx: "auto",
                my: 2,
                overflow: "auto",
                resize: "horizontal",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography level="title-md" sx={{ mr: "auto" }}>
                  Option #{index + 1}
                </Typography>
                <Button
                  variant="soft"
                  endDecorator={<DeleteIcon />}
                  onClick={() => removeOption(option.Id)}
                  color="danger"
                  size="sm"
                  sx={{ ml: "auto" }}
                >
                  Remove
                </Button>
              </Box>
              <CardContent
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
                  gap: 1.5,
                }}
              >
                <FormControl sx={{ gridColumn: "1/-1" }}>
                  <FormLabel>Answer *</FormLabel>
                  <Input
                    value={option.Text}
                    required
                    onChange={(e) => setOption(option.Id, { Text: e.target.value })}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "1/-1" }}>
                  <FormLabel>Answer Image URL</FormLabel>
                  <Input
                    value={option.ImageUrl}
                    onChange={(e) => setOption(option.Id, { ImageUrl: e.target.value })}
                  />
                </FormControl>
              </CardContent>
            </Card>
          ))}
          {showError && (
            <Alert variant="soft" color="danger">
              {showError}
            </Alert>
          )}
          <FormControl sx={{ my: 2 }}>
            <Button onClick={addOption} variant="soft" startDecorator={<AddIcon />}>Add Option</Button>
          </FormControl>
          <FormControl sx={{ my: 2 }}>
            <Button type="submit">Preview</Button>
          </FormControl>
        </form>
      </Sheet>
    </div>
  );
};

export default PollEditorComponent;
