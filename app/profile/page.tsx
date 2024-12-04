"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/hooks/use-settings";
import { updateBusinessSettings } from "@/lib/firebase-settings";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

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

  // Update local state when settings are loaded
  useEffect(() => {
    if (settings?.business) {
      setBusinessSettings(settings.business);
    }
  }, [settings]);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setBusinessSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested object changes (social links, business hours)
  const handleNestedChange = (parent: string, field: string, value: string) => {
    setBusinessSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Handle save
  const handleSave = async () => {
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
        <Loader2 className="h-8 w-8 animate-spin" />
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
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={businessSettings.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={businessSettings.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={businessSettings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={businessSettings.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
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
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="A brief, catchy description of your business"
                />
              </div>
              <div className="space-y-2">
                <Label>About</Label>
                <Textarea
                  value={businessSettings.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  placeholder="Tell your story and describe your business"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input
                  value={businessSettings.coverImage}
                  onChange={(e) => handleInputChange('coverImage', e.target.value)}
                  placeholder="URL to your banner image"
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={businessSettings.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
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
                    onChange={(e) => handleNestedChange('businessHours', day, e.target.value)}
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
                  onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                  placeholder="Facebook profile URL"
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={businessSettings.socialLinks?.instagram || ""}
                  onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                  placeholder="Instagram profile URL"
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter</Label>
                <Input
                  value={businessSettings.socialLinks?.twitter || ""}
                  onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                  placeholder="Twitter profile URL"
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  value={businessSettings.socialLinks?.linkedin || ""}
                  onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)}
                  placeholder="LinkedIn profile URL"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full md:w-auto"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
}