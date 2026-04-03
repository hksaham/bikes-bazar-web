import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BikeCard from "@/components/BikeCard";
import FilterBar from "@/components/FilterBar";
import { filterBikes, type Filters } from "@/lib/inventory";
import { useBikes } from "@/hooks/use-bikes";
import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Index() {
  const [filters, setFilters] = useState<Filters>({});
  const { bikes, loading } = useBikes();
  const filtered = useMemo(() => filterBikes(bikes, filters), [bikes, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      {/* Inventory */}
      <section id="inventory" className="container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Our Collection</h2>
          <p className="text-muted-foreground mb-8">
            {loading ? "Loading..." : `${filtered.length} bike${filtered.length !== 1 ? "s" : ""} available`}
          </p>
        </motion.div>

        <FilterBar filters={filters} onChange={setFilters} />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filtered.map((bike, i) => (
              <BikeCard key={bike.id} bike={bike} index={i} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No bikes match your filters.</p>
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="border-t border-border">
        <div className="container py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">About Bikes Bazar</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Located in the heart of Cox's Bazar, Bikes Bazar is your trusted destination for premium reconditioned motorcycles. Every bike undergoes a rigorous 50-point inspection before it hits our showroom floor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                Main Road, Cox's Bazar
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-accent" />
                +880 1856476200
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bikes Bazar. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
