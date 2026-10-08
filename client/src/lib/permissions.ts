export type AdminTier = "MASTER" | "OPERATIONS" | "SUPPORT";

export type AdminPermission =
  | "admin.dashboard.view"
  | "users.view"
  | "kyc.view"
  | "transactions.view"
  | "support.view"
  | "financial.config.view"
  | "audit.view"
  | "system.manage";

const permissionsByTier: Record<AdminTier, readonly AdminPermission[]> = {
  MASTER: [
    "admin.dashboard.view",
    "users.view",
    "kyc.view",
    "transactions.view",
    "support.view",
    "financial.config.view",
    "audit.view",
    "system.manage",
  ],

  OPERATIONS: [
    "admin.dashboard.view",
    "users.view",
    "kyc.view",
    "transactions.view",
    "support.view",
    "financial.config.view",
    "audit.view",
  ],

  SUPPORT: [
    "admin.dashboard.view",
    "users.view",
    "kyc.view",
    "transactions.view",
    "support.view",
  ],
};

export function hasPermission(
  tier: AdminTier | undefined,
  permission: AdminPermission
) {
  if (!tier) return false;
  return permissionsByTier[tier].includes(permission);
}
