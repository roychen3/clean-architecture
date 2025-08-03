import {
  User,
  Role,
  PermissionResource,
  PERMISSION_RESOURCE_ENUMS,
  PermissionAction,
  PERMISSION_ACTION_ENUMS,
} from '@ca/core';
import { PasswordHasher, BcryptPasswordHasher } from '@ca/application';

import { prisma } from './database/prisma';

const seedResourcesAndActions = async () => {
  console.log('Seeding permissions...');
  for (const name of Object.values(PERMISSION_RESOURCE_ENUMS)) {
    const resource = new PermissionResource({
      name,
    });
    await prisma.permissionResource.upsert({
      where: { name: resource.getName() },
      update: {},
      create: {
        id: resource.getId(),
        name: resource.getName(),
      },
    });
  }
  console.log('Permissions seeded successfully.');

  console.log('Seeding actions...');
  for (const name of Object.values(PERMISSION_ACTION_ENUMS)) {
    const action = new PermissionAction({
      name,
    });
    await prisma.permissionAction.upsert({
      where: { name: action.getName() },
      update: {},
      create: {
        id: action.getId(),
        name: action.getName(),
      },
    });
  }
  console.log('Actions seeded successfully.');
};

const seedSuperAdminUser = async (passwordHasher: PasswordHasher) => {
  console.log(`Seeding 'super admin' user...`);
  const hashedPassword = await passwordHasher.hash('superadmin');
  const superAdmin = new User({
    email: 'superadmin@mail.com',
    password: hashedPassword,
    name: 'Super Admin',
  });
  await prisma.user.upsert({
    where: { email: superAdmin.getEmail() },
    update: {
      password: superAdmin.getPassword(),
      name: superAdmin.getName(),
    },
    create: {
      id: superAdmin.getId(),
      email: superAdmin.getEmail(),
      password: superAdmin.getPassword(),
      name: superAdmin.getName(),
    },
  });
  const dbSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdmin.getEmail() },
  });
  const superAdminId = dbSuperAdmin ? dbSuperAdmin.id : superAdmin.getId();
  console.log(`Super 'admin user' seeded successfully.`);

  console.log(`Seeding 'super-admin' role and permissions...`);
  const superAdminRole = new Role({
    name: 'super-admin',
    priority: 1,
    isSuperAdmin: true,
  });
  await prisma.role.upsert({
    where: { name: superAdminRole.getName() },
    update: {
      priority: superAdminRole.getPriority(),
      isSuperAdmin: superAdminRole.getIsSuperAdminRole(),
    },
    create: {
      id: superAdminRole.getId(),
      name: superAdminRole.getName(),
      priority: superAdminRole.getPriority(),
      isSuperAdmin: superAdminRole.getIsSuperAdminRole(),
    },
  });
  const dbSuperAdminRole = await prisma.role.findUnique({
    where: { name: superAdminRole.getName() },
  });
  const superAdminRoleId = dbSuperAdminRole
    ? dbSuperAdminRole.id
    : superAdminRole.getId();
  console.log(`Super 'admin role' seeded successfully.`);

  console.log(`Assigning permissions to 'super-admin' role...`);
  const resources = await prisma.permissionResource.findMany();
  const actions = await prisma.permissionAction.findMany();
  for (const resource of resources) {
    for (const action of actions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_resourceId_actionId: {
            roleId: superAdminRoleId,
            resourceId: resource.id,
            actionId: action.id,
          },
        },
        update: {},
        create: {
          roleId: superAdminRoleId,
          resourceId: resource.id,
          actionId: action.id,
        },
      });
    }
  }
  console.log(`Permissions assigned to 'super-admin' role successfully.`);

  console.log(`Assigning 'super-admin' role to 'super admin' user...`);
  await prisma.userToRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdminId,
        roleId: superAdminRoleId,
      },
    },
    update: {},
    create: {
      userId: superAdminId,
      roleId: superAdminRoleId,
    },
  });
  console.log(`'Super admin' user role assigned successfully.`);
};

const seedUserRole = async () => {
  console.log(`Seeding 'user' role...`);
  const role = new Role({
    name: 'user',
    priority: Role.NO_PERMISSIONS,
  });
  await prisma.role.upsert({
    where: { name: role.getName() },
    update: {},
    create: {
      id: role.getId(),
      name: role.getName(),
      priority: role.getPriority(),
    },
  });
  console.log(`'User' role seeded successfully.`);
};

async function seedSystemDefaultData(passwordHasher: PasswordHasher) {
  try {
    await seedResourcesAndActions();
    await seedSuperAdminUser(passwordHasher);
    await seedUserRole();
    console.log('System defaults seeded successfully.');
  } catch (error) {
    console.error('Error seeding system defaults:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedSystemDefaultData(new BcryptPasswordHasher());
