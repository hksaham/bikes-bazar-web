import inventoryData from "@/data/inventory.json";

export interface Bike {
  id: string;
  model: string;
  brand: string;
  type: "Sports" | "Commuter" | "Scooter";
  year: number;
  price: number;
  discountPrice: number | null;
  image: string;
  mainImage: string;
  gallery: string[];
  mileage: string;
  engine: string;
  condition: string;
  description: string;
  sold: boolean;
}

export interface Filters {
  brand?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export function getInventory(): Bike[] {
  return (inventoryData as any[]).map((b) => ({
    ...b,
    mainImage: b.mainImage || b.image,
    gallery: b.gallery || [],
  })) as Bike[];
}

export function getBikeById(id: string): Bike | undefined {
  const bike = (inventoryData as any[]).find((b) => b.id === id);
  if (!bike) return undefined;
  return {
    ...bike,
    mainImage: bike.mainImage || bike.image,
    gallery: bike.gallery || [],
  } as Bike;
}

export function filterBikes(bikes: Bike[], filters: Filters): Bike[] {
  return bikes.filter((bike) => {
    if (filters.brand && bike.brand !== filters.brand) return false;
    if (filters.type && bike.type !== filters.type) return false;
    if (filters.minPrice && bike.price < filters.minPrice) return false;
    if (filters.maxPrice && bike.price > filters.maxPrice) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!bike.model.toLowerCase().includes(q) && !bike.brand.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export function formatPrice(price: number): string {
  return "৳" + price.toLocaleString("en-BD");
}
