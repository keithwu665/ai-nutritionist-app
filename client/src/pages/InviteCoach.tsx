import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Copy, Check } from 'lucide-react';
import { useRouter } from 'wouter';
import { toast } from 'sonner';

export default function InviteCoach() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateInviteLink = () => {
    if (!email.trim()) {
      toast.error('請輸入電郵地址');
      return;
    }

    // Generate a mock invite token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/share?token=${token}&role=coach&email=${encodeURIComponent(email)}`;
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
      role: 'coach' as const,
      status: 'pending' as const,
      permissions: {
        body: true,
        diet: true,
        workout: true,
      },
    };

    sharedUsers.push(newUser);
    localStorage.setItem('sharedUsers', JSON.stringify(sharedUsers));
    toast.success('教練邀請已發送');
    
    setTimeout(() => {
      window.history.back();
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
            onClick={() => window.history.back()}
            className="p-0 h-auto"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold">邀請教練</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Email Input */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">教練電郵</h2>
          <Card>
            <CardContent className="p-4">
              <Input
                type="email"
                placeholder="輸入教練的電郵地址"
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
                <span className="text-gray-700">教練</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded">
                  教練
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Info */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">教練權限</h2>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-3">教練將可以查看：</p>
              <ul className="text-sm text-gray-600 space-y-2 ml-4">
                <li>✓ 身體數據</li>
                <li>✓ 飲食</li>
                <li>✓ 運動</li>
                <li>✓ 目標</li>
              </ul>
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
            💡 教練需要使用邀請連結才能查看您的數據。您可以複製連結並通過電郵或其他方式發送給教練。
          </p>
        </div>
      </div>
    </div>
  );
}
