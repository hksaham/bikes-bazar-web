import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { type Bike, formatPrice } from "@/lib/inventory";
import { Badge } from "@/components/ui/badge";

interface BikeCardProps {
  bike: Bike;
  index: number;
}

export default function BikeCard({ bike, index }: BikeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/bike/${bike.id}`} className="group block">
        <div className={`relative rounded-lg overflow-hidden bg-card ${bike.sold ? "sold-overlay" : ""}`}>
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden">
            <motion.img
              src={bike.image}
              alt={bike.model}
              loading="lazy"
              width={800}
              height={600}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* SOLD badge */}
          {bike.sold && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <Badge className="bg-destructive text-destructive-foreground text-lg px-6 py-2 font-bold tracking-wider">
                SOLD
              </Badge>
            </div>
          )}

          {/* Discount badge */}
          {bike.discountPrice && !bike.sold && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-accent text-accent-foreground font-semibold">
                SALE
              </Badge>
            </div>
          )}

          {/* Info */}
          <div className="p-4 md:p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{bike.brand} · {bike.year}</p>
                <h3 className="text-foreground font-semibold text-lg mt-1">{bike.model}</h3>
              </div>
              <div className="text-right">
                {bike.discountPrice ? (
                  <>
                    <p className="text-xs text-muted-foreground line-through">{formatPrice(bike.price)}</p>
                    <p className="text-accent font-bold">{formatPrice(bike.discountPrice)}</p>
                  </>
                ) : (
                  <p className="text-foreground font-bold">{formatPrice(bike.price)}</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
              <span>{bike.engine}</span>
              <span>·</span>
              <span>{bike.mileage}</span>
              <span>·</span>
              <span>{bike.condition}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
