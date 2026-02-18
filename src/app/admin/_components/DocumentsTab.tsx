import { Plus, X, Save, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { useDocuments } from "../_hooks/useDocuments";

type DocumentsTabProps = ReturnType<typeof useDocuments>;

export function DocumentsTab({
  documents,
  savingDocuments,
  handleSaveDocuments,
  updateDocumentSection,
  updateDocumentParagraph,
  addDocumentParagraph,
  removeDocumentParagraph,
}: DocumentsTabProps) {
  if (!documents) return null;

  return (
    <div className="space-y-8">
      {/* Privacy Policy */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Политика конфиденциальности
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {documents.privacy.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-border rounded-lg p-6 space-y-4">
              <Input
                value={section.title}
                onChange={(e) => updateDocumentSection("privacy", sectionIndex, "title", e.target.value)}
                className="font-semibold text-lg bg-background border-border"
                placeholder="Название раздела"
              />
              <div className="space-y-2">
                {section.content.map((paragraph, paragraphIndex) => (
                  <div key={paragraphIndex} className="flex gap-2">
                    <Textarea
                      value={paragraph}
                      onChange={(e) => updateDocumentParagraph("privacy", sectionIndex, paragraphIndex, e.target.value)}
                      rows={2}
                      className="bg-background border-border flex-1"
                      placeholder="Текст параграфа"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDocumentParagraph("privacy", sectionIndex, paragraphIndex)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addDocumentParagraph("privacy", sectionIndex)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить параграф
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Offer */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[oklch(0.75_0.18_50)]" />
            Договор публичной оферты
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {documents.offer.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-border rounded-lg p-6 space-y-4">
              <Input
                value={section.title}
                onChange={(e) => updateDocumentSection("offer", sectionIndex, "title", e.target.value)}
                className="font-semibold text-lg bg-background border-border"
                placeholder="Название раздела"
              />
              <div className="space-y-2">
                {section.content.map((paragraph, paragraphIndex) => (
                  <div key={paragraphIndex} className="flex gap-2">
                    <Textarea
                      value={paragraph}
                      onChange={(e) => updateDocumentParagraph("offer", sectionIndex, paragraphIndex, e.target.value)}
                      rows={2}
                      className="bg-background border-border flex-1"
                      placeholder="Текст параграфа"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDocumentParagraph("offer", sectionIndex, paragraphIndex)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addDocumentParagraph("offer", sectionIndex)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить параграф
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveDocuments}
          disabled={savingDocuments}
          className="bg-[oklch(0.75_0.18_50)] hover:bg-[oklch(0.65_0.18_50)] text-black font-semibold"
        >
          {savingDocuments ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Сохранить документы
        </Button>
      </div>
    </div>
  );
}
