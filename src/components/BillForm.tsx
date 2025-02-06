import React, { useState } from 'react';
import { PlusCircle, Trash2, Receipt } from 'lucide-react';
import type { Bill, BillItem } from '../types';
import { generateBillNumber, calculateAmount, calculateTotals } from '../utils';

export default function BillForm() {
  const [bill, setBill] = useState<Bill>({
    billNumber: generateBillNumber(),
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0
  });

  const addItem = () => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0
    };
    setBill(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id: string, field: keyof BillItem, value: string | number) => {
    setBill(prev => {
      const newItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.amount = calculateAmount(
              field === 'quantity' ? Number(value) : item.quantity,
              field === 'unitPrice' ? Number(value) : item.unitPrice
            );
          }
          return updatedItem;
        }
        return item;
      });
      const { subtotal, tax, total } = calculateTotals(newItems);
      return { ...prev, items: newItems, subtotal, tax, total };
    });
  };

  const removeItem = (id: string) => {
    setBill(prev => {
      const newItems = prev.items.filter(item => item.id !== id);
      const { subtotal, tax, total } = calculateTotals(newItems);
      return { ...prev, items: newItems, subtotal, tax, total };
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Receipt className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Billing System</h1>
        </div>
        <div className="text-sm text-gray-600">
          <p>Bill #: {bill.billNumber}</p>
          <p>Date: {bill.date}</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer Name
        </label>
        <input
          type="text"
          value={bill.customerName}
          onChange={(e) => setBill(prev => ({ ...prev, customerName: e.target.value }))}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter customer name"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Items</h2>
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {bill.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-start">
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                placeholder="Item description"
                className="flex-1 p-2 border rounded-md"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                placeholder="Qty"
                className="w-24 p-2 border rounded-md"
              />
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                placeholder="Price"
                className="w-32 p-2 border rounded-md"
              />
              <div className="w-32 p-2 bg-gray-50 rounded-md text-right">
                ${item.amount.toFixed(2)}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>${bill.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tax (10%):</span>
              <span>${bill.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${bill.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}