export const generateBillNumber = (): string => {
  const prefix = 'BILL';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

export const calculateAmount = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

export const calculateTotals = (items: any[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  return { subtotal, tax, total };
};