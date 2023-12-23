import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import { Link as RouterLink, useRouteError } from "react-router-dom";

import WarningIcon from "@mui/icons-material/Warning";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <Card variant="solid">
        <CardContent>
          <Typography level="title-lg" textColor="inherit">
            <WarningIcon sx={{ verticalAlign: "bottom" }} /> Something went wrong.<br/>
          </Typography>
          <Typography textColor="primary.300" sx={{ mt: 1 }}><Link to={"/"} component={RouterLink} textColor="inherit">Create a new poll</Link></Typography>
        </CardContent>
      </Card>
    </div>
  );
}