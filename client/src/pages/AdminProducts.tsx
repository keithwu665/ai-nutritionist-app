import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

export default function AdminProducts() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    servingSize: "",
    calories: "",
    proteinG: "",
    carbsG: "",
    fatG: "",
    description: "",
    imageUrl: "",
  });

  const products = trpc.fitastyProducts.list.useQuery();
  const createMutation = trpc.fitastyProducts.create.useMutation({
    onSuccess: () => {
      toast.success("產品已建立");
      setFormData({
        name: "",
        category: "",
        servingSize: "",
        calories: "",
        proteinG: "",
        carbsG: "",
        fatG: "",
        description: "",
        imageUrl: "",
      });
      setShowForm(false);
      products.refetch();
    },
    onError: (err) => {
      toast.error(err.message || "建立失敗");
    },
  });

  const deleteMutation = trpc.fitastyProducts.delete.useMutation({
    onSuccess: () => {
      toast.success("產品已刪除");
      products.refetch();
    },
    onError: (err) => {
      toast.error(err.message || "刪除失敗");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.calories) {
      toast.error("請填寫必填欄位：名稱、分類、熱量");
      return;
    }

    createMutation.mutate({
      name: formData.name,
      category: formData.category,
      servingSize: formData.servingSize || undefined,
      calories: parseFloat(formData.calories),
      proteinG: formData.proteinG ? parseFloat(formData.proteinG) : undefined,
      carbsG: formData.carbsG ? parseFloat(formData.carbsG) : undefined,
      fatG: formData.fatG ? parseFloat(formData.fatG) : undefined,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Fitasty 產品管理</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          新增產品
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>新增產品</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">名稱 *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., 叉燒飯"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">分類 *</label>
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., 米飯"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">份量</label>
                  <Input
                    name="servingSize"
                    value={formData.servingSize}
                    onChange={handleInputChange}
                    placeholder="e.g., 1碗 (250g)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">熱量 (kcal) *</label>
                  <Input
                    name="calories"
                    type="number"
                    value={formData.calories}
                    onChange={handleInputChange}
                    placeholder="e.g., 450"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">蛋白質 (g)</label>
                  <Input
                    name="proteinG"
                    type="number"
                    value={formData.proteinG}
                    onChange={handleInputChange}
                    placeholder="e.g., 15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">碳水化合物 (g)</label>
                  <Input
                    name="carbsG"
                    type="number"
                    value={formData.carbsG}
                    onChange={handleInputChange}
                    placeholder="e.g., 60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">脂肪 (g)</label>
                  <Input
                    name="fatG"
                    type="number"
                    value={formData.fatG}
                    onChange={handleInputChange}
                    placeholder="e.g., 12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">圖片 URL</label>
                  <Input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">描述</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="產品描述"
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "建立中..." : "建立"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">現有產品</h2>
        {products.isLoading ? (
          <p className="text-muted-foreground">載入中...</p>
        ) : products.data && products.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.data.map((product: any) => (
              <Card key={product.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <div className="text-sm space-y-1">
                      <p>熱量: {product.calories} kcal</p>
                      {product.proteinG && <p>蛋白質: {product.proteinG}g</p>}
                      {product.carbsG && <p>碳水: {product.carbsG}g</p>}
                      {product.fatG && <p>脂肪: {product.fatG}g</p>}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate({ id: product.id })}
                      disabled={deleteMutation.isPending}
                      className="w-full gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      刪除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">未有產品</p>
        )}
      </div>
    </div>
  );
}
