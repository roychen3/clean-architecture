import { useEffect, useMemo, useState } from 'react';
import {
  FoldVertical,
  UnfoldVertical,
  CheckSquare,
  Square,
} from 'lucide-react';
import { isEqual } from 'lodash';

import { useRolePermissions } from '@/hooks/permissions/use-role-permissions';
import { useRolePermissionResources } from '@/hooks/permissions/use-role-permission-resources';
import { useRolePermissionActions } from '@/hooks/permissions/use-role-permission-actions';
import { useSetRolePermissions } from '@/hooks/permissions/use-set-role-permissions';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { FormErrorMessage } from '@/components/form/form-error-message';
import { FormEditTitle } from '@/components/typography';
import { useGlobalUnsaveLeaveBlocker } from '@/components/unsave-leave-blocker-provider';

function PermissionTreeSkeleton() {
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Skeleton className="size-7 rounded" />
        <Skeleton className="size-7 rounded" />
        <Skeleton className="size-7 rounded" />
        <Skeleton className="size-7 rounded" />
      </div>
      <div className="space-y-2 divide-y">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded">
            <div className="flex items-center gap-2 px-3 py-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <div className="flex flex-wrap gap-3 px-3 pb-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center gap-1">
                  <Skeleton className="size-4 rounded" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PermissionTreeProps {
  resources: { id: string; name: string }[];
  actions: { id: string; name: string }[];
  value: Record<string, Set<string>>;
  onChange: (resourceId: string, actionId: string, checked: boolean) => void;
  disabled?: boolean;
}
function PermissionTree({
  resources,
  actions,
  value,
  onChange,
  disabled,
}: PermissionTreeProps) {
  const [expandedResourceIds, setExpandedResourceIds] = useState<string[]>([]);

  const allResourceIds = resources.map((r) => r.id);

  const handleExpandAll = () => setExpandedResourceIds(allResourceIds);
  const handleCollapseAll = () => setExpandedResourceIds([]);

  const handleSelectAll = () => {
    resources.forEach((resource) => {
      actions.forEach((action) => {
        if (!value[resource.id]?.has(action.id)) {
          onChange(resource.id, action.id, true);
        }
      });
    });
  };

  const handleDeselectAll = () => {
    resources.forEach((resource) => {
      actions.forEach((action) => {
        if (value[resource.id]?.has(action.id)) {
          onChange(resource.id, action.id, false);
        }
      });
    });
  };

  if (!resources.length)
    return <div className="text-muted-foreground">No permissions</div>;
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          onClick={handleExpandAll}
        >
          <UnfoldVertical />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          onClick={handleCollapseAll}
        >
          <FoldVertical />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          onClick={handleSelectAll}
          disabled={disabled}
        >
          <CheckSquare />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          onClick={handleDeselectAll}
          disabled={disabled}
        >
          <Square />
        </Button>
      </div>
      <Accordion
        type="multiple"
        value={expandedResourceIds}
        onValueChange={setExpandedResourceIds}
      >
        {resources.map((resource) => {
          const allChecked = actions.every((action) =>
            value[resource.id]?.has(action.id),
          );
          const someChecked =
            value[resource.id] && value[resource.id].size > 0 && !allChecked;

          const handleResourceCheckbox = () => {
            actions.forEach((action) => {
              onChange(resource.id, action.id, !allChecked);
            });
          };
          return (
            <AccordionItem key={resource.id} value={resource.id}>
              <AccordionTrigger className="px-3">
                <div className="flex items-center gap-1">
                  <Checkbox
                    checked={someChecked ? 'indeterminate' : allChecked}
                    onCheckedChange={handleResourceCheckbox}
                    disabled={disabled}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {resource.name}
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-wrap gap-3 px-3">
                {actions.map((action) => {
                  const checked = value[resource.id]?.has(action.id) ?? false;
                  return (
                    <Label key={action.id} className="flex items-center gap-1">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(checked) =>
                          onChange(resource.id, action.id, Boolean(checked))
                        }
                        disabled={disabled}
                      />
                      {action.name}
                    </Label>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

interface RolePermissionsEditorProps {
  roleId: string;
}
export function RolePermissionsEditor({ roleId }: RolePermissionsEditorProps) {
  const {
    data: rolePermission,
    status: permStatus,
    error: permError,
    refetch: refetchPermissions,
  } = useRolePermissions({ path: { id: roleId } }, !!roleId);
  const resourcesQuery = useRolePermissionResources(!!roleId);
  const actionsQuery = useRolePermissionActions(!!roleId);
  const {
    mutateAsync: setRolePermissions,
    status: setPermStatus,
    error: setPermError,
  } = useSetRolePermissions();
  const [permissions, setPermissions] = useState<Record<string, Set<string>>>(
    {},
  );

  const defaultRolePermissionsIds = useMemo(() => {
    const result = rolePermission?.data.permissions.map((rp) => {
      return {
        [rp.resource.id]: rp.actions.map((a) => a.id).sort(),
      };
    });
    return result;
  }, [rolePermission]);

  const editedRolePermissionsIds = useMemo(() => {
    const result = Object.entries(permissions).map(
      ([resourceId, actionsSet]) => {
        return {
          [resourceId]: Array.from(actionsSet).sort(),
        };
      },
    );
    return result;
  }, [permissions]);

  const isDirty = useMemo(() => {
    return !isEqual(defaultRolePermissionsIds, editedRolePermissionsIds);
  }, [defaultRolePermissionsIds, editedRolePermissionsIds]);

  const { setIsDirty } = useGlobalUnsaveLeaveBlocker();
  useEffect(() => {
    setIsDirty(isDirty);
  }, [isDirty, setIsDirty]);

  useEffect(() => {
    if (rolePermission?.data?.permissions) {
      const map: Record<string, Set<string>> = {};
      for (const perm of rolePermission.data.permissions) {
        map[perm.resource.id] = new Set(perm.actions.map((a) => a.id));
      }
      setPermissions(map);
    }
  }, [rolePermission]);

  const handlePermissionChange = (
    resourceId: string,
    actionId: string,
    checked: boolean,
  ) => {
    setPermissions((prev) => {
      const next = { ...prev };
      if (!next[resourceId]) next[resourceId] = new Set();
      if (checked) {
        next[resourceId].add(actionId);
      } else {
        next[resourceId].delete(actionId);
        if (next[resourceId].size === 0) {
          delete next[resourceId];
        }
      }
      return { ...next };
    });
  };

  const handleSubmit = async () => {
    if (!roleId) return;

    try {
      setIsDirty(false);
      const payload = Object.entries(permissions).map(
        ([resourceId, actionsSet]) => ({
          resourceId,
          actionIds: Array.from(actionsSet),
        }),
      );
      await setRolePermissions({
        body: {
          roleId,
          permissions: payload,
        },
      });
      await refetchPermissions();
    } catch {
      setIsDirty(true);
    }
  };

  return (
    <div className="space-y-4">
      <FormEditTitle>Role Permissions</FormEditTitle>
      {(() => {
        if (
          resourcesQuery.status === 'pending' ||
          actionsQuery.status === 'pending' ||
          permStatus === 'pending'
        ) {
          return <PermissionTreeSkeleton />;
        }

        if (
          resourcesQuery.status === 'error' ||
          actionsQuery.status === 'error' ||
          permStatus === 'error'
        ) {
          return (
            <div className="text-red-500">
              {String(resourcesQuery.error || actionsQuery.error || permError)}
            </div>
          );
        }

        if (
          resourcesQuery.status === 'success' &&
          actionsQuery.status === 'success'
        ) {
          return (
            <>
              <PermissionTree
                resources={resourcesQuery.data?.data || []}
                actions={actionsQuery.data?.data || []}
                value={permissions}
                onChange={handlePermissionChange}
                disabled={setPermStatus === 'pending'}
              />
              {setPermStatus === 'error' && (
                <FormErrorMessage>{String(setPermError)}</FormErrorMessage>
              )}
              {setPermStatus === 'success' && (
                <span className="text-green-600 text-sm">
                  Permissions updated!
                </span>
              )}
              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={setPermStatus === 'pending' || !isDirty}
                >
                  {setPermStatus === 'pending'
                    ? 'Updating Permissions...'
                    : 'Update Permissions'}
                </Button>
              </div>
            </>
          );
        }
      })()}
    </div>
  );
}
