export interface Company {
  id: string;
  name: string;
  legalName: string;
  industry: string;
  description: string;
  image: string;
  business: string[];
  products: string[];
  factory: string;
  highlights: string[];
  questions: string[];
  website: string | null;
}
export interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  location: string;
  description: string;
  companyId: string | null;
  transport: string | null;
  travelMinutes: number;
}
