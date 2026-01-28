import type { DeleteResponse, PaginationCursor, SortOrder, BaseQueryParams } from '../types/shared';
import { buildQueryString, buildUrl } from '../utils/queryBuilder';
import apiClient from './apiClient';

export async function getCertificates(params?: GetCertificatesParams): Promise<PaginatedCertificatesResponse> {
  const queryString = buildQueryString(params, {
    certificate_number: params?.certificate_number,
    sort_by: params?.sort_by,
  });
  const url = buildUrl('/certificates', queryString);
  const response = await apiClient.get<PaginatedCertificatesResponse>(url);
  return response.data;
}

export async function getCertificateById(id: string): Promise<Certificate> {
  const response = await apiClient.get<CertificateResponse>(`/certificates/${id}`);
  return response.data.data.certificate;
}

export async function createCertificate(data: CreateCertificateRequest): Promise<Certificate> {
  const response = await apiClient.post<CertificateResponse>('/certificates', data);
  return response.data.data.certificate;
}

export async function deleteCertificate(id: string): Promise<string> {
  const response = await apiClient.delete<DeleteResponse>(`/certificates/${id}`);
  return response.data.data.message;
}

export async function updateCertificate(id: string, data: UpdateCertificateRequest): Promise<Certificate> {
  const response = await apiClient.patch<CertificateResponse>(`/certificates/${id}`, data);
  return response.data.data.certificate;
}

export interface Certificate {
  id: string;
  profile_id: string;
  type: string;
  first_name: string;
  last_name: string;
  certificate_number: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCertificateRequest {
  type: string;
  first_name: string;
  last_name: string;
  certificate_number: string;
  expiry_date: string;
}

export interface UpdateCertificateRequest {
  type?: string;
  first_name?: string;
  last_name?: string;
  certificate_number?: string;
  expiry_date?: string;
}

interface CertificateResponse {
  success: boolean;
  data: {
    certificate: Certificate;
  };
}

export interface PaginatedCertificatesResponse {
  success: boolean;
  data: {
    certificates: Certificate[];
  };
  pagination: {
    nextCursor: PaginationCursor | null;
  };
}

export type SortBy = 'expiry_date';

export interface GetCertificatesParams extends BaseQueryParams {
  certificate_number?: string;
  sort_by?: SortBy;
}

export type { SortOrder, PaginationCursor };
