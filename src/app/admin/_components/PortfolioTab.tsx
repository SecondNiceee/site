import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { categories } from "../_lib/types";
import type { usePortfolio } from "../_hooks/usePortfolio";

type PortfolioTabProps = ReturnType<typeof usePortfolio>;

export function PortfolioTab({
  items,
  editingItem,
  isCreating,
  formData,
  setFormData,
  uploading,
  uploadError,
  setUploadError,
  fileInputRef,
  handleCreate,
  handleEdit,
  handleCancel,
  handleFileUpload,
  handleSave,
  handleDelete,
}: PortfolioTabProps) {
  return (
    <>
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleCreate}
          className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить кейс
        </Button>
      </div>

      {/* Edit/Create Form */}
      {(isCreating || editingItem) && (
        <div className="mb-8 animate-[fade-up_0.3s_ease-out_forwards]">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>
                {isCreating ? "Новый кейс" : "Редактирование кейса"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Категория</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Клиент</label>
                  <Input
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Длительность</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Кол-во сотрудников</label>
                  <Input
                    type="number"
                    value={formData.workers}
                    onChange={(e) => setFormData({ ...formData, workers: parseInt(e.target.value) || 0 })}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Изображение</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="URL или загрузите файл"
                        className="bg-background border-border flex-1"
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {uploadError && (
                      <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                        {uploadError}
                      </div>
                    )}
                    {formData.image && (
                      <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-secondary">
                        <Image
                          src={formData.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => {
                            setFormData({ ...formData, image: "" });
                            setUploadError(null);
                          }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleSave}
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="bg-card border-border overflow-hidden">
            <div className="relative h-40 bg-secondary">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{item.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-[oklch(0.75_0.18_50)/10] text-[oklch(0.75_0.18_50)]">
                  {item.category}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {item.description}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:text-red-400"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>Кейсы пока не добавлены</p>
          <Button
            onClick={handleCreate}
            className="mt-4 bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black"
          >
            Добавить первый кейс
          </Button>
        </div>
      )}
    </>
  );
}
