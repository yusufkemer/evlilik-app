import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export type PaymentHistory = {
  amount: number;
  date: string;
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
    ...expense,
  });
}
