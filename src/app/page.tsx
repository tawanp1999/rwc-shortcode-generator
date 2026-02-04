"use client";

import { useState, useCallback } from "react";
import {
  Settings,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Zap,
  Upload,
  BookOpen
} from "lucide-react";
import { convertToShortcode, type ConversionSettings } from "@/lib/converter";

export default function Home() {
  // State สำหรับ Input
  const [inputContent, setInputContent] = useState("");

  // State สำหรับ Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [contactBlockId, setContactBlockId] = useState("12669");
  const [doctorBlockId, setDoctorBlockId] = useState("12482");

  // State สำหรับ Output
  const [outputContent, setOutputContent] = useState("");
  const [headings, setHeadings] = useState<{ text: string; anchor: string }[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  // State สำหรับ Loading
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle Generate
  const handleGenerate = useCallback(() => {
    if (!inputContent.trim()) return;

    setIsGenerating(true);

    // Simulate processing delay for UX
    setTimeout(() => {
      const settings: ConversionSettings = {
        contactBlockId,
        doctorBlockId,
      };

      const result = convertToShortcode(inputContent, settings);
      setOutputContent(result.output);
      setHeadings(result.headings);
      setIsGenerating(false);
    }, 500);
  }, [inputContent, contactBlockId, doctorBlockId]);

  // Handle Copy
  const handleCopy = useCallback(async () => {
    if (!outputContent) return;

    try {
      await navigator.clipboard.writeText(outputContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [outputContent]);

  // Toggle Settings
  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  // Handle File Upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ตรวจสอบประเภทไฟล์
    const validExtensions = ['.md', '.txt'];
    const fileName = file.name.toLowerCase();
    const isValidFile = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidFile) {
      alert('กรุณาเลือกไฟล์ .md หรือ .txt เท่านั้น');
      event.target.value = ''; // Reset input
      return;
    }

    // อ่านไฟล์
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputContent(content);
    };
    reader.onerror = () => {
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
    };
    reader.readAsText(file, 'UTF-8');

    // Reset input เพื่อให้สามารถอัปโหลดไฟล์เดิมซ้ำได้
    event.target.value = '';
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-accent glow-primary">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              Shortcode Generator
            </h1>
          </div>
          <p className="text-muted text-lg">
            แปลงเนื้อหาบทความเป็น WordPress Flatsome Shortcode
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input & Settings */}
          <div className="space-y-6">
            {/* Input Area */}
            <section className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">เนื้อหาบทความ</h2>
              </div>

              <textarea
                className="textarea-field min-h-[300px] md:min-h-[400px]"
                placeholder={`วางเนื้อหาบทความที่นี่...

ตัวอย่าง:
## หัวข้อแรก
เนื้อหาของหัวข้อแรก อธิบายรายละเอียดต่างๆ

## หัวข้อที่สอง
เนื้อหาของหัวข้อที่สอง
- รายการย่อย 1
- รายการย่อย 2

## หัวข้อที่สาม
เนื้อหาส่วนสุดท้าย`}
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted">
                    {inputContent.length > 0 && `${inputContent.length.toLocaleString()} ตัวอักษร`}
                  </span>

                  {/* Upload File Button */}
                  <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">อัปโหลดไฟล์</span>
                    <input
                      type="file"
                      accept=".md,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  className="btn-primary flex items-center gap-2"
                  onClick={handleGenerate}
                  disabled={!inputContent.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      กำลังสร้าง...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Shortcode
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Settings Panel (Accordion) */}
            <section className="glass-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <button
                className="accordion-header w-full p-4 flex items-center justify-between rounded-2xl"
                onClick={toggleSettings}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-accent" />
                  <span className="font-semibold">ตั้งค่า Default Footer Blocks</span>
                </div>
                {isSettingsOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted" />
                )}
              </button>

              <div className={`accordion-content ${isSettingsOpen ? "open" : ""}`}>
                <div className="p-4 pt-0 space-y-4">
                  <div>
                    <label className="label" htmlFor="contactBlockId">
                      Contact Block ID
                    </label>
                    <input
                      id="contactBlockId"
                      type="text"
                      className="input-field"
                      value={contactBlockId}
                      onChange={(e) => setContactBlockId(e.target.value)}
                      placeholder="เช่น 12669"
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="doctorBlockId">
                      Doctor Block ID
                    </label>
                    <input
                      id="doctorBlockId"
                      type="text"
                      className="input-field"
                      value={doctorBlockId}
                      onChange={(e) => setDoctorBlockId(e.target.value)}
                      placeholder="เช่น 12482"
                    />
                  </div>

                  <p className="text-sm text-muted">
                    Block IDs เหล่านี้จะถูกเพิ่มท้ายบทความโดยอัตโนมัติ
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            {/* Output Area */}
            <section className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold">Shortcode Output</h2>
                </div>

                {outputContent && (
                  <button
                    className={`btn-secondary flex items-center gap-2 ${isCopied ? "border-success text-success" : ""
                      }`}
                    onClick={handleCopy}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                )}
              </div>

              {outputContent ? (
                <div className="code-block min-h-[300px] md:min-h-[400px] max-h-[600px] overflow-y-auto">
                  {outputContent}
                </div>
              ) : (
                <div className="min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center text-muted">
                  <Sparkles className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-center">
                    ผลลัพธ์ Shortcode จะแสดงที่นี่
                    <br />
                    <span className="text-sm">วางเนื้อหาและกด Generate เพื่อเริ่มต้น</span>
                  </p>
                </div>
              )}
            </section>

            {/* Headings Summary */}
            {headings.length > 0 && (
              <section className="glass-card p-6 animate-fade-in">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Anchor Links ({headings.length} หัวข้อ)
                </h3>
                <div className="space-y-2">
                  {headings.map((heading, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <span className="text-sm truncate flex-1 mr-4">
                        {heading.text}
                      </span>
                      <code className="text-xs text-accent bg-secondary px-2 py-1 rounded">
                        #{heading.anchor}
                      </code>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* User Guide Section */}
            <section className="glass-card animate-fade-in">
              <button
                className="accordion-header w-full p-4 flex items-center justify-between rounded-2xl"
                onClick={() => setIsGuideOpen(!isGuideOpen)}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="font-semibold">คู่มือการใช้งาน</span>
                </div>
                {isGuideOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted" />
                )}
              </button>

              <div className={`accordion-content ${isGuideOpen ? "open" : ""}`}>
                <div className="p-4 pt-0 space-y-6">
                  {/* Step 1 */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">1</span>
                      วางเนื้อหา Markdown
                    </h4>
                    <p className="text-sm text-muted ml-8">
                      วางเนื้อหาบทความในช่องฝั่งซ้าย หรืออัปโหลดไฟล์ .md/.txt ได้เลย
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">2</span>
                      Generate และคัดลอก
                    </h4>
                    <p className="text-sm text-muted ml-8">
                      คลิก &quot;Generate Shortcode&quot; แล้วคัดลอกผลลัพธ์ด้วยปุ่ม &quot;Copy to Clipboard&quot;
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">3</span>
                      วางใน WordPress
                    </h4>
                    <p className="text-sm text-muted ml-8 mb-3">
                      วาง shortcode ที่คัดลอกไว้ลงในกล่อง code (เลข 1) แล้วคลิก &quot;Edit with UX Builder&quot; (เลข 2) เพื่อดูและแก้ไขแบบ visual
                    </p>
                    {/* Image */}
                    <div className="ml-8 rounded-lg overflow-hidden border border-border/50">
                      <img
                        src="/guide/ux-builder-example.png"
                        alt="ตัวอย่างการวาง Shortcode ใน WordPress"
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="text-xs text-muted ml-8 mt-2">
                      💡 <strong>คำแนะนำ:</strong> วาง shortcode ในกล่องที่มีเลข 1 (กล่องสีชมพู) แล้วคลิกปุ่ม Edit with UX Builder (เลข 2) เพื่อเข้าสู่โหมดแก้ไขแบบ visual
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 py-6 text-muted text-sm">
          <p>Shortcode Generator • สำหรับทีม Content</p>
        </footer>
      </div>
    </main>
  );
}
