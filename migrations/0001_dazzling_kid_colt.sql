DROP INDEX "roles_id_index";
DROP INDEX "users_id_index";
ALTER TABLE "roles" DROP CONSTRAINT "roles_name_application_pk";
ALTER TABLE "userToRoles" DROP CONSTRAINT "userToRoles_applicationId_roleId_userId_pk";
ALTER TABLE "users" DROP CONSTRAINT "users_email_application_pk";