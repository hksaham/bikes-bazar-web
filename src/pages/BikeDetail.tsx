import { useParams, Link } from "react-router-dom";
import { formatPrice } from "@/lib/inventory";
import { useBikeById } from "@/hooks/use-bikes";
import Header from "@/components/Header";
import BikeGallery from "@/components/BikeGallery";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BikeDetail() {
  const { id } = useParams<{ id: string }>();
  const { bike, loading } = useBikeById(id || "");

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 md:pt-24 container grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-8 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Bike not found</p>
          <Link to="/" className="text-accent hover:underline">Go back</Link>
        </div>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in the ${bike.model} (${bike.year}) listed at Bikes Bazar.`);
  const whatsappUrl = `https://wa.me/8801856476200?text=${whatsappMsg}`;
  const callUrl = "tel:+8801856476200";

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header />

      <div className="pt-20 md:pt-24">
        <div className="container mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors haptic">
            <ArrowLeft size={16} />
            Back to inventory
          </Link>
        </div>

        <div className="container grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <BikeGallery
              bikeId={bike.id}
              mainImage={bike.mainImage}
              localGallery={bike.gallery}
              sold={bike.sold}
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-accent">{bike.brand} · {bike.type}</p>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-2">{bike.model}</h1>
            <p className="text-muted-foreground mt-1">{bike.year} · {bike.condition}</p>

            <div className="mt-6">
              {bike.discountPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-accent">{formatPrice(bike.discountPrice)}</span>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(bike.price)}</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-foreground">{formatPrice(bike.price)}</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: "Engine", value: bike.engine },
                { label: "Mileage", value: bike.mileage },
                { label: "Condition", value: bike.condition },
              ].map((s) => (
                <div key={s.label} className="bg-secondary rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground leading-relaxed mt-8">{bike.description}</p>

            {!bike.sold && (
              <div className="hidden md:flex gap-4 mt-8">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[hsl(142_70%_40%)] text-foreground font-semibold py-3.5 rounded-lg haptic hover:opacity-90 transition-opacity">
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
                <a href={callUrl} className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold py-3.5 rounded-lg haptic hover:bg-muted transition-colors">
                  <Phone size={18} />
                  Call Showroom
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {!bike.sold && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden glass-heavy p-4 flex gap-3 z-50">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[hsl(142_70%_40%)] text-foreground font-semibold py-3 rounded-lg haptic text-sm">
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <a href={callUrl} className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold py-3 rounded-lg haptic text-sm">
            <Phone size={16} />
            Call
          </a>
        </div>
      )}
    </div>
  );
}
