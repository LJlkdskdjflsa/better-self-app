export interface Company {
  id: number;
  company: string;
  domain: string | null;
  logo: string;
  location_lat: number | null;
  location_lon: number | null;
  location_address: string | null;
  description: string | null;
  employees_number: number | null;
  phone_number: string | null;
}
