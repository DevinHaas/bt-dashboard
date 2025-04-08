"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserUploadsTable } from "@/components/admin/user-uploads-table";
import { MissingUploadsTable } from "@/components/admin/missing-uploads-table";
import { useUserUploadData } from "@/hooks/useUserData";
import { useIsAdmin } from "@/hooks/useAuth";
import { SignInButton } from "@clerk/nextjs";

export default function AdminDashboard() {
  const { data: isAdmin } = useIsAdmin();
  const [activeTab, setActiveTab] = useState("all-users");

  const { data: userUploadData, isLoading, error } = useUserUploadData();

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading user data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-10">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              You are not permitted to view this data
            </CardTitle>
            <CardDescription>
              You have to be logged in as a admin to view this page
            </CardDescription>
            <CardFooter>
              <SignInButton />
            </CardFooter>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error && userUploadData == undefined) {
    return (
      <div className="container mx-auto py-10">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Data
            </CardTitle>
            <CardDescription>
              There was a problem loading the user upload data. Please try again
              later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Screenshot Upload Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor user screenshot uploads and identify users who need follow-up.
        </p>
      </div>

      <Tabs
        defaultValue="all-users"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="missing-uploads">Missing Uploads</TabsTrigger>
        </TabsList>
        <TabsContent value="all-users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Upload History</CardTitle>
              <CardDescription>
                View all users and their screenshot upload history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserUploadsTable data={userUploadData!} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="missing-uploads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users Without Recent Uploads</CardTitle>
              <CardDescription>
                These users have not uploaded screenshots recently and may need
                follow-up.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MissingUploadsTable data={userUploadData!} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
