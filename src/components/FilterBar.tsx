import { type Filters } from "@/lib/inventory";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const brands = ["Yamaha", "Honda", "Suzuki", "TVS", "Bajaj", "Hero"];
const types = ["Sports", "Commuter", "Scooter"];

interface FilterBarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const [open, setOpen] = useState(false);

  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const clear = () => onChange({});

  const hasFilters = filters.brand || filters.type || filters.search;

  return (
    <div className="space-y-4">
      {/* Search + toggle */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search bikes..."
            value={filters.search || ""}
            onChange={(e) => update({ search: e.target.value || undefined })}
            className="w-full bg-secondary border-none rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className={`px-4 rounded-lg haptic transition-colors flex items-center gap-2 text-sm ${
            open ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
        </button>
        {hasFilters && (
          <button
            onClick={clear}
            className="px-3 rounded-lg bg-secondary text-muted-foreground hover:text-foreground haptic transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-lg p-4 md:p-6 space-y-4">
              {/* Brand */}
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Brand</p>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => update({ brand: filters.brand === b ? undefined : b })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium haptic transition-colors ${
                        filters.brand === b
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-muted"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Type</p>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => update({ type: filters.type === t ? undefined : t })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium haptic transition-colors ${
                        filters.type === t
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-muted"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
