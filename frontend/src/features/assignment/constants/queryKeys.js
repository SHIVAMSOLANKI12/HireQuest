export const ASSIGNMENT_QUERY_KEYS = {
  all: ["assignments"],

  token: (token) => ["assignments", "token", String(token)],
};
