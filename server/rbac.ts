export const ADMIN_TIERS = [
  "MASTER",
  "OPERATIONS",
  "SUPPORT",
] as const;

export type AdminTier = (typeof ADMIN_TIERS)[number];

export const PERMISSIONS = [
  "admin.dashboard.view",
  "users.view",
  "users.manage",
  "kyc.view",
  "kyc.sensitive.view",
  "transactions.view",
  "transactions.manage",
  "support.view",
  "support.manage",
  "financial.config.view",
  "financial.config.manage",
  "provider.config.view",
  "provider.config.manage",
  "fees.view",
  "fees.manage",
  "reconciliation.view",
  "reconciliation.manage",
  "aml.view",
  "aml.manage",
  "audit.view",
  "admins.manage",
  "system.manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const permissionsByTier: Record<AdminTier, readonly Permission[]> = {
  MASTER: PERMISSIONS,

  OPERATIONS: [
    "admin.dashboard.view",
    "users.view",
    "users.manage",
    "kyc.view",
    "transactions.view",
    "transactions.manage",
    "support.view",
    "support.manage",
    "financial.config.view",
    "provider.config.view",
    "fees.view",
    "reconciliation.view",
    "aml.view",
    "audit.view",
  ],

  SUPPORT: [
    "admin.dashboard.view",
    "users.view",
    "kyc.view",
    "transactions.view",
    "support.view",
    "support.manage",
  ],
};

export function isAdminTier(value: string): value is AdminTier {
  return ADMIN_TIERS.includes(value as AdminTier);
}

export function hasPermission(
  tier: AdminTier,
  permission: Permission
): boolean {
  return permissionsByTier[tier].includes(permission);
}

export function permissionsForTier(tier: AdminTier): readonly Permission[] {
  return permissionsByTier[tier];
}
