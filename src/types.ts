export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Bill {
  billNumber: string;
  date: string;
  customerName: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
}