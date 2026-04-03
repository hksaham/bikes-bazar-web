import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Bike } from "@/lib/inventory";

interface DbBike {
  id: string;
  model: string;
  brand: string;
  type: string;
  year: number;
  price: number;
  discount_price: number | null;
  main_image: string;
  gallery: string[] | null;
  mileage: string;
  engine: string;
  condition: string;
  description: string;
  sold: boolean;
}

function mapDbBike(row: DbBike): Bike {
  return {
    id: row.id,
    model: row.model,
    brand: row.brand,
    type: row.type as Bike["type"],
    year: row.year,
    price: row.price,
    discountPrice: row.discount_price,
    image: row.main_image,
    mainImage: row.main_image,
    gallery: row.gallery || [],
    mileage: row.mileage,
    engine: row.engine,
    condition: row.condition,
    description: row.description,
    sold: row.sold,
  };
}

export function useBikes() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      const { data, error } = await supabase.from("bikes").select("*");
      if (error) {
        console.error("Error fetching bikes:", error);
      }
      if (data) {
        setBikes(data.map((r) => mapDbBike(r as unknown as DbBike)));
      }
      setLoading(false);
    };
    fetchBikes();

    const channel = supabase
      .channel("bikes-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bikes" },
        (payload) => {
          console.log("Realtime INSERT:", payload);
          setBikes((prev) => [...prev, mapDbBike(payload.new as DbBike)]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bikes" },
        (payload) => {
          console.log("Realtime UPDATE:", payload);
          setBikes((prev) =>
            prev.map((b) =>
              b.id === (payload.new as DbBike).id
                ? mapDbBike(payload.new as DbBike)
                : b
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bikes" },
        (payload) => {
          console.log("Realtime DELETE:", payload);
          setBikes((prev) =>
            prev.filter((b) => b.id !== (payload.old as DbBike).id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { bikes, loading };
}

export function useBikeById(id: string) {
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBike = async () => {
      const { data, error } = await supabase
        .from("bikes")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) console.error("Error fetching bike:", error);
      if (data) setBike(mapDbBike(data as unknown as DbBike));
      setLoading(false);
    };
    fetchBike();

    const channel = supabase
      .channel(`bike-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bikes", filter: `id=eq.${id}` },
        (payload) => {
          console.log("Realtime bike UPDATE:", payload);
          setBike(mapDbBike(payload.new as DbBike));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bikes", filter: `id=eq.${id}` },
        (payload) => {
          console.log("Realtime bike DELETE:", payload);
          setBike(null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { bike, loading };
}
