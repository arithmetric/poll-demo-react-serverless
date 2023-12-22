import { PollData } from "../../../types";
import { PollService } from "../services/poll";

export interface LoaderData {
  poll?: PollData;
  pollFetched?: Date;
}

export async function loader({ params }: { params: { [key: string]: string | undefined }}) {
  const poll = params.pollId ? await PollService.Get(params.pollId) : null;
  return { poll, pollFetched: new Date() };
}
