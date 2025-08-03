import { PermissionAction, PermissionResource, Role, User } from '@ca/core';

import {
  prisma,
  PrismaRolesRepository,
  PrismaPermissionActionsRepository,
  PrismaPermissionResourcesRepository,
  PrismaRolePermissionsRepository,
} from '..';

const seedBasicData = async () => {
  try {
    const rolesRepository = new PrismaRolesRepository(prisma);
    await rolesRepository.create(
      new Role({
        name: 'admin',
      }),
    );
    await rolesRepository.create(
      new Role({
        name: 'generalAdmin',
      }),
    );
    await rolesRepository.create(
      new Role({
        name: 'user',
      }),
    );

    const permissionResourcesRepository =
      new PrismaPermissionResourcesRepository(prisma);
    await permissionResourcesRepository.create(
      new PermissionResource({
        name: 'articles',
      }),
    );
    await permissionResourcesRepository.create(
      new PermissionResource({
        name: 'users',
      }),
    );

    const permissionActionsRepository = new PrismaPermissionActionsRepository(
      prisma,
    );
    await permissionActionsRepository.create(
      new PermissionAction({
        name: 'create',
      }),
    );
    await permissionActionsRepository.create(
      new PermissionAction({
        name: 'read',
      }),
    );
    await permissionActionsRepository.create(
      new PermissionAction({
        name: 'update',
      }),
    );
    await permissionActionsRepository.create(
      new PermissionAction({
        name: 'delete',
      }),
    );
  } catch (error) {
    console.error('Error:', error);
  }
};

// Example usage
async function example() {
  try {
    // await seedBasicData();
    const rolePermissionsRepository = new PrismaRolePermissionsRepository(
      prisma,
    );
    // await rolePermissionsRepository.addResourceToRole(
    //   '3044a3ac-61fd-43a8-a498-5d8f940ec51e',
    //   'f2ecbb2d-0c35-4157-be79-22d9d40a08b9'
    // );
    // await rolePermissionsRepository.addActionToResource(
    //   'd47aff80-335b-484e-b58d-9d1c4979b3b4',
    //   '5f7dff7a-dedd-4bef-a5e0-4e692cc8307c',
    //   '5f39b318-ed1f-45ca-8f7f-fb67993ad7da'
    // );

    // const userPermission = await rolePermissionsRepository.getUserPermissions(
    //   '21c4f92e-d9cb-4070-bd4f-cf69945010fd'
    // );
    // console.log('userPermission\n', JSON.stringify(userPermission, null, 2));
    // await rolePermissionsRepository.assignRoleToUser(
    //   '21c4f92e-d9cb-4070-bd4f-cf69945010fd',
    //   '3044a3ac-61fd-43a8-a498-5d8f940ec51e'
    // );
    // await rolePermissionsRepository.removeRoleFromUser(
    //   '21c4f92e-d9cb-4070-bd4f-cf69945010fd',
    //   '3044a3ac-61fd-43a8-a498-5d8f940ec51e'
    // );
    // const userPermission = await rolePermissionsRepository.getUserPermissions(
    //   '21c4f92e-d9cb-4070-bd4f-cf69945010fd'
    // );
    // console.log('userPermission\n', JSON.stringify(userPermission, null, 2));

    // const rolePermissionsByRoleIdData =
    //   await rolePermissionsRepository.getRolePermissionsByRoleId(
    //     '3044a3ac-61fd-43a8-a498-5d8f940ec51e'
    //   );
    // console.log(
    //   'rolePermissionsByRoleIdData\n',
    //   JSON.stringify(rolePermissionsByRoleIdData, null, 2)
    // );

    // const allRolePermissionsData =
    //   await rolePermissionsRepository.getAllRolePermissions();
    // console.log(
    //   'allRolePermissionsData\n',
    //   JSON.stringify(allRolePermissionsData, null, 2)
    // );
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the example
example().catch(console.error);
