import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { api } from '../../components/lib/api';
import { Loader2, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/change-password', { password });
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to update password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
             <ShieldCheck className="w-8 h-8 text-blue-600" />
             Security Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your account security and password</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-gray-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b bg-gray-50/50 pb-6">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Update Password
                </CardTitle>
                <CardDescription>
                  Choose a strong password to protect your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">New Password</label>
                    <div className="relative group">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12 h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Must be at least 6 characters long.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                    <div className="relative group">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12 h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 hidden sm:block">
                      Updating your password will keep your logged-in session active.
                    </p>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 h-11 transition-all duration-200 shadow-sm whitespace-nowrap"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border-blue-100 bg-blue-50/50 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-blue-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  Password Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4 opacity-80">
                  <li>Use at least 8 characters</li>
                  <li>Mix letters, numbers and symbols</li>
                  <li>Avoid using common phrases or names</li>
                  <li>Update your password every 3-6 months</li>
                </ul>
              </CardContent>
            </Card>

            <div className="p-1 px-4 text-xs text-gray-400">
              Last password change was not recorded. Change now to secure your account.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
