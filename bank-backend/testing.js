import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 50,
  duration: "30s",
};

const BASE = "http://localhost:5000";
const USER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OWZlZDA0NzRlMDUyMjk1MGM3ZmRlNiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc0MzUwNTU0LCJleHAiOjE3NzQ0MzY5NTR9.4HTUUVob0aH1NZ6xiordfUtfbg7dkR7vCc-1ujFrY5I";
const LOAN_ID = "LOAN0006";

const panFileBin = open("C:/Users/MONIKA/Desktop/New folder/pan.jpg", "b");
const aadhaarFileBin = open("C:/Users/MONIKA/Desktop/New folder/pan.jpg", "b");
const bankStatementBin = open("C:/Users/MONIKA/Desktop/New folder/pan.jpg", "b");
const itrBin = open("C:/Users/MONIKA/Desktop/New folder/pan.jpg", "b");
const payslipBin = open("C:/Users/MONIKA/Desktop/New folder/pan.jpg", "b");

export default function () {
  const unique = `${Date.now()}-${__VU}-${__ITER}`;

  const payload = {
    loanType: "Home Loan",
    loanAmount: "500000",
    companyName: `Infosys ${unique}`,
    location: "Hyderabad",
    salary: "60000",
    netHandSalary: "52000",
    panNumber: `ABCDE${String(__VU).padStart(2, "0")}${String(__ITER).padStart(2, "0")}F`,
    aadhaarNumber: `12341234${String(__VU).padStart(2, "0")}${String(__ITER).padStart(4, "0")}`,
    address: "Vijayawada",

    panFile: http.file(panFileBin, "pan.jpg", "image/jpeg"),
    aadhaarFile: http.file(aadhaarFileBin, "pan.jpg", "image/jpeg"),
    bankStatements: http.file(bankStatementBin, "pan.jpg", "image/jpeg"),
    itReturns: http.file(itrBin, "pan.jpg", "image/jpeg"),
    payslips: http.file(payslipBin, "pan.jpg", "image/jpeg"),
  };

  const res = http.put(
    `${BASE}/api/user/my-loans/${LOAN_ID}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
      },
    }
  );

  if (res.status !== 200) {
    console.log(`FAIL status=${res.status} body=${res.body}`);
  }

  check(res, {
    "update my loan success (200)": (r) => r.status === 200,
  });

  sleep(1);
}