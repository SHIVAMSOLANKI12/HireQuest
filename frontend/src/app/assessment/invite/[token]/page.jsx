import { CandidateInvitation } from "@/features/candidate";

const InvitationPage = async ({ params }) => {
  const { token } = await params;

  return <CandidateInvitation token={token} />;
};

export default InvitationPage;
