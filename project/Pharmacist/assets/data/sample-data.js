let medicines = [
  {id:1, name:"Paracetamol", category:"Tablet", price:12.50, stock:40, expiry:"2026-05-10"},
  {id:2, name:"Cough Syrup", category:"Syrup", price:95.00, stock:8, expiry:"2025-12-01"},
  {id:3, name:"Insulin", category:"Injection", price:450.00, stock:15, expiry:"2025-10-20"}
];
let prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
//let prescriptions = [
 // {id:1, customer:"Ramesh", doctor:"Dr. Roy", issued:"2025-12-01", status:"PENDING"},
 // {id:2, customer:"Sita", doctor:"Dr. Anita", issued:"2025-11-28", status:"VALIDATED"}
//];

let bills = [
  {id:1, customer:"Ramesh", amount:210.00, date:"2025-12-01", status:"PAID"},
  {id:2, customer:"Suresh", amount:150.00, date:"2025-12-05", status:"PENDING"}
];

let tickets = [
  {id:1, customer:"Anil", status:"OPEN", created:"2025-12-05"}
];

let activity = [];
