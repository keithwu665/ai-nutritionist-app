import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'wouter';

interface SharePermissions {
  coachCanView: boolean;
  friendCanViewBodyData: boolean;
  friendCanViewFood: boolean;
  friendCanViewExercise: boolean;
}

interface SharedUser {
  id: string;
  name: string;
  email: string;
  role: 'coach' | 'friend';
  status: 'connected' | 'pending';
  permissions: {
    body?: boolean;
    diet?: boolean;
    workout?: boolean;
  };
}

export default function SharePermissions() {
  const router = useRouter();
  const [permissions, setPermissions] = useState<SharePermissions>({
    coachCanView: false,
    friendCanViewBodyData: false,
    friendCanViewFood: false,
    friendCanViewExercise: false,
  });
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);

  // Load permissions and shared users from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sharePermissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPermissions(parsed);
      } catch (err) {
        console.error('Failed to parse share permissions:', err);
      }
    }

    const savedUsers = localStorage.getItem('sharedUsers');
    if (savedUsers) {
      try {
        const parsed = JSON.parse(savedUsers);
        setSharedUsers(parsed);
      } catch (err) {
        console.error('Failed to parse shared users:', err);
      }
    }
  }, []);

  // Save permissions to localStorage whenever they change
  const handlePermissionChange = (key: keyof SharePermissions, value: boolean) => {
    const updated = { ...permissions, [key]: value };
    setPermissions(updated);
    localStorage.setItem('sharePermissions', JSON.stringify(updated));
  };

  const handleRemoveSharedUser = (userId: string) => {
    const updated = sharedUsers.filter(u => u.id !== userId);
    setSharedUsers(updated);
    localStorage.setItem('sharedUsers', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-0 h-auto"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold">分享權限管理</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Coach Permissions */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">教練權限</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">允許教練查看</p>
                  <p className="text-sm text-gray-600">教練可以查看您的身體數據、飲食和運動記錄</p>
                </div>
                <Switch
                  checked={permissions.coachCanView}
                  onCheckedChange={(checked) => handlePermissionChange('coachCanView', checked)}
                />
              </div>

              {permissions.coachCanView && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <p className="text-sm font-medium text-gray-700">教練可以查看：</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>✓ 身體數據</li>
                    <li>✓ 飲食</li>
                    <li>✓ 運動</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Friend Permissions */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">朋友權限</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-gray-800">允許朋友查看</p>
                  <p className="text-sm text-gray-600">選擇朋友可以查看的內容</p>
                </div>
                <Switch
                  checked={
                    permissions.friendCanViewBodyData ||
                    permissions.friendCanViewFood ||
                    permissions.friendCanViewExercise
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handlePermissionChange('friendCanViewBodyData', true);
                      handlePermissionChange('friendCanViewFood', true);
                      handlePermissionChange('friendCanViewExercise', true);
                    } else {
                      handlePermissionChange('friendCanViewBodyData', false);
                      handlePermissionChange('friendCanViewFood', false);
                      handlePermissionChange('friendCanViewExercise', false);
                    }
                  }}
                />
              </div>

              {(permissions.friendCanViewBodyData ||
                permissions.friendCanViewFood ||
                permissions.friendCanViewExercise) && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">身體數據</span>
                    </label>
                    <Switch
                      checked={permissions.friendCanViewBodyData}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('friendCanViewBodyData', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">飲食</span>
                    </label>
                    <Switch
                      checked={permissions.friendCanViewFood}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('friendCanViewFood', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">運動</span>
                    </label>
                    <Switch
                      checked={permissions.friendCanViewExercise}
                      onCheckedChange={(checked) =>
                        handlePermissionChange('friendCanViewExercise', checked)
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Invite Buttons */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">邀請</h2>
          <div className="space-y-2">
            <Button
              onClick={() => router.push('/invite-coach')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              邀請教練
            </Button>
            <Button
              onClick={() => router.push('/invite-friend')}
              variant="outline"
              className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              邀請朋友
            </Button>
          </div>
        </div>

        {/* Shared Users List */}
        {sharedUsers.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-gray-800">已分享對象</h2>
            <div className="space-y-2">
              {sharedUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                            {user.role === 'coach' ? '教練' : '朋友'}
                          </span>
                          <span className="text-xs text-gray-600">{user.status === 'connected' ? '已連接' : '待確認'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/share-permissions/view/${user.id}`)}
                          className="text-xs text-emerald-600 hover:bg-emerald-50"
                        >
                          查看權限
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSharedUser(user.id)}
                          className="text-xs text-red-600 hover:bg-red-50"
                        >
                          移除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 您的權限設定已自動保存。朋友和教練需要您的邀請才能查看您的數據。
          </p>
        </div>
      </div>
    </div>
  );
}
