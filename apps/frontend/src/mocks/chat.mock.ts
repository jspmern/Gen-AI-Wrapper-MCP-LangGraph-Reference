export const mockChatHistory = [
  {
    id: "msg_001",
    role: "user",
    content: "Show me employee details",
    createdAt: "2026-06-26T10:00:00.000Z",
  },
  {
    id: "msg_002",
    role: "assistant",
    content: "I found employee details for you.",
    createdAt: "2026-06-26T10:00:05.000Z",
  },
];

export function createMockAiResponse(message: string) {
  return {
    id: `msg_${Date.now()}`,
    role: "assistant",
    content: `Dummy AI response for: "${message}"`,
    toolCalls: [
      {
        id: "tool_001",
        name: "get_employee",
        status: "completed",
        input: {
          employeeId: "emp_001",
        },
        output: {
          firstName: "Rahul",
          lastName: "Sharma",
          department: "Engineering",
        },
      },
    ],
    createdAt: new Date().toISOString(),
  };
}