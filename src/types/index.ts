export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export type EmailFolder = 'incoming' | 'outreach' | 'on_the_way' | 'delivered' | 'betrayed' | 'specific';

export interface Email {
  id: string;
  user_id: string;
  from_email: string;
  to_email: string;
  subject: string;
  body: string;
  folder: EmailFolder;
  is_read: boolean;
  has_attachment: boolean;
  created_at: string;
}

export interface VoiceMail {
  id: string;
  user_id: string;
  title: string;
  duration: number;
  audio_url: string | null;
  audio_blob?: Blob;
  is_played: boolean;
  pin_protected: boolean;
  pin_code?: string;
  created_at: string;
}

export interface AdminConfig {
  resend_api_key?: string;
  supabase_url?: string;
  supabase_anon_key?: string;
  supabase_service_role_key?: string;
  cloudflare_zone_id?: string;
  cloudflare_api_key?: string;
  email_domain?: string;
}

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export const FOLDER_LABELS: Record<EmailFolder, string> = {
  incoming: 'Incoming',
  outreach: 'Outreach',
  on_the_way: 'On_the_Way',
  delivered: 'Delivered',
  betrayed: 'Betrayed',
  specific: 'Specific',
};

export const FOLDER_ICONS: Record<EmailFolder, string> = {
  incoming: 'inbox',
  outreach: 'send-horizontal',
  on_the_way: 'file-edit',
  delivered: 'check-circle',
  betrayed: 'alert-triangle',
  specific: 'star',
};
