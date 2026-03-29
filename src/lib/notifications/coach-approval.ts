import { getChapterById } from "../db/chapters";
import { listChapterLeadContacts } from "../db/user-roles";

import { sendEmailNotification } from "./email";

export async function sendCoachApprovalDecisionEmails(input: {
  chapterId: string;
  coachName: string;
  coachEmail: string | null;
  approvalStatus: "approved" | "denied";
  reviewNotes?: string | null;
}) {
  const chapter = await getChapterById(input.chapterId);

  if (!chapter) {
    throw new Error("Chapter not found for coach approval notification.");
  }

  const chapterLeads = await listChapterLeadContacts(input.chapterId);
  const recipientSet = new Set<string>();

  for (const lead of chapterLeads) {
    recipientSet.add(lead.email);
  }

  if (input.coachEmail) {
    recipientSet.add(input.coachEmail);
  }

  const recipients = [...recipientSet];
  const actionWord = input.approvalStatus === "approved" ? "approved" : "denied";
  const subject = `Coach profile ${actionWord}: ${input.coachName} (${chapter.name})`;
  const notesLine = input.reviewNotes?.trim()
    ? `Review note: ${input.reviewNotes.trim()}`
    : "No review note was provided.";
  const textBody =
    input.approvalStatus === "approved"
      ? [
          `The coach profile for ${input.coachName} has been approved for ${chapter.name}.`,
          `Public chapter route: /${chapter.slug}`,
          notesLine,
        ].join("\n")
      : [
          `The coach profile for ${input.coachName} has been denied for ${chapter.name}.`,
          notesLine,
        ].join("\n");
  const htmlBody =
    input.approvalStatus === "approved"
      ? `<p>The coach profile for <strong>${input.coachName}</strong> has been approved for <strong>${chapter.name}</strong>.</p><p>Public chapter route: /${chapter.slug}</p><p>${notesLine}</p>`
      : `<p>The coach profile for <strong>${input.coachName}</strong> has been denied for <strong>${chapter.name}</strong>.</p><p>${notesLine}</p>`;

  await sendEmailNotification({
    toAddresses: recipients,
    subject,
    htmlBody,
    textBody,
  });
}
