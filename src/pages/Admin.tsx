import { useState } from "react";
import Header from "@/components/Header";
import { type Bike, formatPrice } from "@/lib/inventory";
import { useBikes } from "@/hooks/use-bikes";
import { supabase } from "@/integrations/supabase/client";
import { listBikeImages } from "@/lib/storage";
import ImageUploader from "@/components/ImageUploader";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Lock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASS = "bikesbazar2024";

interface BikeForm {
  model: string;
  brand: string;
  type: string;
  year: string;
  price: string;
  discountPrice: string;
  mileage: string;
  engine: string;
  condition: string;
  description: string;
  sold: boolean;
  galleryImages: string[];
}

const emptyForm: BikeForm = {
  model: "", brand: "", type: "Sports", year: "2024", price: "",
  discountPrice: "", mileage: "", engine: "",
  condition: "Excellent", description: "", sold: false, galleryImages: [],
};

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { bikes } = useBikes();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<BikeForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setAuthenticated(true);
    } else {
      toast({ title: "Wrong password", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    if (!form.model || !form.brand || !form.price) {
      toast({ title: "Fill required fields", variant: "destructive" });
      return;
    }

    setSaving(true);

    const dbData = {
      model: form.model,
      brand: form.brand,
      type: form.type,
      year: parseInt(form.year),
      price: parseInt(form.price),
      discount_price: form.discountPrice ? parseInt(form.discountPrice) : null,
      main_image: form.galleryImages[0] || "/bikes/placeholder.jpg",
      gallery: form.galleryImages.slice(1),
      mileage: form.mileage,
      engine: form.engine,
      condition: form.condition,
      description: form.description,
      sold: form.sold,
    };

    try {
      if (editing) {
        const { error } = await supabase
          .from("bikes")
          .update(dbData)
          .eq("id", editing);
        if (error) throw error;
        toast({ title: "Bike updated" });
      } else {
        const { error } = await supabase
          .from("bikes")
          .insert(dbData);
        if (error) throw error;
        toast({ title: "Bike added" });
      }

      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (err: any) {
      console.error("Save error:", err);
      toast({ title: "Save failed: " + (err.message || "Unknown error"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (bike: Bike) => {
    setEditing(bike.id);

    let existingImages: string[] = [];
    try {
      existingImages = await listBikeImages(bike.id);
    } catch {
      existingImages = [bike.mainImage, ...bike.gallery].filter(Boolean);
    }

    setForm({
      model: bike.model,
      brand: bike.brand,
      type: bike.type,
      year: String(bike.year),
      price: String(bike.price),
      discountPrice: bike.discountPrice ? String(bike.discountPrice) : "",
      mileage: bike.mileage,
      engine: bike.engine,
      condition: bike.condition,
      description: bike.description,
      sold: bike.sold,
      galleryImages: existingImages.length > 0 ? existingImages : [bike.mainImage, ...bike.gallery].filter(Boolean),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("bikes").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", variant: "destructive" });
    } else {
      toast({ title: "Bike removed" });
    }
  };

  const toggleSold = async (id: string, currentSold: boolean) => {
    const { error } = await supabase
      .from("bikes")
      .update({ sold: !currentSold })
      .eq("id", id);
    if (error) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <motion.form
            onSubmit={handleLogin}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-xl p-8 w-full max-w-sm space-y-4"
          >
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Lock size={20} className="text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground text-center">Admin Access</h2>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button type="submit" className="w-full bg-foreground text-background font-semibold py-3 rounded-lg haptic hover:bg-accent hover:text-accent-foreground transition-colors text-sm">
              Login
            </button>
          </motion.form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg haptic text-sm font-medium"
          >
            <Plus size={16} />
            Add Bike
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {editing ? "Edit Bike" : "Add New Bike"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "model", label: "Model *", type: "text" },
                { key: "brand", label: "Brand *", type: "text" },
                { key: "type", label: "Type", type: "select", options: ["Sports", "Commuter", "Scooter"] },
                { key: "year", label: "Year", type: "text" },
                { key: "price", label: "Price *", type: "number" },
                { key: "discountPrice", label: "Discount Price", type: "number" },
                { key: "engine", label: "Engine", type: "text" },
                { key: "mileage", label: "Mileage", type: "text" },
                { key: "condition", label: "Condition", type: "select", options: ["Like New", "Excellent", "Good", "Fair"] },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full bg-secondary rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      {field.options!.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full bg-secondary rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  )}
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-secondary rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>

              {/* Image Uploader */}
              <div className="sm:col-span-2">
                <ImageUploader
                  bikeId={editing || String(Date.now())}
                  images={form.galleryImages}
                  onImagesChange={(imgs) => setForm({ ...form, galleryImages: imgs })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-foreground text-background px-6 py-2.5 rounded-lg haptic text-sm font-medium flex items-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? "Saving..." : editing ? "Update" : "Add"}
              </button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-lg haptic text-sm">
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Bike list */}
        <div className="space-y-3">
          {bikes.map((bike) => (
            <div key={bike.id} className="glass rounded-lg p-4 flex items-center gap-4">
              <img src={bike.mainImage || bike.image} alt={bike.model} className="w-16 h-12 rounded object-cover flex-shrink-0" loading="lazy" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground truncate">{bike.model}</h4>
                  {bike.sold && <Badge variant="destructive" className="text-[10px]">SOLD</Badge>}
                  {bike.discountPrice && <Badge className="bg-accent text-accent-foreground text-[10px]">SALE</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{bike.brand} · {bike.year} · {formatPrice(bike.discountPrice || bike.price)}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Sold</span>
                  <Switch checked={bike.sold} onCheckedChange={() => toggleSold(bike.id, bike.sold)} />
                </div>
                <button onClick={() => handleEdit(bike)} className="p-2 text-muted-foreground hover:text-foreground haptic">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(bike.id)} className="p-2 text-muted-foreground hover:text-destructive haptic">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
