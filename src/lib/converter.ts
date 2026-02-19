/**
 * Conversion Logic สำหรับแปลงเนื้อหาบทความเป็น WordPress Flatsome Shortcode
 */

import { marked } from 'marked';

export type TemplateType = 'rwc' | 'standard' | 'universal';

export interface ConversionSettings {
    templateType: TemplateType;
    // RWC
    contactBlockId: string;
    doctorBlockId: string;
    // Standard
    standardBlockId: string;
}

export interface ConversionResult {
    output: string;
    headings: { text: string; anchor: string }[];
}

/**
 * แปลง Markdown เป็น HTML
 */
function parseMarkdownToHTML(markdown: string): string {
    if (!markdown || !markdown.trim()) return '';

    // Configure marked options
    marked.setOptions({
        breaks: true,
        gfm: true, // GitHub Flavored Markdown (รองรับ tables)
    });

    // แปลง Markdown เป็น HTML
    let html = marked.parse(markdown) as string;

    // ลบ <p> wrapper ที่ marked เพิ่มเข้ามาให้ตรงกับ list items
    // เพราะเราจะจัดการ paragraph เอง
    html = html.trim();

    return html;
}

/**
 * ทำความสะอาด HTML และปรับแต่งสำหรับ WordPress
 */
function cleanHTML(html: string): string {
    // เพิ่ม class="table" และ inline styles ให้กับ <table> tags
    html = html.replace(
        /<table>/g,
        '<table class="table" style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">'
    );

    // เพิ่ม inline styles ให้กับ <th> (หัวตาราง)
    html = html.replace(
        /<th>/g,
        '<th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f9f9f9;">'
    );

    // เพิ่ม inline styles ให้กับ <th> ที่มี align attribute
    html = html.replace(
        /<th align="([^"]*)"/g,
        '<th style="border: 1px solid #ddd; padding: 10px; text-align: $1; background-color: #f9f9f9;"'
    );

    // เพิ่ม inline styles ให้กับ <td>
    html = html.replace(
        /<td>/g,
        '<td style="border: 1px solid #ddd; padding: 10px;">'
    );

    // เพิ่ม inline styles ให้กับ <td> ที่มี align attribute
    html = html.replace(
        /<td align="([^"]*)"/g,
        '<td style="border: 1px solid #ddd; padding: 10px; text-align: $1;"'
    );

    // ลบ <p></p> ว่างๆ ออก
    html = html.replace(/<p>\s*<\/p>/g, '');

    // ลบ newlines ที่เกินมา
    html = html.replace(/\n\n+/g, '\n');

    return html.trim();
}

/**
 * Wrap แต่ละ HTML element ด้วย [ux_text] เพื่อให้แก้ไขใน UX Builder ได้ง่าย
 */
function wrapElementsWithUxText(html: string): string {
    if (!html || !html.trim()) return '';

    const elements: string[] = [];
    const lines = html.split('\n').filter(line => line.trim());

    let currentElement = '';
    let inMultilineElement = false;
    let elementType = '';

    for (const line of lines) {
        const trimmedLine = line.trim();

        // ตรวจสอบ opening tags
        if (trimmedLine.match(/^<(h[1-6]|p|ul|ol|table)[\s>]/i)) {
            const match = trimmedLine.match(/^<(h[1-6]|p|ul|ol|table)[\s>]/i);
            elementType = match![1].toLowerCase();
            currentElement = line;
            inMultilineElement = true;

            // ถ้าเป็น single-line element (เช่น <h2>...</h2> ในบรรทัดเดียว)
            if (trimmedLine.match(new RegExp(`</${elementType}>`, 'i'))) {
                elements.push(`[ux_text]\n${currentElement}\n[/ux_text]`);
                currentElement = '';
                inMultilineElement = false;
                elementType = '';
            }
        }
        // กำลังอยู่ใน multiline element
        else if (inMultilineElement) {
            currentElement += '\n' + line;

            // ตรวจสอบ closing tag
            if (trimmedLine.match(new RegExp(`</${elementType}>`, 'i'))) {
                elements.push(`[ux_text]\n${currentElement}\n[/ux_text]`);
                currentElement = '';
                inMultilineElement = false;
                elementType = '';
            }
        }
        // บรรทัดที่ไม่ใช่ element (เผื่อมี edge case)
        else if (trimmedLine) {
            elements.push(`[ux_text]\n${line}\n[/ux_text]`);
        }
    }

    // ถ้ายังมี element ค้างอยู่
    if (currentElement) {
        elements.push(`[ux_text]\n${currentElement}\n[/ux_text]`);
    }

    return elements.join('\n');
}

/**
 * แปลงข้อความภาษาไทยเป็น slug ภาษาอังกฤษ
 */
function generateAnchor(text: string, index: number): string {
    // ลบ special characters และ whitespace
    const cleaned = text.replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s]/g, '').trim();

    // ถ้าข้อความว่าง ใช้ topic-{index}
    if (!cleaned) {
        return `topic-${index + 1}`;
    }

    // ใช้ topic-{index} สำหรับความเรียบง่าย
    return `topic-${index + 1}`;
}

/**
 * แยกเนื้อหาออกเป็น sections ตาม H2 headers
 */
function parseSections(content: string): { heading: string; content: string }[] {
    const lines = content.split('\n');
    const sections: { heading: string; content: string }[] = [];

    let currentHeading = '';
    let currentContent: string[] = [];

    for (const line of lines) {
        const h2Match = line.match(/^##\s+(.+)$/);

        if (h2Match) {
            // บันทึก section ก่อนหน้า (ถ้ามี)
            if (currentHeading || currentContent.length > 0) {
                sections.push({
                    heading: currentHeading,
                    content: currentContent.join('\n').trim(),
                });
            }

            currentHeading = h2Match[1].trim();
            currentContent = [];
        } else {
            currentContent.push(line);
        }
    }

    // บันทึก section สุดท้าย
    if (currentHeading || currentContent.length > 0) {
        sections.push({
            heading: currentHeading,
            content: currentContent.join('\n').trim(),
        });
    }

    return sections;
}

/**
 * สร้าง Flatsome Shortcode จาก sections (ใช้ [row] และ [col] structure)
 */
function generateShortcode(
    sections: { heading: string; content: string }[],
    settings: ConversionSettings
): ConversionResult {
    const headings: { text: string; anchor: string }[] = [];
    const outputParts: string[] = [];

    let headingIndex = 0;
    let imageCounter = 1;

    // สร้าง Table of Contents (สารบัญ)
    const tocHeadings: string[] = [];

    sections.forEach((section) => {
        if (section.heading) {
            const anchor = generateAnchor(section.heading, headingIndex);
            headings.push({ text: section.heading, anchor });

            // ลบ markdown symbols ออกจาก TOC link text
            const cleanTocText = section.heading
                .replace(/\*\*/g, '')  // ลบ **
                .replace(/__/g, '')    // ลบ __
                .replace(/^#+\s*/, '') // ลบ # ต้นบรรทัด
                .trim();

            tocHeadings.push(`<a href="#${anchor}">${cleanTocText}</a>`);
            headingIndex++;
        }
    });

    // เพิ่ม TOC ตาม template
    if (settings.templateType === 'rwc' && tocHeadings.length > 0) {
        // RWC: Flatsome Accordion TOC
        outputParts.push(`[row]`);
        outputParts.push(`[col span__sm="12"]`);
        outputParts.push(`[accordion]`);
        outputParts.push(`[accordion-item title="เลือกอ่านตามหัวข้อ"]`);
        outputParts.push(`<ul>`);
        tocHeadings.forEach((toc) => {
            outputParts.push(`<li>${toc}</li>`);
        });
        outputParts.push(`</ul>`);
        outputParts.push(`[/accordion-item]`);
        outputParts.push(`[/accordion]`);
        outputParts.push(`[/col]`);
        outputParts.push(`[/row]`);
        outputParts.push('');
    } else if (settings.templateType === 'standard') {
        // Standard: LuckyWP TOC shortcode วางแบบ standalone
        // ไม่ใช้ [row][col] wrapper เพื่อป้องกัน WordPress wpautop เพิ่ม <p> รอบมัน
        outputParts.push(`[lwptoc]`);
        outputParts.push('');
    }
    // Universal: ไม่มี TOC

    // Reset heading index for actual content
    headingIndex = 0;

    // สร้างเนื้อหาแต่ละ section
    sections.forEach((section) => {
        if (!section.heading && !section.content) return;

        // เริ่ม [row] สำหรับแต่ละ section
        outputParts.push(`[row]`);

        // [col] แรก: หัวข้อ + เนื้อหา
        outputParts.push(`[col span__sm="12"]`);

        // เพิ่ม H2 Header พร้อม scroll_to anchor (scroll_to อยู่ข้างนอก ติดกับ ux_text)
        if (section.heading) {
            const anchor = generateAnchor(section.heading, headingIndex);
            // ลบ markdown symbols ออกจาก heading (**, #, etc.)
            const cleanHeading = section.heading
                .replace(/\*\*/g, '')  // ลบ **
                .replace(/__/g, '')    // ลบ __
                .replace(/^#+\s*/, '') // ลบ # ต้นบรรทัด
                .trim();

            outputParts.push(`[scroll_to link="#${anchor}" bullet="false"]`);
            outputParts.push(`[ux_text]`);
            outputParts.push(`<h2><b>${cleanHeading}</b></h2>`);
            outputParts.push(`[/ux_text]`);
            headingIndex++;
        }

        // เพิ่มเนื้อหา (แปลง Markdown เป็น HTML และ wrap ด้วย ux_text)
        if (section.content) {
            // แปลง Markdown เป็น HTML
            const htmlContent = parseMarkdownToHTML(section.content);
            const cleanedHTML = cleanHTML(htmlContent);

            // Wrap แต่ละ element ด้วย [ux_text]
            const wrappedHTML = wrapElementsWithUxText(cleanedHTML);

            // วาง HTML ที่ wrap แล้วลงไปตรงๆ
            if (wrappedHTML) {
                outputParts.push(wrappedHTML);
            }
        }

        outputParts.push(`[/col]`);

        // [col] ที่สอง: รูปภาพ (ถ้ามี heading)
        if (section.heading) {
            outputParts.push(`[col span__sm="12"]`);
            outputParts.push(`[ux_image id="${10000 + imageCounter}" image_size="original"]`);
            outputParts.push(`[/col]`);
            imageCounter++;
        }

        // ปิด [row]
        outputParts.push(`[/row]`);
        outputParts.push('');
    });

    // เพิ่ม Footer Blocks ตาม template
    if (settings.templateType === 'rwc') {
        outputParts.push(`[row]`);
        outputParts.push(`[col span__sm="12"]`);
        outputParts.push(`[block id="${settings.contactBlockId}"]`);
        outputParts.push(`[block id="${settings.doctorBlockId}"]`);
        outputParts.push(`[/col]`);
        outputParts.push(`[/row]`);
    } else if (settings.templateType === 'standard') {
        outputParts.push(`[row]`);
        outputParts.push(`[col span__sm="12"]`);
        outputParts.push(`[block id="${settings.standardBlockId}"]`);
        outputParts.push(`[/col]`);
        outputParts.push(`[/row]`);
    }
    // Universal: ไม่มี footer

    return {
        output: outputParts.join('\n'),
        headings,
    };
}

/**
 * Main conversion function
 */
export function convertToShortcode(
    content: string,
    settings: ConversionSettings
): ConversionResult {
    // ตรวจสอบ input
    if (!content.trim()) {
        return {
            output: '',
            headings: [],
        };
    }

    // แยก sections
    const sections = parseSections(content);

    // สร้าง shortcode
    return generateShortcode(sections, settings);
}
