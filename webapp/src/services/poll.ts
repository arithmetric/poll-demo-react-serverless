import { PollData } from "../../../types";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

export class PollService {
  static async Get(pollId: string): Promise<PollData> {
    const url = `${API_BASE_URL}/poll/${pollId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  static async Create(poll: Partial<PollData>): Promise<PollData> {
    const response = await fetch(`${API_BASE_URL}/poll`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(poll),
    });
    const data = await response.json();
    return data;
  }

  static async Vote(pollId: string, optionId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/poll/${pollId}/vote`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        OptionId: optionId,
      }),
    });
    const data = await response.json();
    return data && data.status && data.status === "ok";
  }
}
