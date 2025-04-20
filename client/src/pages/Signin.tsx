import { useState } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Demo version - simulate sign in
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Sign-in successful",
        description: "Welcome back to Deep Travel Collections!",
      });
    }, 1500);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Demo version - simulate sign up
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created",
        description: "Welcome to Deep Travel Collections!",
      });
    }, 1500);
  };

  const handleSocialSignIn = (provider: string) => {
    setIsLoading(true);
    
    // Demo version - simulate social sign in
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: `${provider} sign-in successful`,
        description: "Welcome to Deep Travel Collections!",
      });
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your premium travel itineraries
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        className="pl-10" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        className="pl-10" 
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        className="pl-10" 
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex flex-col space-y-4 pb-5">
            <div className="flex items-center w-full">
              <Separator className="flex-1" />
              <span className="px-4 text-sm text-gray-500">OR</span>
              <Separator className="flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button 
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => handleSocialSignIn('Google')}
                disabled={isLoading}
              >
                <FaGoogle className="mr-2" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-800 text-blue-800 hover:bg-blue-50"
                onClick={() => handleSocialSignIn('Facebook')}
                disabled={isLoading}
              >
                <FaFacebook className="mr-2" />
                Facebook
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our {' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '} and {' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}