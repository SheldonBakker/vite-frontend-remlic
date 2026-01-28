export interface IDriver {
  id: string;
  profile_id: string;
  surname: string;
  initials: string;
  id_number: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}

export interface ICreateDriverRequest {
  surname: string;
  initials: string;
  id_number: string;
  expiry_date: string;
}

export interface IUpdateDriverRequest {
  surname?: string;
  initials?: string;
  id_number?: string;
  expiry_date?: string;
}

export interface IGetDriversParams {
  cursor?: string;
  limit?: number;
  sortBy?: 'surname' | 'expiry_date' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  surname?: string;
  id_number?: string;
}
