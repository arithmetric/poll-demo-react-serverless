import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import Skeleton from "@mui/joy/Skeleton";
import Typography from "@mui/joy/Typography";

import "./poll.css";

const PollSkeletonComponent = () => {
  return (
    <div className="poll">
      <Typography level="h1" sx={{ my: 1 }}>
        <Skeleton>
          This is the poll question
        </Skeleton>
      </Typography>
      <Typography sx={{ mb: 2 }}>
        <Skeleton>
          This is the poll description.
        </Skeleton>
      </Typography>
      <FormControl>
        <RadioGroup
          overlay
          name="member"
          defaultValue=""
          orientation="horizontal"
          sx={{ gap: 2 }}
        >
          {[1, 2, 3].map((idx) => (
            <Sheet
              component="label"
              key={idx}
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
              <Box sx={{ m: "auto", maxWidth: "80%" }}>
                  <img
                    src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                    width="100%"
                    style={{ maxHeight: "240px" }}
                  />
              </Box>
              <Typography level="title-md" sx={{ mt: 1 }}>
                <Skeleton>
                  This is the option text
                </Skeleton>
              </Typography>
            </Sheet>
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default PollSkeletonComponent;
