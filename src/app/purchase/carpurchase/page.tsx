import CarPurchase from "@/components/purchase/carpurchase";

interface CarPurchasePageProps {
  params: { id: string };
}

export default function CarPurchasePage({ params }: CarPurchasePageProps) {
  return <CarPurchase params={params} />;
}

export const dynamic = "force-dynamic";