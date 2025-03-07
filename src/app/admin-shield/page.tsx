import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Lock, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access the Diplomat Corner admin panel
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form action="#" method="POST" className="space-y-6">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="mt-1">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full">
                    Sign in
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex-1 hidden w-0 lg:block">
        <div className="absolute inset-0 flex flex-col justify-center p-12 bg-diplomat-green">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Welcome to Diplomat Corner Admin
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Secure Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Protect your admin panel with robust authentication
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Efficient Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Streamline your product and advertisement management
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="w-5 h-5 mr-2" />
                  Insightful Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gain valuable insights with comprehensive statistics
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Role-based Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Control access with customizable user roles and permissions
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 text-center">
            <Link href="/admin/dashboard" passHref>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-diplomat-green"
              >
                Explore Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
