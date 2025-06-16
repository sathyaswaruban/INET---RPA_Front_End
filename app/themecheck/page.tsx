"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@radix-ui/react-checkbox";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Select } from "@radix-ui/react-select";
import { useTheme } from "next-themes";

export default function ComponentShowcase() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">UI Components Showcase</h1>
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
      <p className="font-light">Extra Light (200)</p>
      <p className="font-normal">Regular (400)</p>
      <p className="font-medium">Medium (500)</p>
      <p className="font-semibold italic">Semi Bold Italic (600)</p>
      <p className="font-bold">Bold (700)</p>
      <p className="font-black">Black (900)</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Tailwind Components */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold border-b pb-2">Tailwind Components</h2>

          {/* Buttons */}
          <section>
            <h3 className="text-xl font-medium mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Primary</button>
              <button className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground">Secondary</button>
              <button className="px-4 py-2 rounded-md bg-accent text-accent-foreground">Accent</button>
              <button className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground">Destructive</button>
              <button className="px-4 py-2 rounded-md border border-border">Outline</button>
              <button className="px-4 py-2 rounded-md bg-muted text-muted-foreground">Muted</button>
            </div>
          </section>

          {/* Cards */}
          <section>
            <h3 className="text-xl font-medium mb-4">Cards</h3>
            <div className="grid gap-4">
              <div className="border rounded-lg p-6 bg-card text-card-foreground">
                <h4 className="font-medium mb-2">Default Card</h4>
                <p className="text-muted-foreground">This is a card with default styling</p>
              </div>
              <div className="border rounded-lg p-6 bg-accent text-accent-foreground">
                <h4 className="font-medium mb-2">Accent Card</h4>
                <p>This card uses accent colors</p>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h3 className="text-xl font-medium mb-4">Typography</h3>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <h2 className="text-3xl font-bold">Heading 2</h2>
              <h3 className="text-2xl font-bold">Heading 3</h3>
              <h4 className="text-xl font-bold">Heading 4</h4>
              <p className="text-base">Regular text</p>
              <p className="text-sm text-muted-foreground">Muted text</p>
              <p className="text-xs text-destructive">Small destructive text</p>
            </div>
          </section>

          {/* Form Elements */}
          <section>
            <h3 className="text-xl font-medium mb-4">Form Elements</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Input</label>
                <input type="text" placeholder="Enter text" className="w-full px-3 py-2 border rounded-md bg-input" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Textarea</label>
                <textarea placeholder="Enter text" className="w-full px-3 py-2 border rounded-md bg-input" rows={3} />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 border rounded" />
                  <span>Checkbox</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input type="radio" name="radio-group" className="w-4 h-4 border rounded-full" />
                  <span>Radio Option 1</span>
                </label>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Select</label>
                <select className="w-full px-3 py-2 border rounded-md bg-input">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
            </div>
          </section>

          {/* Alerts & Badges */}
          <section>
            <h3 className="text-xl font-medium mb-4">Alerts & Badges</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-primary/10 text-primary-foreground border border-primary/20">
                <p>Primary alert</p>
              </div>
              <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground border border-destructive/20">
                <p>Destructive alert</p>
              </div>

              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-primary text-primary-foreground">Primary</span>
                <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">Secondary</span>
                <span className="px-2 py-1 text-xs rounded-full bg-destructive text-destructive-foreground">Destructive</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - shadcn Components */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold border-b pb-2">shadcn Components</h2>

          {/* Buttons */}
          <section>
            <h3 className="text-xl font-medium mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              {/* <Button variant="accent">Accent</Button> */}
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </section>

          {/* Cards */}
          <section>
            <h3 className="text-xl font-medium mb-4">Cards</h3>
            <div className="grid gap-4">
              <Card className="p-6">
                <h4 className="font-medium mb-2">Default Card</h4>
                <p className="text-muted-foreground">This is a card with default styling</p>
              </Card>
              <Card className="p-6 bg-accent text-accent-foreground">
                <h4 className="font-medium mb-2">Accent Card</h4>
                <p>This card uses accent colors</p>
              </Card>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h3 className="text-xl font-medium mb-4">Typography</h3>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <h2 className="text-3xl font-bold">Heading 2</h2>
              <h3 className="text-2xl font-bold">Heading 3</h3>
              <h4 className="text-xl font-bold">Heading 4</h4>
              <p className="text-base">Regular text</p>
              <p className="text-sm text-muted-foreground">Muted text</p>
              <p className="text-xs text-destructive">Small destructive text</p>
            </div>
          </section>

          {/* Form Elements */}
          <section>
            <h3 className="text-xl font-medium mb-4">Form Elements</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Input</Label>
                <Input type="text" placeholder="Enter text" />
              </div>

              <div className="space-y-2">
                <Label>Textarea</Label>
                <Textarea placeholder="Enter text" />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>

              <RadioGroup defaultValue="option-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-1" id="option-1" />
                  <Label htmlFor="option-1">Option 1</Label>
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <Label>Select</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option-1">Option 1</SelectItem>
                    <SelectItem value="option-2">Option 2</SelectItem>
                    <SelectItem value="option-3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Alerts & Badges */}
          <section>
            <h3 className="text-xl font-medium mb-4">Alerts & Badges</h3>
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>This is a default alert component.</AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertTitle>Destructive Alert</AlertTitle>
                <AlertDescription>This is a destructive alert component.</AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>
          </section>

          {/* Additional shadcn Components */}
          <section>
            <h3 className="text-xl font-medium mb-4">Additional Components</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </div>

              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">User Name</p>
                  <p className="text-sm text-muted-foreground">user@example.com</p>
                </div>
              </div>

              <Progress value={33} className="w-full" />

              <Tabs defaultValue="account" className="w-full">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
