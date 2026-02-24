import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPicker } from "./IconPicker";
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
  const [featuresText, setFeaturesText] = useState(
    serviceFormData.features.join("\n")
  );

  // Sync featuresText when form resets or a service is loaded for editing
  useEffect(() => {
    setFeaturesText(serviceFormData.features.join("\n"));
  }, [editingService, isCreatingService]);

  const onSave = () => {
    // Process the raw text into features array before saving
    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
    handleSaveService(features);
  };

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
              <IconPicker
                value={serviceFormData.icon}
                onChange={(icon) => setServiceFormData({ ...serviceFormData, icon })}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Особенности</label>
                <div className="space-y-2">
                  <Textarea
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                    placeholder="Введите каждую особенность на новой строке"
                    rows={5}
                    spellCheck={false}
                    autoComplete="off"
                    className="bg-background border-border resize-y"
                  />
                  <p className="text-xs text-muted-foreground">Каждую особенность вводите на новой строке</p>
                  {featuresText.split("\n").filter((f) => f.trim()).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {featuresText
                        .split("\n")
                        .filter((f) => f.trim())
                        .map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-secondary rounded">
                            <span className="text-sm">{feature.trim()}</span>
                            <button
                              onClick={() => {
                                const lines = featuresText.split("\n");
                                let targetIdx = 0;
                                let count = 0;
                                for (let i = 0; i < lines.length; i++) {
                                  if (lines[i].trim()) {
                                    if (count === idx) {
                                      targetIdx = i;
                                      break;
                                    }
                                    count++;
                                  }
                                }
                                const newLines = lines.filter((_, i) => i !== targetIdx);
                                setFeaturesText(newLines.join("\n"));
                              }}
                              className="text-xs hover:text-red-500"
                            >
                              {'\u2715'}
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
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
                  onClick={onSave}
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
