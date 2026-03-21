import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft, Copy, Check } from 'lucide-react';
import { useRouter } from 'wouter';
import { toast } from 'sonner';

export default function InviteFriend() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [permissions, setPermissions] = useState({
    body: true,
    diet: true,
    workout: true,
  });

  const generateInviteLink = () => {
    if (!email.trim()) {
      toast.error('請輸入電郵地址');
      return;
    }

    // Generate a mock invite token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/share?token=${token}&role=friend&email=${encodeURIComponent(email)}`;
    setInviteLink(link);
    toast.success('邀請連結已生成');
  };

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('已複製到剪貼板');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToSharedList = () => {
    if (!email.trim()) {
      toast.error('請輸入電郵地址');
      return;
    }

    // Add to shared users list
    const sharedUsers = JSON.parse(localStorage.getItem('sharedUsers') || '[]');
    const newUser = {
      id: Math.random().toString(36).substring(7),
      name: email.split('@')[0],
      email: email,
      role: 'friend' as const,
      status: 'pending' as const,
      permissions: {
        body: permissions.body,
        diet: permissions.diet,
        workout: permissions.workout,
      },
    };

    sharedUsers.push(newUser);
    localStorage.setItem('sharedUsers', JSON.stringify(sharedUsers));
    toast.success('朋友邀請已發送');
    
    setTimeout(() => {
      router.back();
    }, 1500);
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
          <h1 className="text-lg font-bold">邀請朋友</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Email Input */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">朋友電郵</h2>
          <Card>
            <CardContent className="p-4">
              <Input
                type="email"
                placeholder="輸入朋友的電郵地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>

        {/* Role Display */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">角色</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">朋友</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded">
                  朋友
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Selection */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">朋友權限</h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">身體數據</span>
                </label>
                <Switch
                  checked={permissions.body}
                  onCheckedChange={(checked) =>
                    setPermissions({ ...permissions, body: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">飲食</span>
                </label>
                <Switch
                  checked={permissions.diet}
                  onCheckedChange={(checked) =>
                    setPermissions({ ...permissions, diet: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">運動</span>
                </label>
                <Switch
                  checked={permissions.workout}
                  onCheckedChange={(checked) =>
                    setPermissions({ ...permissions, workout: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invite Link Section */}
        {inviteLink && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-gray-800">邀請連結</h2>
            <Card>
              <CardContent className="p-4">
                <div className="bg-gray-50 p-3 rounded-lg mb-3 break-all text-xs text-gray-600">
                  {inviteLink}
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      已複製
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      複製連結
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={generateInviteLink}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            生成邀請連結
          </Button>
          <Button
            onClick={handleAddToSharedList}
            variant="outline"
            className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            發送邀請
          </Button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 朋友需要使用邀請連結才能查看您選定的數據。您可以複製連結並通過電郵或其他方式發送給朋友。
          </p>
        </div>
      </div>
    </div>
  );
}
