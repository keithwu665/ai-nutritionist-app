import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'wouter';
import { toast } from 'sonner';

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
  status: 'pending' | 'accepted';
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
  const [viewPermissionModal, setViewPermissionModal] = useState<SharedUser | null>(null);
  const [editPermissionModal, setEditPermissionModal] = useState<SharedUser | null>(null);
  const [editPermissions, setEditPermissions] = useState({ body: false, diet: false, workout: false });
  const [removeConfirmModal, setRemoveConfirmModal] = useState<SharedUser | null>(null);

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
    setRemoveConfirmModal(null);
    toast.success('已移除分享對象');
  };

  const handleEditPermissions = (user: SharedUser) => {
    setEditPermissionModal(user);
    setEditPermissions({
      body: user.permissions.body || false,
      diet: user.permissions.diet || false,
      workout: user.permissions.workout || false,
    });
  };

  const handleSavePermissions = () => {
    if (!editPermissionModal) return;

    const updated = sharedUsers.map(u => {
      if (u.id === editPermissionModal.id) {
        return {
          ...u,
          permissions: {
            body: editPermissions.body,
            diet: editPermissions.diet,
            workout: editPermissions.workout,
          },
        };
      }
      return u;
    });

    setSharedUsers(updated);
    localStorage.setItem('sharedUsers', JSON.stringify(updated));
    setEditPermissionModal(null);
    toast.success('權限已更新');
  };

  const getPermissionSummary = (user: SharedUser) => {
    if (user.role === 'coach') {
      return ['身體數據', '飲食', '運動', '目標'];
    }
    const perms = [];
    if (user.permissions.body) perms.push('身體數據');
    if (user.permissions.diet) perms.push('飲食');
    if (user.permissions.workout) perms.push('運動');
    return perms.length > 0 ? perms : ['無'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
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
              onClick={() => window.location.href = '/invite-coach'}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              邀請教練
            </Button>
            <Button
              onClick={() => window.location.href = '/invite-friend'}
              variant="outline"
              className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              邀請朋友
            </Button>
          </div>
        </div>

        {/* Shared Users Management */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">已分享對象</h2>
          {sharedUsers.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">你尚未分享任何資料</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {sharedUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded font-medium ${
                              user.role === 'coach'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role === 'coach' ? '教練' : '朋友'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${
                              user.status === 'accepted'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {user.status === 'accepted' ? '已接受' : '待接受'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Permission Summary */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 mb-2">查看：</p>
                        <ul className="text-xs text-gray-600 space-y-1 ml-2">
                          {getPermissionSummary(user).map((perm, idx) => (
                            <li key={idx}>• {perm}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewPermissionModal(user)}
                          className="flex-1 text-xs text-emerald-600 hover:bg-emerald-50"
                        >
                          查看權限
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPermissions(user)}
                          className="flex-1 text-xs text-blue-600 hover:bg-blue-50"
                        >
                          編輯權限
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRemoveConfirmModal(user)}
                          className="text-xs text-red-600 hover:bg-red-50 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 您的權限設定已自動保存。朋友和教練需要您的邀請才能查看您的數據。
          </p>
        </div>
      </div>

      {/* View Permission Modal */}
      {viewPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">{viewPermissionModal.name} 的權限</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">身體數據</span>
                  <span className="text-lg">{viewPermissionModal.role === 'coach' || viewPermissionModal.permissions.body ? '✓' : '✘'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">飲食</span>
                  <span className="text-lg">{viewPermissionModal.role === 'coach' || viewPermissionModal.permissions.diet ? '✓' : '✘'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">運動</span>
                  <span className="text-lg">{viewPermissionModal.role === 'coach' || viewPermissionModal.permissions.workout ? '✓' : '✘'}</span>
                </div>
              </div>
              <Button
                onClick={() => setViewPermissionModal(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                關閉
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Permission Modal */}
      {editPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">編輯 {editPermissionModal.name} 的權限</h3>
              {editPermissionModal.role === 'coach' ? (
                <div className="bg-blue-50 p-3 rounded mb-6">
                  <p className="text-sm text-blue-700">教練擁有全部查看權限</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">身體數據</label>
                    <Switch
                      checked={editPermissions.body}
                      onCheckedChange={(checked) =>
                        setEditPermissions({ ...editPermissions, body: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">飲食</label>
                    <Switch
                      checked={editPermissions.diet}
                      onCheckedChange={(checked) =>
                        setEditPermissions({ ...editPermissions, diet: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">運動</label>
                    <Switch
                      checked={editPermissions.workout}
                      onCheckedChange={(checked) =>
                        setEditPermissions({ ...editPermissions, workout: checked })
                      }
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => setEditPermissionModal(null)}
                  variant="outline"
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  onClick={handleSavePermissions}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  保存
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {removeConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">確認移除</h3>
              <p className="text-gray-600 mb-6">確定取消與 {removeConfirmModal.name} 的分享？</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setRemoveConfirmModal(null)}
                  variant="outline"
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  onClick={() => handleRemoveSharedUser(removeConfirmModal.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  確認移除
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
