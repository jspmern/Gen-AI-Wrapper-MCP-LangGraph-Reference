export const mockPendingApprovals = [
  {
    id: "approval_001",
    toolName: "apply_leave",
    status: "pending",
    requestedBy: "AI Agent",
    description: "AI wants to apply 2 days leave for employee Rahul Sharma.",
    input: {
      employeeId: "emp_001",
      days: 2,
      reason: "Personal work",
    },
    createdAt: "2026-06-26T10:10:00.000Z",
  },
  {
    id: "approval_002",
    toolName: "approve_reimbursement",
    status: "pending",
    requestedBy: "AI Agent",
    description: "AI wants to approve reimbursement of ₹2500.",
    input: {
      employeeId: "emp_002",
      amount: 2500,
      category: "Travel",
    },
    createdAt: "2026-06-26T10:15:00.000Z",
  },
];