export interface Campaign {
  id: number;
  title: string;
  description: string;
  category: string;
  target_amount: number;
  raised_amount: number;
  location: string;
  urgency: 'Normal' | 'High' | 'Critical';
  status: 'active' | 'completed' | 'paused';
  beneficiaries_count: number;
  end_date: string;
  image_url: string;
  created_at: string;
  donation_count?: number;
  volunteer_count?: number;
  task_count?: number;
}

export interface Donation {
  id: number;
  campaign_id: number;
  donor_name: string;
  donor_email: string;
  amount: number;
  payment_method: string;
  message?: string;
  is_anonymous: boolean;
  transaction_id: string;
  created_at: string;
  campaign_title?: string;
}

export interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string;
  availability: string;
  campaign_id?: number | null;
  status: string;
  created_at: string;
  campaign_title?: string;
}

export interface Task {
  id: number;
  campaign_id: number;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'todo' | 'in_progress' | 'completed';
  assigned_to?: number | null;
  due_date?: string | null;
  created_at: string;
  campaign_title?: string;
  volunteer_name?: string;
  volunteer_email?: string;
  volunteer_phone?: string;
}

export interface PlatformStats {
  total_raised: number;
  total_target: number;
  total_campaigns: number;
  total_volunteers: number;
  total_donations: number;
  completed_tasks: number;
  total_tasks: number;
}
