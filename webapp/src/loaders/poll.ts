import { PollData } from "../../../types";
import { PollService } from "../services/poll";

export interface LoaderData {
  poll?: PollData;
}

export async function loader({ params }: { params: { [key: string]: string | undefined }}) {
  const poll = params.pollId ? await PollService.Get(params.pollId) : null;
  return { poll };
}
