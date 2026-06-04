import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export type PaidBy = "Yusuf" | "Büşra";

export type PaymentHistory = {
  amount: number;
  date: string;
  paidBy?: PaidBy;
};

export type Expense = {
  id?: string;
  title: string;
  category: string;
  total: number;
  paid: number;
  remaining: number;
  installment: number;
  monthlyPayment: number;
  dueDate: string;
  note: string;
  paymentHistory: PaymentHistory[];
};

const COLLECTION_NAME = "expenses";

export async function getExpenses(): Promise<Expense[]> {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

  const expenses: Expense[] = [];

  querySnapshot.forEach((docItem) => {
    expenses.push({
      id: docItem.id,
      ...(docItem.data() as Omit<Expense, "id">),
    });
  });

  return expenses;
}

export async function addExpenseToDB(expense: Expense) {
  await addDoc(collection(db, COLLECTION_NAME), expense);
}

export async function deleteExpenseFromDB(id: string) {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

export async function updateExpenseInDB(expense: Expense) {
  if (!expense.id) return;

  const expenseRef = doc(db, COLLECTION_NAME, expense.id);

  await updateDoc(expenseRef, {
    title: expense.title,
    category: expense.category,
    total: expense.total,
    paid: expense.paid,
    remaining: expense.remaining,
    installment: expense.installment,
    monthlyPayment: expense.monthlyPayment,
    dueDate: expense.dueDate,
    note: expense.note,
    paymentHistory: expense.paymentHistory || [],
  });
}