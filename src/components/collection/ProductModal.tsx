import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { gsap } from "gsap";
import { X, Heart, ShoppingCart, Star, Save, DollarSign, Percent, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Bouquet } from "@/types/bouquet";
import { useCartWithToast } from "@/hooks/useCartWithToast";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { generatedCategories } from "@/data/generatedBouquets";
import { useUpdateCollectionProduct } from "@/hooks/useCollectionProducts";

interface ProductModalProps {
  bouquet: Bouquet;
  onClose: () => void;
  onSave?: () => void;
}

export const ProductModal = ({ bouquet, onClose, onSave }: ProductModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCartWithToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const updateProductMutation = useUpdateCollectionProduct();
  
  // Swipe-to-close functionality for mobile
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 100], [1, 0]);
  const scale = useTransform(y, [0, 100], [1, 0.95]);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: bouquet.name,
    description: bouquet.description,
    price: bouquet.price,
    category: bouquet.category,
    display_category: bouquet.displayCategory || "",
    featured: bouquet.featured || false,
    image_urls: [bouquet.image],
    is_active: true,
    is_out_of_stock: bouquet.is_out_of_stock || false,
    discount_percentage: bouquet.discount_percentage || null,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    const scrollY = window.scrollY;
    
    // Better scroll lock for mobile - avoid fixed position to prevent white screen
    if (isMobile) {
      // On mobile, just prevent overflow - don't use fixed position
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      // Store scroll position
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      // Desktop: use overflow hidden
      document.body.style.overflow = "hidden";
    }
    
    // Modal entrance animation (simplified on mobile for performance)
    if (modalRef.current && imageRef.current) {
      if (isMobile) {
        // Simple fade-in on mobile
        gsap.set(modalRef.current, { opacity: 0, y: 20 });
        gsap.to(modalRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        // Desktop animation
        const tl = gsap.timeline();
        tl.set(modalRef.current, { scale: 0.8, opacity: 0 })
          .set(imageRef.current, { scale: 1.2, opacity: 0 })
          .to(modalRef.current, { 
            scale: 1, 
            opacity: 1, 
            duration: 0.4, 
            ease: "power2.out" 
          })
          .to(imageRef.current, { 
            scale: 1, 
            opacity: 1, 
            duration: 0.6, 
            ease: "power2.out" 
          }, "-=0.2")
          .from(".modal-content > *", {
            y: 30,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out"
          }, "-=0.3");
      }
    }

    return () => {
      // Restore scroll
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      
      // Restore scroll position on mobile
      if (isMobile) {
        const savedScrollY = document.body.getAttribute('data-scroll-y');
        if (savedScrollY) {
          requestAnimationFrame(() => {
            window.scrollTo(0, parseInt(savedScrollY, 10));
            document.body.removeAttribute('data-scroll-y');
          });
        }
      }
    };
  }, [isMobile]);

  const handleClose = () => {
    if (modalRef.current) {
      if (isMobile) {
        // Simple fade-out on mobile
        gsap.to(modalRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.2,
          ease: "power2.in",
          onComplete: onClose
        });
      } else {
        gsap.to(modalRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: onClose
        });
      }
    } else {
      onClose();
    }
  };

  // Handle swipe gesture for mobile
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile) return;
    
    setIsDragging(false);
    y.set(0); // Reset position
    
    // Close modal if swiped down more than 100px or with velocity > 500
    if (info.offset.y > 100 || info.velocity.y > 500) {
      handleClose();
    }
  };

  const handleDragStart = () => {
    if (isMobile) {
      setIsDragging(true);
    }
  };

  const handleAddToCart = () => {
    // Add liquid morph animation to button
    const button = document.querySelector('.add-to-cart-btn');
    if (button) {
      gsap.timeline()
        .to(button, { 
          scale: 0.95, 
          duration: 0.1 
        })
        .to(button, { 
          scale: 1.05, 
          backgroundColor: "hsl(var(--primary-glow))",
          duration: 0.2,
          ease: "power2.out"
        })
        .to(button, { 
          scale: 1, 
          backgroundColor: "hsl(var(--primary))",
          duration: 0.2 
        });
    }
    
    // Add to cart logic
    const numericPrice = formData.price;
    const finalPrice = formData.discount_percentage && formData.discount_percentage > 0
      ? numericPrice * (1 - formData.discount_percentage / 100)
      : numericPrice;
    
    addToCart({
      id: parseInt(bouquet.id),
      title: formData.title,
      price: finalPrice,
      image: formData.image_urls[0]
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price || formData.image_urls.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (title, price, at least one image).",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      await updateProductMutation.mutateAsync({
        id: bouquet.id,
        updates: formData,
        newImages: imageFiles,
        imagesToDelete,
      });
      toast({
        title: "Product Updated",
        description: `${formData.title} has been updated successfully.`,
      });
      if (onSave) onSave();
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    setFormData({ ...formData, image_urls: images });
  };

  const handleFilesChange = (files: File[]) => {
    setImageFiles(files);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-2 md:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        // Safe area insets for iOS devices
        paddingTop: isMobile ? 'env(safe-area-inset-top)' : undefined,
        paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : undefined,
        paddingLeft: isMobile ? 'env(safe-area-inset-left)' : undefined,
        paddingRight: isMobile ? 'env(safe-area-inset-right)' : undefined,
      }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          // Ensure backdrop respects safe areas
          top: isMobile ? 'env(safe-area-inset-top)' : 0,
          bottom: isMobile ? 'env(safe-area-inset-bottom)' : 0,
          touchAction: 'none',
        }}
      />

      {/* Modal - Fully Responsive */}
      <motion.div 
        ref={modalRef}
        className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] bg-card/95 backdrop-blur-xl border border-border/20 overflow-hidden shadow-2xl rounded-none sm:rounded-lg md:rounded-xl"
        style={{
          y: isMobile ? y : 0,
          opacity: isMobile ? opacity : 1,
          scale: isMobile ? scale : 1,
        }}
        drag={isMobile ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragDirectionLock
      >
        {/* Swipe Indicator for Mobile */}
        {isMobile && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-400/50 rounded-full z-20" />
        )}

        {/* Close Button - Touch-Friendly (48px minimum) */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-50 text-white hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full w-12 h-12 sm:w-10 sm:h-10 touch-target active:scale-95 transition-transform"
          onClick={handleClose}
          style={{
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          <X className="w-6 h-6 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </Button>

        {/* Full-Width Form Layout */}
        <div className="flex flex-col h-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
          {/* Scrollable Form Content */}
          <div 
            ref={contentRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(194, 154, 67, 0.5) transparent',
            }}
          >

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-700 border-b pb-2">
                Basic Information
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter product name"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      const selectedCat = generatedCategories.find(c => c.id === value);
                      setFormData({
                        ...formData,
                        category: value,
                        display_category: selectedCat?.name || "",
                      });
                    }}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {generatedCategories
                        .filter((c) => c.id !== "all")
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm">
                    Price ($) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                      }
                      className="pl-10 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  {formData.discount_percentage && formData.discount_percentage > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="line-through">${formData.price.toFixed(2)}</span>
                      <span className="ml-2 font-bold text-red-600">
                        ${(formData.price * (1 - formData.discount_percentage / 100)).toFixed(2)}
                      </span>
                      <span className="ml-2 text-red-600">
                        ({formData.discount_percentage}% off)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-700 border-b pb-2">
                Product Images
              </h3>
              <ImageUpload
                images={formData.image_urls}
                onImagesChange={handleImagesChange}
                onFilesChange={handleFilesChange}
                maxImages={10}
                multiple={true}
                label="Upload product images (first image is primary)"
              />
            </div>

            {/* Stock & Pricing */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-700 border-b pb-2">
                Stock & Pricing
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_percentage" className="text-sm">Discount (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="discount_percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.discount_percentage || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_percentage: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                      className="pl-10 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Enter discount (0-100)</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div>
                    <Label htmlFor="is_out_of_stock" className="font-medium cursor-pointer text-sm">
                      Out of Stock
                    </Label>
                    <p className="text-xs text-gray-500">Mark as unavailable</p>
                  </div>
                  <Switch
                    id="is_out_of_stock"
                    checked={formData.is_out_of_stock}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_out_of_stock: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div>
                    <Label htmlFor="is_active" className="font-medium cursor-pointer text-sm">
                      Active
                    </Label>
                    <p className="text-xs text-gray-500">Show on website</p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div>
                    <Label htmlFor="featured" className="font-medium cursor-pointer text-sm">
                      Featured Product
                    </Label>
                    <p className="text-xs text-gray-500">Display prominently</p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                className="add-to-cart-btn flex-1 h-12 text-base font-medium"
                onClick={handleAddToCart}
                disabled={formData.is_out_of_stock}
                variant="outline"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {formData.is_out_of_stock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => {
                  toggleFavorite({
                    id: bouquet.id,
                    title: formData.title,
                    price: formData.price,
                    image: formData.image_urls[0],
                    description: formData.description,
                    featured: formData.featured
                  });
                }}
              >
                <Heart 
                  className={`w-5 h-5 mr-2 ${isFavorite(bouquet.id) ? 'fill-[#dc267f] text-[#dc267f]' : 'text-primary'}`} 
                  strokeWidth={2}
                />
                {isFavorite(bouquet.id) ? 'Saved' : 'Save to Favorites'}
              </Button>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary-dark text-primary-foreground"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Gold Accent Lines - Only on Desktop */}
        {!isMobile && (
          <>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};