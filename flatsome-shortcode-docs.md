# 📚 สรุป Flatsome Official Docs — Shortcode Guide

> **ที่มา:** Official docs จาก UX Themes (Flatsome)
> **อัปเดต:** กุมภาพันธ์ 2026

---

## บทความที่ 1: How to Generate a Shortcode

**🔗 Source:** [docs.uxthemes.com/article/223](https://docs.uxthemes.com/article/223-how-to-generate-a-shortcode)

### สรุป

Flatsome แนะนำให้ใช้ **UX Builder** เป็นวิธีหลักในการสร้าง shortcode แทนการพิมพ์มือ เพราะง่ายและไม่มีโอกาสพิมพ์ผิด

### ขั้นตอน (6 ขั้นตอน)

| ขั้นที่ | การกระทำ |
|--------|-----------|
| 1 | สร้าง **หน้าใหม่ (blank page)** ขึ้นมา |
| 2 | เปิดหน้านั้นด้วย **UX Builder** |
| 3 | สร้าง element และจัดสไตล์ตามต้องการ |
| 4 | **บันทึกหน้า (Save)** |
| 5 | เปิดหน้าเดิมใน **WP Editor ปกติ** (ไม่ใช่ UX Builder) |
| 6 | จะเห็น **shortcode ที่ UX Builder สร้างให้** → คัดลอกไปใช้ได้ทุกที่ (เช่น ใน Header) |

> [!TIP]
> เทคนิคนี้มีประโยชน์มากเมื่อต้องการใส่ shortcode ใน **Header, Footer, หรือ Widget** ที่ไม่มี UX Builder ให้กด — ให้สร้างใน blank page ก่อน แล้วค่อย copy shortcode ไปวาง

---

## บทความที่ 2: Lightbox Shortcode

**🔗 Source:** [docs.uxthemes.com/article/229](https://docs.uxthemes.com/article/229-lightbox-shortcode)

### สรุป

`[lightbox]` คือ shortcode ที่ทำให้เนื้อหา **ป๊อปอัพขึ้นมาแบบ overlay** เมื่อผู้เข้าชมกดลิงก์หรือปุ่ม โดยใช้ **`#link-id`** เป็นตัวเชื่อม (trigger ↔ lightbox)

### หลักการทำงาน

```
[button link="#test"]   ←── กดปุ่มนี้
[lightbox id="test"]    ←── แล้ว lightbox ID เดียวกันจะเปิดขึ้น
```

---

### รูปแบบที่ 1: Basic Lightbox (เปิดด้วยปุ่ม)

**ใช้เมื่อ:** ต้องการให้ผู้ใช้กดปุ่มก่อนถึงจะเห็นเนื้อหา

```
[button text="Lightbox Button" link="#test"]
[lightbox id="test" width="600px" padding="20px"]
  Insert lightbox content here...
[/lightbox]
```

| Parameter | ค่าตัวอย่าง | ความหมาย |
|-----------|------------|----------|
| `id` | `test` | ชื่อ ID ที่ต้องตรงกับ `link="#test"` ของปุ่ม |
| `width` | `600px` | ความกว้างของ popup |
| `padding` | `20px` | ระยะขอบด้านใน |

---

### รูปแบบที่ 2: Newsletter Lightbox (เปิดด้วยลิงก์ข้อความ)

**ใช้เมื่อ:** ต้องการให้คลิกข้อความธรรมดาแล้ว popup ขึ้น เช่น ลิงก์สมัครรับข่าวสาร

```
<a href="#newsletter-signup-link">
  <span class="icon-envelop"></span> Newsletter Signup
</a>

[lightbox id="newsletter-signup-link" width="600px" padding="20px"]
  [ux_banner bg="http://imageurl" height="400px" ...]
    <h3>Sign up for Newsletter</h3>
    [ninja_forms_display_form id=1]
  [/ux_banner]
[/lightbox]
```

> [!NOTE]
> ตัวอย่างนี้ใส่ **Banner + ฟอร์มสมัคร** ไว้ใน lightbox ได้เลย แสดงให้เห็นว่าข้างใน `[lightbox]` ใส่ shortcode ซ้อนกันได้

---

### รูปแบบที่ 3: Auto-Open Lightbox — เปิดทุกครั้ง (`always`)

**ใช้เมื่อ:** ต้องการให้ popup เปิดอัตโนมัติหลังจากผู้ใช้เข้าหน้านั้น **ทุกครั้งที่เข้า**

```
[lightbox
  auto_open="true"
  auto_timer="3000"
  auto_show="always"
  id="newsletter-signup-link"
  width="600px"
  padding="20px"
]
  ...เนื้อหา...
[/lightbox]
```

| Parameter | ค่า | ความหมาย |
|-----------|-----|----------|
| `auto_open` | `true` | เปิดอัตโนมัติ |
| `auto_timer` | `3000` | หน่วงเวลา 3 วินาที (มิลลิวินาที) |
| `auto_show` | `always` | แสดงทุกครั้งที่โหลดหน้า |

---

### รูปแบบที่ 4: Auto-Open Lightbox — เปิดครั้งเดียว (`once`)

**ใช้เมื่อ:** ต้องการให้ popup เปิดอัตโนมัติ **แค่ครั้งแรกครั้งเดียว** ต่อผู้ใช้ (บันทึกใน cookie)

```
[lightbox
  auto_open="true"
  auto_timer="3000"
  auto_show="once"
  id="newsletter-signup-link"
  width="600px"
  padding="20px"
]
  ...เนื้อหา...
[/lightbox]
```

| `auto_show` | พฤติกรรม |
|-------------|---------|
| `always` | เปิดทุกครั้งที่ refresh หน้า |
| `once` | เปิดเพียงครั้งเดียวต่อ session/cookie |

---

## บทความที่ 3: Shortcodes for Custom Product Page Layout

**🔗 Source:** [docs.uxthemes.com/article/247](https://docs.uxthemes.com/article/247-custom-product-page-layout-shortcodes)

### สรุป

Flatsome เตรียม shortcode สำเร็จรูปสำหรับ **หน้าสินค้า WooCommerce** ไว้ให้ 7 layout หลัก เพื่อให้ copy ไปวางในหน้าสินค้า แล้วปรับแต่งต่อใน UX Builder ได้เลย

### Element ที่ปรากฏในทุก Layout

| Shortcode | หน้าที่ |
|-----------|---------|
| `[ux_product_gallery]` | แกลเลอรีรูปสินค้า |
| `[ux_product_breadcrumbs]` | Navigation breadcrumb |
| `[ux_product_title]` | ชื่อสินค้า |
| `[ux_product_rating]` | คะแนนรีวิว |
| `[ux_product_price]` | ราคา |
| `[ux_product_excerpt]` | คำอธิบายสั้น |
| `[ux_product_add_to_cart]` | ปุ่มเพิ่มลงตะกร้า |
| `[ux_product_meta]` | ข้อมูล meta (SKU, หมวดหมู่) |
| `[share]` | ปุ่ม share |
| `[ux_product_tabs]` | แท็บรายละเอียด/รีวิว |
| `[ux_product_upsell]` | สินค้าที่แนะนำ (Upsell) |
| `[ux_product_related]` | สินค้าที่เกี่ยวข้อง |
| `[ux_sidebar id="product-sidebar"]` | Sidebar (เฉพาะ layout ที่มี sidebar) |

---

### Layout ที่ 1: Left Sidebar (Full-height)

**โครงสร้าง:** Sidebar ซ้าย (span 3) | รูปสินค้า + ข้อมูล (span 9)

```
[row]
  [col span="3" span__sm="12"]
    [ux_sidebar id="product-sidebar"]
  [/col]
  [col span="9" span__sm="12"]
    [row_inner]
      [col_inner span="6" span__sm="12"] [ux_product_gallery] [/col_inner]
      [col_inner span="6" span__sm="12"]
        [ux_product_breadcrumbs] [ux_product_title] [ux_product_rating]
        [ux_product_price] [ux_product_excerpt] [ux_product_add_to_cart]
        [ux_product_meta] [share]
      [/col_inner]
    [/row_inner]
    [ux_product_tabs] [ux_product_upsell style="grid"] [ux_product_related]
  [/col]
[/row]
```

---

### Layout ที่ 2: Right Sidebar (Full-height)

**โครงสร้าง:** รูปสินค้า + ข้อมูล (span 9) | Sidebar ขวา (span 3)

```
[row]
  [col span="9" span__sm="12"]
    [row_inner]
      [col_inner span="6" span__sm="12"] [ux_product_gallery] [/col_inner]
      [col_inner span="6" span__sm="12"]
        [ux_product_breadcrumbs] [ux_product_title] [ux_product_rating]
        [ux_product_price] [ux_product_excerpt] [ux_product_add_to_cart]
        [ux_product_meta] [share]
      [/col_inner]
    [/row_inner]
    [ux_product_tabs] [ux_product_upsell style="grid"] [ux_product_related]
  [/col]
  [col span="3" span__sm="12"]
    [ux_sidebar id="product-sidebar"]
  [/col]
[/row]
```

---

### Layout ที่ 3: Wide Gallery Layout

**โครงสร้าง:** รูปแบบ full-width gallery ด้านบน ข้อมูลสินค้า 2 คอลัมน์ด้านล่าง

```
[ux_product_gallery style="full-width"]
[row]
  [col span="7" span__sm="12"]
    [ux_product_breadcrumbs] [ux_product_title] [ux_product_excerpt] [share]
  [/col]
  [col span="5" span__sm="12" padding="30px 30px 30px 30px" bg_color="rgba(233,228,228,0.67)"]
    [ux_product_price] [ux_product_add_to_cart] [ux_product_meta]
  [/col]
[/row]
[row]
  [col span__sm="12"]
    [ux_product_tabs] [ux_product_upsell style="grid"] [ux_product_related]
  [/col]
[/row]
```

---

### Layout ที่ 4: Left Sidebar Layout (Standard)

**โครงสร้าง:** Sidebar ซ้าย (3) | รูปสินค้า (6) | ข้อมูลสินค้า (3)

```
[row]
  [col span="3" span__sm="12"] [ux_sidebar id="product-sidebar"] [/col]
  [col span="6" span__sm="12"] [ux_product_gallery] [/col]
  [col span="3" span__sm="12"]
    [ux_product_breadcrumbs] [ux_product_title] [ux_product_rating]
    [ux_product_price] [ux_product_excerpt] [ux_product_add_to_cart]
    [ux_product_meta] [share]
  [/col]
[/row]
[ux_product_tabs] [ux_product_upsell style="grid"] [ux_product_related]
```

---

### Layout ที่ 5: Right Sidebar Layout (Standard)

**โครงสร้าง:** ข้อมูลสินค้า (3) | รูปสินค้า (6) | Sidebar ขวา (3)

```
[row]
  [col span="3" span__sm="12"]
    [ux_product_breadcrumbs] [ux_product_title] [ux_product_rating]
    [ux_product_price] [ux_product_excerpt] [ux_product_add_to_cart]
    [ux_product_meta] [share]
  [/col]
  [col span="6" span__sm="12"] [ux_product_gallery] [/col]
  [col span="3" span__sm="12"] [ux_sidebar id="product-sidebar"] [/col]
[/row]
[ux_product_tabs] [ux_product_upsell style="grid"] [ux_product_related]
```

---

### Layout ที่ 6: Left Sidebar Small Layout

**โครงสร้าง:** Sidebar เล็กซ้าย (2) | ข้อมูลสินค้า (4) | รูปสินค้าใหญ่ขวา (6)

```
[row]
  [col span="2" span__sm="12"] [ux_sidebar id="product-sidebar"] [/col]
  [col span="4" span__sm="12"]
    [ux_product_breadcrumbs] [ux_product_title] [ux_product_rating]
    [ux_product_price] [ux_product_excerpt] [ux_product_add_to_cart]
    [ux_product_meta] [share]
  [/col]
  [col span="6" span__sm="12"] [ux_product_gallery] [/col]
[/row]
[ux_product_tabs] [ux_product_upsell style="grid"] [ux_product_related]
```

---

### Layout ที่ 7: Right Sidebar Small Layout

**โครงสร้าง:** รูปสินค้าใหญ่ซ้าย (6) | ข้อมูลสินค้า (4) + Sidebar เล็กขวา (2)

```
[row]
  [col span="4" span__sm="12"]
    [ux_product_breadcrumbs] [ux_product_title] [ux_product_rating]
    [ux_product_price] [ux_product_excerpt] [ux_product_add_to_cart]
    [ux_product_meta] [share]
  [/col]
  [col span="6" span__sm="12"] [ux_product_gallery] [/col]
  [col span="2" span__sm="12"] [ux_sidebar id="product-sidebar"] [/col]
[/row]
[ux_product_tabs] [ux_product_upsell style="grid"] [ux_product_related]
```

---

### ตารางเปรียบเทียบ Layout ทั้ง 7

| # | Layout | Sidebar | Gallery | ข้อมูลสินค้า | span syntax |
|---|--------|---------|---------|--------------|------------|
| 1 | Left Sidebar Full-height | ซ้าย (3) | ใน col ขวา (6/12) | ใน col ขวา (6/12) | row_inner ซ้อน |
| 2 | Right Sidebar Full-height | ขวา (3) | ใน col ซ้าย (6/12) | ใน col ซ้าย (6/12) | row_inner ซ้อน |
| 3 | Wide Gallery | ไม่มี | Full-width บนสุด | 7+5 ด้านล่าง | แยก row |
| 4 | Left Sidebar Standard | ซ้าย (3) | กลาง (6) | ขวา (3) | 3 col เท่ากัน |
| 5 | Right Sidebar Standard | ขวา (3) | กลาง (6) | ซ้าย (3) | 3 col เท่ากัน |
| 6 | Left Sidebar Small | ซ้ายเล็ก (2) | ขวาใหญ่ (6) | กลาง (4) | sidebar เล็ก |
| 7 | Right Sidebar Small | ขวาเล็ก (2) | ซ้ายใหญ่ (6) | ซ้าย (4) | sidebar เล็ก |

> [!NOTE]
> `span` คือสัดส่วนบน desktop (สูงสุด 12 คอลัมน์ เช่น span="6" = ครึ่งหน้า)
> `span__sm="12"` คือบนมือถือให้เต็มความกว้างเสมอ

---

## สรุปภาพรวม: เมื่อไหรใช้อะไร?

| สถานการณ์ | ใช้ |
|-----------|-----|
| อยากสร้าง shortcode แต่ไม่รู้จะพิมพ์ยังไง | วิธี UX Builder → copy จาก WP Editor |
| ต้องการ popup โชว์ฟอร์ม/โปรโมชัน เมื่อกดลิงก์ | `[lightbox]` + `[button]` |
| ต้องการ popup โชว์อัตโนมัติทุกครั้งที่เข้าเว็บ | `[lightbox auto_show="always"]` |
| ต้องการ popup โชว์ครั้งเดียวต่อผู้ใช้ | `[lightbox auto_show="once"]` |
| ต้องการจัดหน้าสินค้า WooCommerce แบบ custom | เลือก layout จาก 7 แบบด้านบน |
