import { Plus, X, Save, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { useDocuments } from "../_hooks/useDocuments";

type DocumentsTabProps = ReturnType<typeof useDocuments>;

function DocumentSections({
  docType,
  sections,
  getSectionText,
  updateDocumentSection,
  updateDocumentSectionText,
  addDocumentSection,
  removeDocumentSection,
}: {
  docType: "privacy" | "offer";
  sections: { title: string; content: string[] }[];
  getSectionText: DocumentsTabProps["getSectionText"];
  updateDocumentSection: DocumentsTabProps["updateDocumentSection"];
  updateDocumentSectionText: DocumentsTabProps["updateDocumentSectionText"];
  addDocumentSection: DocumentsTabProps["addDocumentSection"];
  removeDocumentSection: DocumentsTabProps["removeDocumentSection"];
}) {
  return (
    <div className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={section.title}
              onChange={(e) =>
                updateDocumentSection(docType, sectionIndex, "title", e.target.value)
              }
              className="font-semibold text-lg bg-background border-border flex-1"
              placeholder="Название раздела"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeDocumentSection(docType, sectionIndex)}
              className="text-red-500 hover:text-red-400 shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Вставьте весь текст раздела. Параграфы разделяются пустой строкой.
            </p>
            <Textarea
              value={getSectionText(docType, sectionIndex)}
              onChange={(e) =>
                updateDocumentSectionText(docType, sectionIndex, e.target.value)
              }
              rows={10}
              className="bg-background border-border w-full font-mono text-sm leading-relaxed"
              placeholder={"Вставьте текст раздела здесь...\n\nКаждый параграф отделяется пустой строкой."}
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => addDocumentSection(docType)}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Добавить раздел
      </Button>
    </div>
  );
}

export function DocumentsTab({
  documents,
  savingDocuments,
  handleSaveDocuments,
  updateDocumentSection,
  updateDocumentSectionText,
  getSectionText,
  addDocumentSection,
  removeDocumentSection,
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
        <CardContent>
          <DocumentSections
            docType="privacy"
            sections={documents.privacy.sections}
            getSectionText={getSectionText}
            updateDocumentSection={updateDocumentSection}
            updateDocumentSectionText={updateDocumentSectionText}
            addDocumentSection={addDocumentSection}
            removeDocumentSection={removeDocumentSection}
          />
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
        <CardContent>
          <DocumentSections
            docType="offer"
            sections={documents.offer.sections}
            getSectionText={getSectionText}
            updateDocumentSection={updateDocumentSection}
            updateDocumentSectionText={updateDocumentSectionText}
            addDocumentSection={addDocumentSection}
            removeDocumentSection={removeDocumentSection}
          />
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
