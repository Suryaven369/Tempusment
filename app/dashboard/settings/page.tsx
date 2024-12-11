"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/lib/currency/utils";
import { CurrencyInput } from "@/components/ui/currency-input";
import { CurrencySelect } from "@/components/ui/currency-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, 
  Save, 
  Copy, 
  Link2,
  Moon,
  Sun,
  Laptop,
  Lock,
  Mail,
  Phone,
  Globe,
  MapPin,
  DollarSign,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import {
  updateBusinessSettings,
  updateNotificationSettings,
  updateBookingSettings,
  updateSecuritySettings,
  updateThemeSetting,
} from "@/lib/firebase-settings";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { user } = useAuth();
  const { settings, loading: settingsLoading } = useSettings();

  const [businessSettings, setBusinessSettings] = useState(settings?.business || {
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    currency: "USD",
    timezone: "America/New_York",
  });

  const [notificationSettings, setNotificationSettings] = useState(settings?.notifications || {
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
    reminderTime: "24",
  });

  const [bookingSettings, setBookingSettings] = useState(settings?.booking || {
    enabled: true,
    requireApproval: true,
    allowCancellations: true,
    cancellationWindow: "24",
    maxAdvanceBooking: "30",
    minAdvanceBooking: "24",
  });

  const [securitySettings, setSecuritySettings] = useState(settings?.security || {
    twoFactorAuth: false,
    passwordResetInterval: "never",
    sessionTimeout: "24h",
  });

  useEffect(() => {
    if (settings) {
      setBusinessSettings(settings.business);
      setNotificationSettings(settings.notifications);
      setBookingSettings(settings.booking);
      setSecuritySettings(settings.security);
      setTheme(settings.theme);
    }
  }, [settings, setTheme]);

  const handleSaveBusinessSettings = async () => {
    setLoading(true);
    try {
      await updateBusinessSettings(businessSettings);
      toast({
        title: "Success",
        description: "Business settings updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update business settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    setLoading(true);
    try {
      await updateNotificationSettings(notificationSettings);
      toast({
        title: "Success",
        description: "Notification settings updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update notification settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBookingSettings = async () => {
    setLoading(true);
    try {
      await updateBookingSettings(bookingSettings);
      toast({
        title: "Success",
        description: "Booking settings updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    setLoading(true);
    try {
      await updateSecuritySettings(securitySettings);
      toast({
        title: "Success",
        description: "Security settings updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update security settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    try {
      await updateThemeSetting(newTheme);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update theme setting.",
        variant: "destructive",
      });
    }
  };

  const getBookingLink = () => {
    if (!user?.uid) return "";
    return `${window.location.origin}/book/${user.uid}`;
  };

  const copyBookingLink = async () => {
    const link = getBookingLink();
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Success",
        description: "Booking link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy booking link.",
        variant: "destructive",
      });
    }
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your business preferences and application settings
        </p>
      </div>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList>
          <TabsTrigger value="business">Business Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="booking">Online Booking</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Business Profile Tab */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                Manage your business information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input
                      value={businessSettings.name}
                      onChange={(e) =>
                        setBusinessSettings({ ...businessSettings, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex">
                      <Mail className="w-4 h-4 text-muted-foreground mr-2 mt-2.5" />
                      <Input
                        type="email"
                        value={businessSettings.email}
                        onChange={(e) =>
                          setBusinessSettings({ ...businessSettings, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="flex">
                      <Phone className="w-4 h-4 text-muted-foreground mr-2 mt-2.5" />
                      <Input
                        type="tel"
                        value={businessSettings.phone}
                        onChange={(e) =>
                          setBusinessSettings({ ...businessSettings, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <div className="flex">
                      <Globe className="w-4 h-4 text-muted-foreground mr-2 mt-2.5" />
                      <Input
                        value={businessSettings.website}
                        onChange={(e) =>
                          setBusinessSettings({ ...businessSettings, website: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="flex">
                    <MapPin className="w-4 h-4 text-muted-foreground mr-2 mt-2.5" />
                    <Input
                      value={businessSettings.address}
                      onChange={(e) =>
                        setBusinessSettings({ ...businessSettings, address: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <div className="flex">
                      <DollarSign className="w-4 h-4 text-muted-foreground mr-2 mt-2.5" />
                      <Select
                        value={businessSettings.currency}
                        onValueChange={(value) =>
                          setBusinessSettings({ ...businessSettings, currency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <div className="flex">
                      <Clock className="w-4 h-4 text-muted-foreground mr-2 mt-2.5" />
                      <Select
                        value={businessSettings.timezone}
                        onValueChange={(value) =>
                          setBusinessSettings({ ...businessSettings, timezone: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSaveBusinessSettings}
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        smsNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminders before appointments
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.appointmentReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        appointmentReminders: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive marketing and promotional emails
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        marketingEmails: checked,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reminder Time</Label>
                  <Select
                    value={notificationSettings.reminderTime}
                    onValueChange={(value) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        reminderTime: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reminder time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 hours before</SelectItem>
                      <SelectItem value="48">48 hours before</SelectItem>
                      <SelectItem value="72">72 hours before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSaveNotificationSettings}
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Online Booking Tab */}
        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Online Booking Settings</CardTitle>
              <CardDescription>
                Configure your online booking preferences and share your booking link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Booking Link</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={getBookingLink()}
                      className="bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyBookingLink}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share this link with your clients to allow them to book appointments directly
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Online Booking</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow clients to book appointments online
                      </p>
                    </div>
                    <Switch
                      checked={bookingSettings.enabled}
                      onCheckedChange={(checked) =>
                        setBookingSettings({ ...bookingSettings, enabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Approval</Label>
                      <p className="text-sm text-muted-foreground">
                        Review and approve bookings before confirmation
                      </p>
                    </div>
                    <Switch
                      checked={bookingSettings.requireApproval}
                      onCheckedChange={(checked) =>
                        setBookingSettings({ ...bookingSettings, requireApproval: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Cancellations</Label>
                      <p className="text-sm text-muted-foreground">
                        Let clients cancel their appointments online
                      </p>
                    </div>
                    <Switch
                      checked={bookingSettings.allowCancellations}
                      onCheckedChange={(checked) =>
                        setBookingSettings({ ...bookingSettings, allowCancellations: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cancellation Window</Label>
                    <Select
                      value={bookingSettings.cancellationWindow}
                      onValueChange={(value) =>
                        setBookingSettings({ ...bookingSettings, cancellationWindow: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cancellation window" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 hours before</SelectItem>
                        <SelectItem value="48">48 hours before</SelectItem>
                        <SelectItem value="72">72 hours before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum Advance Booking</Label>
                    <Select
                      value={bookingSettings.maxAdvanceBooking}
                      onValueChange={(value) =>
                        setBookingSettings({ ...bookingSettings, maxAdvanceBooking: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select maximum advance booking" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Advance Notice</Label>
                    <Select
                      value={bookingSettings.minAdvanceBooking}
                      onValueChange={(value) =>
                        setBookingSettings({ ...bookingSettings, minAdvanceBooking: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select minimum advance notice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                        <SelectItem value="72">72 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleSaveBookingSettings}
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setTheme("system")}
                    >
                      <Laptop className="mr-2 h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: checked,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password Reset Interval</Label>
                  <Select
                    value={securitySettings.passwordResetInterval}
                    onValueChange={(value) =>
                      setSecuritySettings({
                        ...securitySettings,
                        passwordResetInterval: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select password reset interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="30days">Every 30 days</SelectItem>
                      <SelectItem value="60days">Every 60 days</SelectItem>
                      <SelectItem value="90days">Every 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select session timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="8h">8 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSaveSecuritySettings}
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

