export const ALL_PERMISSION = [
  //users
  "users:roles:write", // Allowed to add role to user
  "users:roles:delete", //Allowed to delete a role from a user
  //roles
  "roles:write",

  //posts
  "posts:write",
  "posts:read",
  "posts:delete",
  "posts:edit-own",
] as const;

export const PERMISSIONS = ALL_PERMISSION.reduce((acc, permissions) => {
  acc[permissions] = permissions;
  return acc;
}, {} as Record<(typeof ALL_PERMISSION)[number], (typeof ALL_PERMISSION)[number]>);

export const USER_ROLE_PERMISSIONS = [
  PERMISSIONS["posts:write"],
  PERMISSIONS["posts:read"],
];

export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  APPLICATION_USER: "APPLICATION_USER",
};
