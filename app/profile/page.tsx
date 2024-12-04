"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/hooks/use-settings";
import { updateBusinessSettings } from "@/lib/firebase-settings";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [businessSettings, setBusinessSettings] = useState(settings?.business || {
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    tagline: "",
    about: "",
    coverImage: "",
    logo: "",
    businessHours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    socialLinks: {}
  });

  const handleSaveBusinessSettings = async () => {
    setSaving(true);
    try {
      await updateBusinessSettings(businessSettings);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-4xl">
            {user?.email?.[0].toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{businessSettings.name || "Your Business"}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="landing">Landing Page</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Update your basic business information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input
                  value={businessSettings.name}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={businessSettings.email}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={businessSettings.phone}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={businessSettings.address}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={businessSettings.website}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, website: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="landing">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Content</CardTitle>
              <CardDescription>Customize your public booking page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input
                  value={businessSettings.tagline}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, tagline: e.target.value })}
                  placeholder="A brief, catchy description of your business"
                />
              </div>
              <div className="space-y-2">
                <Label>About</Label>
                <Textarea
                  value={businessSettings.about}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, about: e.target.value })}
                  placeholder="Tell your story and describe your business"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input
                  value={businessSettings.coverImage}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, coverImage: e.target.value })}
                  placeholder="URL to your banner image"
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={businessSettings.logo}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, logo: e.target.value })}
                  placeholder="URL to your business logo"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your operating hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(businessSettings.businessHours || {}).map(([day, hours]) => (
                <div key={day} className="space-y-2">
                  <Label className="capitalize">{day}</Label>
                  <Input
                    value={hours}
                    onChange={(e) => setBusinessSettings({
                      ...businessSettings,
                      businessHours: {
                        ...businessSettings.businessHours,
                        [day]: e.target.value
                      }
                    })}
                    placeholder="e.g., 9:00 AM - 5:00 PM or Closed"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input
                  value={businessSettings.socialLinks?.facebook || ""}
                  onChange={(e) => setBusinessSettings({
                    ...businessSettings,
                    socialLinks: {
                      ...businessSettings.socialLinks,
                      facebook: e.target.value
                    }
                  })}
                  placeholder="Facebook profile URL"
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={businessSettings.socialLinks?.instagram || ""}
                  onChange={(e) => setBusinessSettings({
                    ...businessSettings,
                    socialLinks: {
                      ...businessSettings.socialLinks,
                      instagram: e.target.value
                    }
                  })}
                  placeholder="Instagram profile URL"
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter</Label>
                <Input
                  value={businessSettings.socialLinks?.twitter || ""}
                  onChange={(e) => setBusinessSettings({
                    ...businessSettings,
                    socialLinks: {
                      ...businessSettings.socialLinks,
                      twitter: e.target.value
                    }
                  })}
                  placeholder="Twitter profile URL"
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  value={businessSettings.socialLinks?.linkedin || ""}
                  onChange={(e) => setBusinessSettings({
                    ...businessSettings,
                    socialLinks: {
                      ...businessSettings.socialLinks,
                      linkedin: e.target.value
                    }
                  })}
                  placeholder="LinkedIn profile URL"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button 
          onClick={handleSaveBusinessSettings} 
          disabled={saving}
          className="w-full"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}