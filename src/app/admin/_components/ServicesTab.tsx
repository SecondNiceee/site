import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { useServices } from "../_hooks/useServices";

type ServicesTabProps = ReturnType<typeof useServices>;

export function ServicesTab({
  serviceItems,
  editingService,
  isCreatingService,
  serviceFormData,
  setServiceFormData,
  handleEditService,
  handleCreateService,
  handleCancelService,
  handleSaveService,
  handleDeleteService,
}: ServicesTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleCreateService}
          className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить услугу
        </Button>
      </div>

      {(editingService || isCreatingService) && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>
              {isCreatingService ? "Новая услуга" : "Редактирование услуги"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название</label>
                <Input
                  value={serviceFormData.title}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <Textarea
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  rows={3}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{"Иконка (название из lucide-react)"}</label>
                <Input
                  value={serviceFormData.icon}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, icon: e.target.value })}
                  placeholder="Building2, Warehouse, Wrench, Factory"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{"Особенности (через запятую)"}</label>
                <Input
                  value={serviceFormData.features.join(", ")}
                  onChange={(e) =>
                    setServiceFormData({
                      ...serviceFormData,
                      features: e.target.value.split(",").map(f => f.trim()).filter(f => f),
                    })
                  }
                  placeholder="Особенность 1, Особенность 2, Особенность 3"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Порядок сортировки</label>
                <Input
                  type="number"
                  value={serviceFormData.order_index}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, order_index: parseInt(e.target.value) || 0 })}
                  className="bg-background border-border"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveService}
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </Button>
                <Button variant="outline" onClick={handleCancelService}>
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {serviceItems.map((item) => (
          <Card key={item.id} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.features.map((feature, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-secondary rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditService(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteService(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
