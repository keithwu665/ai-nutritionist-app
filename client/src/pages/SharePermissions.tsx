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

export default function SharePermissions() {
  const router = useRouter();
  const [permissions, setPermissions] = useState<SharePermissions>({
    coachCanView: false,
    friendCanViewBodyData: false,
    friendCanViewFood: false,
    friendCanViewExercise: false,
  });

  // Load permissions from localStorage on mount
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
  }, []);

  // Save permissions to localStorage whenever they change
  const handlePermissionChange = (key: keyof SharePermissions, value: boolean) => {
    const updated = { ...permissions, [key]: value };
    setPermissions(updated);
    localStorage.setItem('sharePermissions', JSON.stringify(updated));
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
