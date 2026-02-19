# STATUS.md — RWC Shortcode Generator

> **คำสั่งสำหรับ AI Agent ที่อ่านไฟล์นี้:**
> ก่อนเริ่มทำงานใดๆ ให้อ่านไฟล์เหล่านี้ทั้งหมดให้ครบก่อน:
> 1. `STATUS.md` (ไฟล์นี้) — ภาพรวมโปรเจกต์
> 2. `src/lib/converter.ts` — logic หลักของการแปลง shortcode
> 3. `src/app/page.tsx` — UI และ state management
> 4. `src/app/globals.css` — ดีไซน์ระบบทั้งหมด
> 5. `flatsome-shortcode-docs.md` — สรุป Flatsome official docs (3 บทความ)
> 6. `README.md` — วิธีรันโปรเจกต์
>
> การเข้าใจโปรเจกต์นี้ต้องอ่านโค้ดประกอบกับ docs เสมอ เพราะ logic ผูกกับ Flatsome UX Builder shortcode format โดยเฉพาะ

---

## 1. โปรเจกต์นี้คืออะไร?

**RWC Shortcode Generator** คือ **เว็บแอปเครื่องมือภายในทีม** สำหรับแปลงเนื้อหาบทความที่เขียนในรูปแบบ **Markdown** (`.md` หรือ `.txt`) ให้เป็น **Flatsome UX Builder Shortcode** พร้อม paste ลง WordPress โดยตรง

- **ทีมที่ใช้:** Content Writer
- **เว็บไซต์เป้าหมาย:** WordPress + Flatsome theme
- **ไม่ใช่ public tool** — เป็น internal tool สำหรับทีมเฉพาะ

### ปัญหาที่แก้ไข

การจัด layout บทความใน Flatsome UX Builder ด้วยมือใช้เวลานาน เครื่องมือนี้ทำให้กระบวนการนั้น **อัตโนมัติ 100%** ในคลิกเดียว

---

## 2. Tech Stack

| เทคโนโลยี | Version | บทบาท |
|-----------|---------|-------|
| **Next.js** | 16.1.6 | Framework หลัก |
| **React** | 19.2.3 | UI rendering |
| **TypeScript** | ^5 | ภาษา coding |
| **TailwindCSS** | ^4 | Styling |
| **marked** | ^17.0.1 | แปลง Markdown → HTML |
| **Lucide React** | ^0.563.0 | Icons |

### วิธีรัน

```bash
# ติดตั้ง dependencies (ครั้งแรกเท่านั้น)
npm install

# รัน dev server
npm run dev
# เปิด http://localhost:3000
```

---

## 3. โครงสร้างไฟล์

```
rwc-shortcode-generator/
│
├── src/
│   ├── app/
│   │   ├── page.tsx        ← UI หลัก (template selector, input, output)
│   │   ├── layout.tsx      ← HTML wrapper, font, title
│   │   └── globals.css     ← Design system ทั้งหมด (dark theme, glass cards)
│   │
│   └── lib/
│       └── converter.ts    ← CORE LOGIC: แปลง Markdown → Flatsome Shortcode
│
├── public/
│   └── guide/
│       └── ux-builder-example.png  ← รูปในคู่มือการใช้งาน
│
├── STATUS.md               ← ไฟล์นี้
├── flatsome-shortcode-docs.md  ← สรุป Flatsome official docs
└── package.json
```

---

## 4. ระบบ Template (สำคัญมาก)

โปรเจกต์รองรับ **3 template** สำหรับเว็บไซต์ที่แตกต่างกัน ผู้ใช้เลือกได้ใน UI:

### Template 1: 🏥 RWC (default)

- **TOC (สารบัญ):** Flatsome `[accordion][accordion-item title="เลือกอ่านตามหัวข้อ"]` พร้อม anchor links
- **Footer:** `[block id="12669"]` (ติดต่อ) + `[block id="12482"]` (แพทย์)
- **Settings:** ปรับ Contact Block ID และ Doctor Block ID ได้

### Template 2: 🌿 Standard

- **TOC:** `[lwptoc]` จาก plugin **LuckyWP Table of Contents**
  - ⚠️ **ข้อควรรู้:** `[lwptoc]` วางแบบ standalone (ไม่มี `[row][col]` wrapper) เพื่อป้องกัน WordPress `wpautop` เพิ่ม `<p>` รอบมัน
  - อย่างไรก็ตาม UX Builder จะยัด `[lwptoc]` ไว้ใน Text Editor block เสมอ (Flatsome limitation) แต่ **frontend ยังทำงานได้ปกติ** เพราะ WordPress ประมวลผล shortcode ก่อน render
  - ผู้ใช้ปิด "Auto Insert" ของ LuckyWP ไว้ จึงต้องใช้ shortcode มือ
- **Footer:** `[block id="8549"]` (อันเดียว)
- **Settings:** ปรับ Standard Block ID ได้

### Template 3: 🌐 Universal

- **TOC:** ไม่มี
- **Footer:** ไม่มี
- **Output:** Pure Flatsome shortcode มาตรฐาน (`[row][col][ux_text][ux_image][/col][/row]`)
- **ใช้สำหรับ:** Flatsome website ทั่วไปที่ไม่ทราบ Block IDs

---

## 5. Logic การแปลงใน `converter.ts`

### ขั้นตอนการทำงาน (เรียงตาม function call)

```
convertToShortcode(content, settings)
  └── parseSections(content)
        แยก Markdown ออกเป็น sections ตาม ## headings
        ↓
  └── generateShortcode(sections, settings)
        1. สร้าง TOC (ขึ้นอยู่กับ templateType)
        2. วนซ้ำแต่ละ section:
           a. เพิ่ม [scroll_to] anchor
           b. เพิ่ม <h2><b>หัวข้อ</b></h2> ใน [ux_text]
           c. parseMarkdownToHTML(section.content)
              └── marked: Markdown → HTML
           d. cleanHTML(html)
              └── เพิ่ม styles ตาราง, ลบ empty tags
           e. wrapElementsWithUxText(html)
              └── หุ้มแต่ละ element ด้วย [ux_text]...[/ux_text]
           f. เพิ่ม [ux_image id="1000x"] placeholder
        3. เพิ่ม Footer blocks (ขึ้นอยู่กับ templateType)
```

### Output Structure ตัวอย่าง (RWC)

```
[row]
[col span__sm="12"]
[accordion]
[accordion-item title="เลือกอ่านตามหัวข้อ"]
<ul><li><a href="#topic-1">หัวข้อแรก</a></li></ul>
[/accordion-item]
[/accordion]
[/col]
[/row]

[row]
[col span__sm="12"]
[scroll_to link="#topic-1" bullet="false"]
[ux_text]<h2><b>หัวข้อแรก</b></h2>[/ux_text]
[ux_text]<p>เนื้อหา...</p>[/ux_text]
[/col]
[col span__sm="12"]
[ux_image id="10001" image_size="original"]
[/col]
[/row]

[row]
[col span__sm="12"]
[block id="12669"]
[block id="12482"]
[/col]
[/row]
```

### รูปแบบ Input ที่รองรับ

```markdown
## หัวข้อ H2 (ใช้แบ่ง section)
เนื้อหาย่อหน้า paragraph

### หัวข้อ H3 (แสดงใน content ปกติ)

- bullet list
- รายการย่อย

| คอลัมน์ 1 | คอลัมน์ 2 |
|-----------|-----------|
| ข้อมูล    | ข้อมูล    |

**bold**, *italic*
```

---

## 6. UI Components (`page.tsx`)

| Component | หน้าที่ | State |
|-----------|---------|-------|
| Textarea (ซ้าย) | รับเนื้อหา Markdown | `inputContent` |
| Upload button | อัปโหลด .md/.txt | - |
| Template Selector | เลือก 3 template | `templateType` |
| Settings Accordion | ปรับ Block IDs | `isSettingsOpen` |
| Generate button | สั่งแปลง | `isGenerating` |
| Output (ขวา) | แสดง shortcode | `outputContent` |
| Copy button | คัดลอก | `isCopied` |
| User Guide | คู่มือ 3 ขั้นตอน | `isGuideOpen` |

---

## 7. Default Values ที่ควรรู้

| ค่า | Default | ความหมาย |
|-----|---------|-----------|
| `contactBlockId` | `12669` | RWC: WordPress Block ฟอร์มติดต่อ |
| `doctorBlockId` | `12482` | RWC: WordPress Block แนะนำแพทย์ |
| `standardBlockId` | `8549` | Standard: WordPress Block (1 อัน) |
| Image ID เริ่มต้น | `10001` | Placeholder รูปแรก (เพิ่มทีละ 1 ต่อ section) |

---

## 8. Known Limitations และ Design Decisions

### [lwptoc] ใน UX Builder แสดงเป็น `<p>[lwptoc]</p>`

- **สาเหตุ:** Flatsome UX Builder ไม่รู้จัก third-party shortcodes → ยัดไว้ใน Text Editor block → TinyMCE เพิ่ม `<p>` ล้อมรอบ
- **ผลกระทบ:** ไม่มี — frontend ยังทำงานได้ปกติ WordPress ประมวลผล `[lwptoc]` ก่อน render เสมอ
- **Status:** ยอมรับ behavior นี้ (Flatsome limitation ที่แก้ไขไม่ได้จาก converter)

### Image IDs เป็น Placeholder

- `[ux_image id="10001"]` เป็นแค่ placeholder ต้องเปลี่ยนเป็น ID จริงใน UX Builder
- ID จะเพิ่มขึ้นทีละ 1 ต่อ section: 10001, 10002, 10003...

### Block IDs ผูกกับ WordPress เฉพาะเว็บ

- Block IDs ของแต่ละเว็บไม่เหมือนกัน ต้องตรวจสอบจาก WordPress Admin → Blocks ของแต่ละเว็บเองก่อน

---

## 9. เอกสารประกอบ

| ไฟล์ | เนื้อหา |
|------|---------|
| `flatsome-shortcode-docs.md` | สรุป Flatsome official docs: How to generate shortcode, Lightbox shortcode, Custom Product Page layouts |
| `public/guide/ux-builder-example.png` | รูปอธิบายการ paste shortcode ใน WordPress |

---

## 10. Workflow การใช้งาน (สำหรับ Content Team)

1. รัน `npm run dev` → เปิด `http://localhost:3000`
2. **เลือก Template** ให้ตรงกับเว็บไซต์ที่จะ publish
3. **วางเนื้อหา Markdown** หรืออัปโหลดไฟล์ `.md` / `.txt`
4. (ถ้า RWC/Standard) ตรวจสอบ Block IDs ใน Settings ว่าถูกต้อง
5. กด **Generate Shortcode**
6. กด **Copy to Clipboard**
7. ใน WordPress → วาง shortcode ใน code box → คลิก **Edit with UX Builder**
8. ใน UX Builder → เปลี่ยน `[ux_image id="10001"]` เป็น ID รูปจริง

---

*อัปเดตล่าสุด: 19 กุมภาพันธ์ 2026*
*Conversation: a0ea2af5-60fd-4256-a383-54f3fdd75fe7*
