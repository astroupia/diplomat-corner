import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdvertisementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real application, you would fetch the advertisement data based on the ID
  const ad = {
    id: params.id,
    name: "Summer Sale - 20% Off All Cars",
    company: "Diplomat Corner",
    product: "Cars",
    status: "active",
    priority: "high",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    type: "wide",
    description: "Promotional campaign for summer car sales",
    tags: ["#cars", "#sale", "#summer"],
    image: "/placeholder.svg",
    impressions: 12000,
    clicks: 450,
    createdAt: "2024-01-15T09:24:00",
    updatedAt: "2024-01-16T14:45:00",
  };

  return (
    <div className="main-content space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/advertisements">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-diplomat-green">
            {ad.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={ad.status === "active" ? "bg-green-500" : "bg-gray-500"}
          >
            {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
          </Badge>
          <Button variant="outline" size="icon">
            {ad.status === "active" ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Advertisement Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">ID:</span>
              <span>{ad.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Company:</span>
              <span>{ad.company}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Product:</span>
              <span>{ad.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Type:</span>
              <span className="capitalize">{ad.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Priority:</span>
              <span className="capitalize">{ad.priority}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Start Date:</span>
              <span>{new Date(ad.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">End Date:</span>
              <span>{new Date(ad.endDate).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Impressions:</span>
              <span>{ad.impressions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Clicks:</span>
              <span>{ad.clicks.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Click Rate:</span>
              <span>{((ad.clicks / ad.impressions) * 100).toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[3/1] rounded-lg overflow-hidden">
              <Image
                src={ad.image || "/placeholder.svg"}
                alt="Advertisement preview"
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{ad.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ad.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Delete</Button>
        <Button variant="default">Edit Advertisement</Button>
      </div>
    </div>
  );
}
