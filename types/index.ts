export interface Appointment {
  id?: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'scheduled' | 'completed' | 'no-show' | 'arrived-late' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id?: string;
  appointmentId?: string;
  clientId?: string;
  clientName?: string;
  amount: number;
  method: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer';
  description: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  tags?: string[];
  loyaltyPoints?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id?: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Staff {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff';
  specialties?: string[];
  schedule?: WorkingHours;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkingHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  start: string;
  end: string;
  breaks?: Break[];
}

export interface Break {
  start: string;
  end: string;
}

export interface BlockedTime {
  id?: string;
  startTime: string;
  endTime: string;
  reason?: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  isAllDay: boolean;
  createdAt?: string;
  updatedAt?: string;
}