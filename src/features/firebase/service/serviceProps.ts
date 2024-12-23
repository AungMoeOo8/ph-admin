export type ServiceProps = {
  id: string,
  name: string;
  provider: string;
  description: string;
  fees: { type: string; amount: number; description?: string }[];
  ending?: string;
  visibility: boolean
};