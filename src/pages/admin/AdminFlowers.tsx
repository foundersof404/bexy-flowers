import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQueryClient } from '@tanstack/react-query';
import { flowersQueryKeys } from '@/hooks/useFlowers';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  DollarSign,
  Flower,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { encodeImageUrl } from '@/lib/imageUtils';
import {
  getFlowerTypes,
  getFlowerTypeWithColors,
  createFlowerType,
  updateFlowerType,
  deleteFlowerType,
  createFlowerColor,
  updateFlowerColor,
  deleteFlowerColor,
} from '@/lib/api/flowers';

const GOLD_COLOR = 'rgb(199, 158, 72)';

const AdminFlowers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [flowerTypes, setFlowerTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFlowerId, setSelectedFlowerId] = useState<string | null>(null);
  const [selectedFlowerDetails, setSelectedFlowerDetails] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; type: 'flower' | 'color' | null }>({
    open: false,
    id: null,
    type: null,
  });

  // Flower type form state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    price_per_stem: 0,
    image_url: '',
    quantity: 0,
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Color form state
  const [colorFormData, setColorFormData] = useState({
    name: '',
    color_value: '',
    quantity: 0,
  });
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [showColorForm, setShowColorForm] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    loadFlowerTypes();
  }, [navigate]);

  const loadFlowerTypes = async () => {
    try {
      setLoading(true);
      const data = await getFlowerTypes();
      setFlowerTypes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load flower types',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFlowerDetails = async (flowerId: string) => {
    try {
      const details = await getFlowerTypeWithColors(flowerId);
      setSelectedFlowerDetails(details);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load flower details',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async (flower: any) => {
    setEditingId(flower.id);
    setFormData({
      name: flower.name,
      title: flower.title || '',
      price_per_stem: flower.price_per_stem,
      image_url: flower.image_url || '',
      quantity: flower.quantity || 0,
      is_active: flower.is_active,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({
      name: '',
      title: '',
      price_per_stem: 0,
      image_url: '',
      quantity: 0,
      is_active: true,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price_per_stem) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in name and price per stem',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateFlowerType(
          editingId,
          formData,
          imageFile || undefined,
          !!imageFile
        );
        // Invalidate React Query cache so frontend sees changes immediately
        queryClient.invalidateQueries({ queryKey: flowersQueryKeys.lists() });
        toast({
          title: 'Success',
          description: 'Flower type updated successfully',
        });
      } else {
        await createFlowerType(formData, imageFile || undefined);
        // Invalidate React Query cache so frontend sees changes immediately
        queryClient.invalidateQueries({ queryKey: flowersQueryKeys.lists() });
        toast({
          title: 'Success',
          description: 'Flower type created successfully',
        });
      }

      setShowForm(false);
      setEditingId(null);
      setImageFile(null);
      await loadFlowerTypes();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save flower type',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFlowerType(id);
      // Invalidate React Query cache so frontend sees changes immediately
      queryClient.invalidateQueries({ queryKey: flowersQueryKeys.lists() });
      queryClient.removeQueries({ queryKey: flowersQueryKeys.detail(id) });
      toast({
        title: 'Success',
        description: 'Flower type deleted successfully',
      });
      await loadFlowerTypes();
      if (selectedFlowerId === id) {
        setSelectedFlowerId(null);
        setSelectedFlowerDetails(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete flower type',
        variant: 'destructive',
      });
    }
    setDeleteDialog({ open: false, id: null, type: null });
  };

  const handleManageColors = async (flowerId: string) => {
    setSelectedFlowerId(flowerId);
    setShowColorForm(false); // Reset form state when switching flowers
    await loadFlowerDetails(flowerId);
  };

  const handleNewColor = () => {
    setEditingColorId(null);
    setShowColorForm(true);
    setColorFormData({
      name: '',
      color_value: '',
      quantity: 0,
    });
  };

  const handleEditColor = (color: any) => {
    setEditingColorId(color.id);
    setShowColorForm(true);
    setColorFormData({
      name: color.name,
      color_value: color.color_value || '',
      quantity: color.quantity,
    });
  };

  const handleSaveColor = async () => {
    if (!selectedFlowerId || !colorFormData.name) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in color name',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingColorId) {
        await updateFlowerColor(editingColorId, colorFormData);
        toast({
          title: 'Success',
          description: 'Color updated successfully',
        });
      } else {
        await createFlowerColor({
          flower_id: selectedFlowerId,
          name: colorFormData.name,
          color_value: colorFormData.color_value || '',
          quantity: colorFormData.quantity,
          // Note: is_active column doesn't exist in flower_colors table
        });
        toast({
          title: 'Success',
          description: 'Color added successfully',
        });
      }

      setEditingColorId(null);
      setShowColorForm(false);
      setColorFormData({ name: '', color_value: '', quantity: 0 });
      await loadFlowerDetails(selectedFlowerId);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save color',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteColor = async (colorId: string) => {
    if (!selectedFlowerId) return;

    try {
      await deleteFlowerColor(colorId);
      toast({
        title: 'Success',
        description: 'Color deleted successfully',
      });
      await loadFlowerDetails(selectedFlowerId);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete color',
        variant: 'destructive',
      });
    }
    setDeleteDialog({ open: false, id: null, type: null });
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-serif font-bold" style={{ color: '#1a1a1a' }}>
                  Flower Types Management
                </h1>
                <p className="text-sm text-gray-500">Manage flower types and their colors for custom bouquets</p>
              </div>
            </div>
            <Button
              onClick={handleNew}
              className="gap-2"
              style={{
                background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                color: 'white',
              }}
            >
              <Plus className="w-4 h-4" />
              Add Flower Type
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showForm && !selectedFlowerId ? (
          <Card>
            <CardHeader>
              <CardTitle>All Flower Types ({flowerTypes.length})</CardTitle>
              <CardDescription>Manage flower types available for custom bouquets</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : flowerTypes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Flower className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No flower types yet.</p>
                  <p className="text-sm mt-2">Add a flower type to get started.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price per Stem</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flowerTypes.map((flower) => (
                      <TableRow key={flower.id}>
                        <TableCell>
                          {flower.image_url ? (
                            <img
                              src={encodeImageUrl(flower.image_url)}
                              alt={flower.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <Flower className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{flower.name}</div>
                          {flower.title && (
                            <div className="text-xs text-gray-500">{flower.title}</div>
                          )}
                        </TableCell>
                        <TableCell>${flower.price_per_stem}</TableCell>
                        <TableCell>
                          <span className={flower.quantity === 0 ? 'text-red-600 font-medium' : ''}>
                            {flower.quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={flower.is_active ? 'default' : 'secondary'}
                            className={flower.is_active ? 'bg-green-500' : ''}
                          >
                            {flower.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleManageColors(flower.id)}
                              className="gap-1"
                            >
                              <Palette className="w-4 h-4" />
                              Colors
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(flower)}
                              className="gap-1"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialog({ open: true, id: flower.id, type: 'flower' })}
                              className="gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ) : showForm ? (
          /* Flower Type Form */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{editingId ? 'Edit Flower Type' : 'Add New Flower Type'}</CardTitle>
                    <CardDescription>Manage flower type details</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForm(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Flower Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Roses"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Flower Title/Type
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Classic Rose, Premium Peony"
                    />
                    <p className="text-xs text-gray-500">Display title indicating the type of flower</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price_per_stem">
                        Price per Stem ($) <span className="text-red-500">*</span>
                      </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="price_per_stem"
                        type="number"
                        step="0.01"
                        value={formData.price_per_stem}
                        onChange={(e) =>
                          setFormData({ ...formData, price_per_stem: parseFloat(e.target.value) || 0 })
                        }
                        className="pl-10"
                        placeholder="0.00"
                      />
                    </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">
                        Available Quantity <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                        }
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-500">Total available quantity for this flower type</p>
                    </div>
                  </div>

                  <ImageUpload
                    images={formData.image_url ? [formData.image_url] : []}
                    onImagesChange={(images) =>
                      setFormData({ ...formData, image_url: images[0] || '' })
                    }
                    onFilesChange={(files) => setImageFile(files[0] || null)}
                    maxImages={1}
                    multiple={false}
                    label="Flower Image"
                  />

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="is_active" className="font-medium cursor-pointer">
                        Active
                      </Label>
                      <p className="text-sm text-gray-500">Show on website</p>
                    </div>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                        color: 'white',
                      }}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {editingId ? 'Update' : 'Create'} Flower Type
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : selectedFlowerId && selectedFlowerDetails ? (
          /* Color Management */
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage Colors: {selectedFlowerDetails.name}</CardTitle>
                  <CardDescription>Add and manage colors for this flower type</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFlowerId(null);
                      setSelectedFlowerDetails(null);
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Flowers
                  </Button>
                  <Button
                    onClick={handleNewColor}
                    className="gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                      color: 'white',
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Color
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Color Form */}
                {showColorForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{editingColorId ? 'Edit Color' : 'Add New Color'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="color_name">Color Name *</Label>
                          <Input
                            id="color_name"
                            value={colorFormData.name}
                            onChange={(e) => setColorFormData({ ...colorFormData, name: e.target.value })}
                            placeholder="e.g., Red"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="color_value">Color Value</Label>
                          <Input
                            id="color_value"
                            value={colorFormData.color_value}
                            onChange={(e) => setColorFormData({ ...colorFormData, color_value: e.target.value })}
                            placeholder="e.g., #FF0000 or red"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="color_quantity">Quantity</Label>
                          <Input
                            id="color_quantity"
                            type="number"
                            value={colorFormData.quantity}
                            onChange={(e) =>
                              setColorFormData({ ...colorFormData, quantity: parseInt(e.target.value) || 0 })
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-4 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingColorId(null);
                            setShowColorForm(false);
                            setColorFormData({ name: '', color_value: '', quantity: 0 });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveColor}
                          className="gap-2"
                          style={{
                            background: `linear-gradient(135deg, ${GOLD_COLOR} 0%, rgba(199, 158, 72, 0.9) 100%)`,
                            color: 'white',
                          }}
                        >
                          <Save className="w-4 h-4" />
                          {editingColorId ? 'Update' : 'Add'} Color
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Colors List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Colors ({selectedFlowerDetails.colors?.length || 0})</h3>
                  {selectedFlowerDetails.colors?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Palette className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No colors added yet.</p>
                      <p className="text-sm mt-2">Click "Add Color" to get started.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Color Name</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedFlowerDetails.colors?.map((color: any) => (
                          <TableRow key={color.id}>
                            <TableCell className="font-medium">{color.name}</TableCell>
                            <TableCell>
                              {color.color_value && (
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-6 h-6 rounded border"
                                    style={{ backgroundColor: color.color_value }}
                                  />
                                  <span className="text-sm text-gray-600">{color.color_value}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className={color.quantity === 0 ? 'text-red-600 font-medium' : ''}>
                                {color.quantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditColor(color)}
                                  className="gap-1"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteDialog({ open: true, id: color.id, type: 'color' })
                                  }
                                  className="gap-1 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null, type: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {deleteDialog.type === 'flower' ? 'Flower Type' : 'Color'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deleteDialog.type === 'flower' ? 'flower type' : 'color'}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null, type: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteDialog.id && deleteDialog.type === 'flower') {
                  handleDelete(deleteDialog.id);
                } else if (deleteDialog.id && deleteDialog.type === 'color') {
                  handleDeleteColor(deleteDialog.id);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </AdminLayout>
  );
};

export default AdminFlowers;
