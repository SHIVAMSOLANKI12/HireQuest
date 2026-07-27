let candidates = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    status: "Invited",
    createdAt: "2026-07-27T10:00:00.000Z",
    updatedAt: "2026-07-27T10:00:00.000Z",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 9876543211",
    status: "Completed",
    createdAt: "2026-07-26T10:00:00.000Z",
    updatedAt: "2026-07-26T10:00:00.000Z",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 9876543212",
    status: "Shortlisted",
    createdAt: "2026-07-25T10:00:00.000Z",
    updatedAt: "2026-07-25T10:00:00.000Z",
  },
];

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getCandidates = async () => {
  await delay();

  return [...candidates];
};

export const createCandidate = async (payload) => {
  await delay();

  const emailExists = candidates.some(
    (candidate) =>
      candidate.email.toLowerCase() === payload.email.toLowerCase()
  );

  if (emailExists) {
    throw new Error("A candidate with this email already exists.");
  }

  const candidate = {
    id: Date.now(),
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone?.trim() || "",
    status: "New",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  candidates = [candidate, ...candidates];

  return candidate;
};
