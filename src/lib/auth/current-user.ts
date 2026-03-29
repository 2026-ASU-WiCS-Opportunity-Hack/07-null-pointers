import type { AppUser } from "../../types/domain";
import type { DashboardRoute } from "../../types/rbac";
import { DASHBOARD_HOME_BY_ROLE } from "../../types/rbac";
import { listRoleAssignmentsForUser, type UserRoleWithChapter } from "../db/user-roles";
import { getUserByCognitoSub } from "../db/users";

import { getAuthSession, type AuthSession } from "./session";

const ROLE_PRIORITY = ["global_admin", "chapter_lead", "content_creator", "coach"] as const;

export interface CurrentAppUser {
  session: AuthSession;
  user: AppUser;
  roleAssignments: UserRoleWithChapter[];
  dashboardPath: DashboardRoute | null;
}

function getDashboardPath(assignments: UserRoleWithChapter[]): DashboardRoute | null {
  for (const role of ROLE_PRIORITY) {
    const match = assignments.find((assignment) => assignment.role === role);

    if (match) {
      return DASHBOARD_HOME_BY_ROLE[role];
    }
  }

  return null;
}

export async function getCurrentAppUser() {
  const session = await getAuthSession();

  if (!session) {
    return null;
  }

  const user = await getUserByCognitoSub(session.sub);

  if (!user) {
    return null;
  }

  const roleAssignments = await listRoleAssignmentsForUser(user.id);

  return {
    session,
    user,
    roleAssignments,
    dashboardPath: getDashboardPath(roleAssignments),
  } satisfies CurrentAppUser;
}

