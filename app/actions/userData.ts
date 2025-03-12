"use server";

import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const CHECK_INS_FILE = path.join(process.cwd(), "data", "checkIns.json");

interface User {
  id: string;
  email: string;
}

interface CheckIn {
  userId: string;
  date: string;
  content: string;
}

function getUsers(): User[] {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

function getCheckIns(): CheckIn[] {
  if (!fs.existsSync(CHECK_INS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(CHECK_INS_FILE, "utf-8");
  return JSON.parse(data);
}

function saveCheckIns(checkIns: CheckIn[]) {
  const dir = path.dirname(CHECK_INS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CHECK_INS_FILE, JSON.stringify(checkIns, null, 2));
}

export async function getUserData(userId: string) {
  const users = getUsers();
  return users.find((user) => user.id === userId);
}

export async function submitDailyCheckIn(userId: string, content: string) {
  const checkIns = getCheckIns();
  const today = new Date().toISOString().split("T")[0];
  const existingCheckIn = checkIns.find(
    (checkIn) => checkIn.userId === userId && checkIn.date === today,
  );

  if (existingCheckIn) {
    return {
      success: false,
      message: "You have already submitted a check-in for today.",
    };
  }

  const newCheckIn: CheckIn = {
    userId,
    date: today,
    content,
  };

  checkIns.push(newCheckIn);
  saveCheckIns(checkIns);

  return { success: true, message: "Check-in submitted successfully." };
}
