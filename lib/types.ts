export type StudyMode = "online" | "offline" | "both";

export type TimeSlot = "morning" | "afternoon" | "evening" | "weekend";

export const TIME_SLOTS: TimeSlot[] = ["morning", "afternoon", "evening", "weekend"];

export interface Profile {
  id: string;
  name: string;
  school: string | null;
  major: string | null;
  subjects: string[] | null;
  study_goals: string | null;
  available_time: string[] | null;
  study_mode: StudyMode | null;
  city: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export type ConnectionStatus = "pending" | "accepted" | "declined";

export interface Connection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: ConnectionStatus;
  created_at: string;
  requester?: Profile;
  receiver?: Profile;
}

export interface Message {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  read?: boolean;
  created_at: string;
}

export interface StudySession {
  id: string;
  connection_id: string;
  creator_id: string;
  title: string;
  subject: string | null;
  scheduled_at: string;
  duration_minutes: number;
  mode: "online" | "offline";
  location: string | null;
  notes: string | null;
  status: "scheduled" | "cancelled";
  created_at: string;
  connection?: Connection;
}

/** Trang thai ket noi giua minh va mot profile khac */
export type LinkState = "none" | "pending_out" | "pending_in" | "accepted";
