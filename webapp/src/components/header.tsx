import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const HeaderComponent = () => {
  return (
    <Sheet variant="soft" sx={{ p: 2, mb: 2 }}>
      <Accordion>
        <AccordionSummary><InfoOutlinedIcon/> This is a simple poll app built with React on an AWS serverless stack.</AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ my: 1 }}>You can create a poll, share it with others to vote on, and track the results. Polls can only be found by the URL generated when they are created. Users are not prevented from voting multiple times on a poll.</Typography>
          <Typography sx={{ mb: 1 }}>For technical information and the source code, see the <a href="https://github.com/arithmetric/poll-demo-react-serverless" target="_blank">poll-demo-react-serverless</a> repository on GitHub.</Typography>
        </AccordionDetails>
      </Accordion>
    </Sheet>
  );
};

export default HeaderComponent;
