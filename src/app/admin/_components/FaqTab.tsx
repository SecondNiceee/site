import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { useFaq } from "../_hooks/useFaq";

type FaqTabProps = ReturnType<typeof useFaq>;

export function FaqTab({
  faqItems,
  editingFaq,
  isCreatingFaq,
  faqFormData,
  setFaqFormData,
  handleEditFaq,
  handleCreateFaq,
  handleCancelFaq,
  handleSaveFaq,
  handleDeleteFaq,
}: FaqTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleCreateFaq}
          className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить вопрос
        </Button>
      </div>

      {(editingFaq || isCreatingFaq) && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>
              {isCreatingFaq ? "Новый вопрос" : "Редактирование вопроса"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Вопрос</label>
                <Input
                  value={faqFormData.question}
                  onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ответ</label>
                <Textarea
                  value={faqFormData.answer}
                  onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                  rows={4}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Порядок сортировки</label>
                <Input
                  type="number"
                  value={faqFormData.order_index}
                  onChange={(e) => setFaqFormData({ ...faqFormData, order_index: parseInt(e.target.value) || 0 })}
                  className="bg-background border-border"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveFaq}
                  className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </Button>
                <Button variant="outline" onClick={handleCancelFaq}>
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {faqItems.map((item) => (
          <Card key={item.id} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{item.question}</h3>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditFaq(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteFaq(item.id)}
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
