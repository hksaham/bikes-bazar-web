import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";

export default function HeroSection() {
  const scrollToInventory = () => {
    document.getElementById("inventory")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax BG */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        <img
          src={heroBg}
          alt="Premium motorcycle showroom"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-sm md:text-base uppercase tracking-[0.3em] text-accent mb-4"
        >
          Cox's Bazar's Premium Showroom
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-6 flex justify-center"
        >
          <img src={logo} alt="Bikes Bazar" className="h-28 md:h-44 lg:h-56 w-auto drop-shadow-2xl" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto mb-10"
        >
          Reconditioned excellence. Every bike inspected, certified, and ready to ride.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          onClick={scrollToInventory}
          className="px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm rounded-full haptic hover:opacity-90 transition-opacity"
        >
          Explore Inventory
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </div>
      </motion.div>
    </section>
  );
}
