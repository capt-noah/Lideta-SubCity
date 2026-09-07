/**
 * generate_pdf.mjs
 * Generates a professional APA-standard PDF from SRS.md
 * Features:
 *   - APA typography: Times New Roman 12pt, 1-inch margins, double-spaced body
 *   - Professional cover page with official seal-style header
 *   - Running head + page numbers on every page (via CSS @page)
 *   - Proper section hierarchy with numbered headings
 *   - Tables styled to APA format (no vertical rules, top/bottom horizontal rules)
 *   - Code blocks in a distinct monospace style
 *   - Confidentiality footer on every page
 *   - All fonts embedded via system fonts (no network dependency)
 */

import fs   from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.join(__dirname, '..')
const SRC       = path.join(ROOT, 'SRS.md')
const HTML_OUT  = path.join(ROOT, 'SRS.html')
const PDF_OUT   = path.join(ROOT, 'SRS.pdf')

// ─── Markdown → HTML (comprehensive parser for SRS content) ──────────────────
function mdToHtml(md) {
  // Step 1: extract fenced code blocks and replace with placeholders
  const codeBlocks = []
  let html = md.replace(/```([\w]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    codeBlocks.push(`<pre><code class="lang-${lang || 'text'}">${escaped}</code></pre>`)
    return `%%CODEBLOCK_${idx}%%`
  })

  // Step 2: escape remaining HTML entities
  html = html.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;')

  // Step 3: tables
  html = html.replace(/((?:\|[^\n]+\|\n)+)/g, (block) => {
    const rows = block.trim().split('\n').filter(r => r.trim())
    if (rows.length < 2) return block
    // Skip separator row (---|---)
    const headerRow = rows[0]
    const dataRows  = rows.slice(2) // skip separator
    const ths = headerRow.split('|').slice(1, -1).map(c =>
      `<th>${c.trim()}</th>`).join('')
    const trs = dataRows.map(r => {
      const tds = r.split('|').slice(1, -1).map(c =>
        `<td>${c.trim()}</td>`).join('')
      return `<tr>${tds}</tr>`
    }).join('\n')
    return `<table>\n<thead><tr>${ths}</tr></thead>\n<tbody>${trs}</tbody>\n</table>\n`
  })

  // Step 4: headings (with anchor IDs)
  html = html.replace(/^#{6} (.+)$/gm, (_, t) => `<h6>${t}</h6>`)
  html = html.replace(/^#{5} (.+)$/gm, (_, t) => `<h5>${t}</h5>`)
  html = html.replace(/^#{4} (.+)$/gm, (_, t) => `<h4>${t}</h4>`)
  html = html.replace(/^#{3} (.+)$/gm, (_, t) => `<h3>${t}</h3>`)
  html = html.replace(/^#{2} (.+)$/gm, (_, t) => {
    const id = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return `<h2 id="${id}">${t}</h2>`
  })
  html = html.replace(/^#{1} (.+)$/gm, (_, t) => {
    const id = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return `<h1 id="${id}">${t}</h1>`
  })

  // Step 5: horizontal rules
  html = html.replace(/^[-*_]{3,}$/gm, '<hr class="section-rule">')

  // Step 6: inline formatting
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g,          '<strong>$1</strong>')
  html = html.replace(/\*([^*\n]+?)\*/g,     '<em>$1</em>')
  html = html.replace(/_([^_\n]+?)_/g,       '<em>$1</em>')
  html = html.replace(/`([^`\n]+?)`/g,       '<code>$1</code>')

  // Step 7: links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="doc-link">$1</a>')

  // Step 8: blockquotes
  html = html.replace(/((?:^> .+\n?)+)/gm, (block) => {
    const content = block.replace(/^> /gm, '').trim()
    return `<blockquote><p>${content}</p></blockquote>\n`
  })

  // Step 9: unordered lists (handles nested)
  html = html.replace(/((?:^[ \t]*[-*+] .+\n?)+)/gm, (block) => {
    const items = block.trim().split('\n').map(l => {
      const text = l.replace(/^[ \t]*[-*+] /, '')
      return `  <li><p>${text}</p></li>`
    }).join('\n')
    return `<ul>\n${items}\n</ul>\n`
  })

  // Step 10: ordered lists
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (block) => {
    const items = block.trim().split('\n').map(l => {
      const text = l.replace(/^\d+\. /, '')
      return `  <li><p>${text}</p></li>`
    }).join('\n')
    return `<ol>\n${items}\n</ol>\n`
  })

  // Step 11: paragraphs — split on double newlines, wrap non-tagged blocks
  const tagged = /^<(h[1-6]|ul|ol|table|pre|blockquote|hr|div|%%)/
  html = html.split(/\n{2,}/).map(block => {
    const trimmed = block.trim()
    if (!trimmed) return ''
    if (tagged.test(trimmed)) return trimmed
    // Convert single newlines within a paragraph to spaces (APA: no mid-para breaks)
    const cleaned = trimmed.replace(/\n/g, ' ')
    return `<p>${cleaned}</p>`
  }).join('\n\n')

  // Step 12: restore code blocks
  codeBlocks.forEach((code, idx) => {
    html = html.replace(`%%CODEBLOCK_${idx}%%`, code)
  })

  // Step 13: clean up any stray placeholder paragraphs
  html = html.replace(/<p>(%%CODEBLOCK_\d+%%)<\/p>/g, '$1')

  return html
}

// ─── Build the HTML ───────────────────────────────────────────────────────────
const markdown = fs.readFileSync(SRC, 'utf8')
const body     = mdToHtml(markdown)

const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>LSC-SRS-001 — Lideta Sub-City Official Website and Administration System</title>
<style>

/* ════════════════════════════════════════════════════════
   APA 7th Edition — IEEE SRS Document Stylesheet
   Times New Roman 12pt · Double-spaced · 1-inch margins
   Black and white — no decorative color
   ════════════════════════════════════════════════════════ */

@page {
  size: A4;
  margin: 25.4mm 25.4mm 25.4mm 31.75mm;
}

@page :first {
  margin: 25.4mm 25.4mm 25.4mm 31.75mm;
}

@page body-page {
  size: A4;
  margin: 25.4mm 25.4mm 25.4mm 31.75mm;
  @top-left {
    content: "RUNNING HEAD: LSC OFFICIAL WEBSITE AND ADMINISTRATION SYSTEM — SRS v1.0.0";
    font-family: "Times New Roman", Times, serif;
    font-size: 8pt;
    font-weight: bold;
    color: #000;
    margin-top: 8mm;
  }
  @top-right {
    content: counter(page);
    font-family: "Times New Roman", Times, serif;
    font-size: 10pt;
    color: #000;
    margin-top: 8mm;
  }
  @bottom-center {
    content: "CONFIDENTIAL — LIDETA SUB-CITY ADMINISTRATION — INTERNAL USE ONLY";
    font-family: "Times New Roman", Times, serif;
    font-size: 7pt;
    letter-spacing: 0.05em;
    color: #000;
    border-top: 0.5pt solid #000;
    padding-top: 2mm;
  }
}

*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: #fff;
}

body {
  font-family: "Times New Roman", Times, serif;
  font-size: 12pt;
  line-height: 2;
  color: #000;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ════════════════════════════════════════════════════════
   COVER PAGE — APA title page format
   Centered block, no color, institutional letterhead style
   ════════════════════════════════════════════════════════ */

.cover-page {
  width: 210mm;
  min-height: 297mm;
  page-break-after: always;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 25.4mm 31.75mm;
  font-family: "Times New Roman", Times, serif;
  background: #fff;
}

/* Institution header — top of page, centered */
.cover-institution {
  width: 100%;
  text-align: center;
  border-bottom: 1.5pt solid #000;
  padding-bottom: 12pt;
  margin-bottom: 12pt;
}

.cover-institution-name {
  font-size: 13pt;
  font-weight: bold;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1.4;
  color: #000;
}

.cover-institution-sub {
  font-size: 11pt;
  font-weight: normal;
  line-height: 1.5;
  color: #000;
}

/* Running head line — APA requirement */
.cover-running-head {
  width: 100%;
  font-size: 9pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #000;
  margin-bottom: 60pt;
  text-align: left;
}

/* Title block — vertically centered in upper half */
.cover-title-block {
  width: 100%;
  text-align: center;
  margin-bottom: 36pt;
}

.cover-doc-type {
  font-size: 11pt;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #000;
  margin-bottom: 18pt;
  line-height: 1.5;
}

.cover-title {
  font-size: 18pt;
  font-weight: bold;
  line-height: 1.35;
  color: #000;
  margin-bottom: 12pt;
}

.cover-subtitle {
  font-size: 12pt;
  font-weight: normal;
  font-style: italic;
  line-height: 1.6;
  color: #000;
  margin-bottom: 0;
}

/* Metadata block — lower third of cover */
.cover-meta {
  width: 100%;
  margin-top: auto;
  padding-top: 48pt;
}

.cover-meta-rule {
  border: none;
  border-top: 1pt solid #000;
  margin: 0 0 12pt 0;
}

.cover-meta-row {
  display: flex;
  font-size: 11pt;
  line-height: 1.9;
  color: #000;
}

.cover-meta-label {
  font-weight: bold;
  width: 130pt;
  flex-shrink: 0;
}

.cover-meta-value {
  flex: 1;
  font-weight: normal;
}

.cover-classification-block {
  margin-top: 24pt;
  border-top: 1pt solid #000;
  border-bottom: 1pt solid #000;
  padding: 8pt 0;
  text-align: center;
}

.cover-classification-text {
  font-size: 10pt;
  font-weight: bold;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #000;
}

/* ════════════════════════════════════════════════════════
   BODY PAGES
   ════════════════════════════════════════════════════════ */

.doc-body {
  page: body-page;
  counter-reset: page 1;
}

/* APA Heading Level 1 — centered, bold, Title Case */
h1 {
  font-family: "Times New Roman", Times, serif;
  font-size: 14pt;
  font-weight: bold;
  text-align: center;
  color: #000;
  /* No top or bottom margin — paragraph spacing provides separation */
  margin: 0;
  padding: 0;
  line-height: 2;
  page-break-before: always;
  page-break-after: avoid;
  border: none;
}

.doc-body h1:first-child { page-break-before: auto; }

/* APA Heading Level 2 — left-aligned, bold */
h2 {
  font-family: "Times New Roman", Times, serif;
  font-size: 13pt;
  font-weight: bold;
  text-align: left;
  color: #000;
  margin: 0;
  padding: 0;
  line-height: 2;
  page-break-after: avoid;
  border: none;
}

/* APA Heading Level 3 — left-aligned, bold italic */
h3 {
  font-family: "Times New Roman", Times, serif;
  font-size: 12pt;
  font-weight: bold;
  font-style: italic;
  text-align: left;
  color: #000;
  margin: 0;
  padding: 0;
  line-height: 2;
  page-break-after: avoid;
}

/* APA Heading Level 4 — indented, bold */
h4 {
  font-family: "Times New Roman", Times, serif;
  font-size: 12pt;
  font-weight: bold;
  text-align: left;
  color: #000;
  margin: 0;
  padding: 0 0 0 24pt;
  line-height: 2;
  page-break-after: avoid;
}

/* Body paragraphs */
p {
  font-family: "Times New Roman", Times, serif;
  font-size: 12pt;
  line-height: 2;
  text-align: justify;
  margin: 0;
  color: #000;
}

/* Lists */
ul, ol {
  font-family: "Times New Roman", Times, serif;
  font-size: 12pt;
  line-height: 2;
  margin: 0 0 0 36pt;
  padding: 0;
  color: #000;
}

ul { list-style-type: disc; }
ol { list-style-type: decimal; }
li { margin: 0; padding-left: 6pt; }
li p { margin: 0; text-indent: 0; }

/* Horizontal rule */
hr.section-rule {
  border: none;
  border-top: 1pt solid #000;
  margin: 12pt 0;
}

/* Blockquote */
blockquote {
  font-family: "Times New Roman", Times, serif;
  font-size: 12pt;
  line-height: 2;
  margin: 0 36pt;
  padding: 0;
  border: none;
  color: #000;
}

blockquote p { text-indent: 0; font-style: italic; }

/* ════════════════════════════════════════════════════════
   TABLES — strict APA format
   No vertical borders anywhere, no right border on pre
   ════════════════════════════════════════════════════════ */
table {
  font-family: "Times New Roman", Times, serif;
  font-size: 10.5pt;
  line-height: 1.5;
  width: 100%;
  border-collapse: collapse;
  margin: 6pt 0 12pt;
  page-break-inside: avoid;
  color: #000;
  /* APA: no outer box border */
  border: none;
}

thead tr {
  border-top: 1.5pt solid #000;
  border-bottom: 1pt solid #000;
}

thead th {
  font-weight: bold;
  font-size: 10.5pt;
  text-align: left;
  padding: 4pt 8pt;
  vertical-align: bottom;
  color: #000;
  background: #fff;
  /* No vertical borders */
  border-left: none;
  border-right: none;
}

tbody tr { border: none; }

/* Bottom rule only on last data row */
tbody tr:last-child {
  border-bottom: 1.5pt solid #000;
}

td {
  padding: 3pt 8pt;
  vertical-align: top;
  text-align: left;
  color: #000;
  /* No borders at all */
  border: none;
  font-size: 10.5pt;
  line-height: 1.5;
}

/* Very subtle alternating row — APA-acceptable */
tbody tr:nth-child(even) td { background: #f5f5f5; }

/* ════════════════════════════════════════════════════════
   CODE
   ════════════════════════════════════════════════════════ */
code {
  font-family: "Courier New", Courier, monospace;
  font-size: 9.5pt;
  background: #f4f4f4;
  padding: 1pt 3pt;
  /* Only top and bottom border — no sides */
  border-top: 0.5pt solid #ccc;
  border-bottom: 0.5pt solid #ccc;
  border-left: none;
  border-right: none;
  line-height: 1;
}

pre {
  font-family: "Courier New", Courier, monospace;
  font-size: 8.5pt;
  line-height: 1.45;
  background: #f8f8f8;
  /* Only top and bottom border — no left accent, no right border */
  border-top: 1pt solid #999;
  border-bottom: 1pt solid #999;
  border-left: none;
  border-right: none;
  padding: 10pt 12pt;
  margin: 6pt 0 12pt;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-all;
  page-break-inside: avoid;
}

pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: 8.5pt;
  color: #000;
}

/* Links */
a.doc-link {
  color: #000;
  text-decoration: underline;
}

/* ════════════════════════════════════════════════════════
   TABLE OF CONTENTS PAGE
   ════════════════════════════════════════════════════════ */
.toc-page {
  page: body-page;
  page-break-after: always;
}

.toc-title {
  font-family: "Times New Roman", Times, serif;
  font-size: 14pt;
  font-weight: bold;
  text-align: center;
  color: #000;
  line-height: 2;
  margin: 0 0 12pt 0;
}

.toc-entry {
  font-family: "Times New Roman", Times, serif;
  font-size: 11pt;
  line-height: 1.8;
  display: flex;
  justify-content: space-between;
  border-bottom: 0.5pt dotted #999;
  padding: 1pt 0;
  color: #000;
}

.toc-entry.level1 { font-weight: bold; margin-top: 4pt; }
.toc-entry.level2 { padding-left: 18pt; }
.toc-entry.level3 { padding-left: 36pt; font-style: italic; font-size: 10.5pt; }
.toc-entry-title  { flex: 1; }
.toc-entry-page   { flex-shrink: 0; padding-left: 8pt; }

@media print {
  body { font-size: 12pt; }
  a { color: #000 !important; }
  a[href]::after { content: none; }
}

</style>
</head>
<body>

<!-- ═══════════════════════════════════════════
     COVER PAGE — APA Title Page Format
     ═══════════════════════════════════════════ -->
<div class="cover-page">

  <!-- Institution header -->
  <div class="cover-institution">
    <div class="cover-institution-name">Lideta Sub-City Administration</div>
    <div class="cover-institution-sub">Information Technology Department &nbsp;|&nbsp; Addis Ababa City Government</div>
    <div class="cover-institution-sub">Addis Ababa, Ethiopia</div>
  </div>

  <!-- APA running head line (replicated on cover per APA 7th ed.) -->
  <div class="cover-running-head">
    Running head: LSC OFFICIAL WEBSITE AND ADMINISTRATION SYSTEM SRS
  </div>

  <!-- Title block -->
  <div class="cover-title-block">
    <div class="cover-doc-type">Software Requirements Specification</div>
    <div class="cover-title">
      Lideta Sub-City Official Website<br>
      and Administration System
    </div>
    <div class="cover-subtitle">
      A technical specification for system architecture, functional requirements,<br>
      security requirements, API contracts, and deployment infrastructure
    </div>
  </div>

  <!-- Metadata block -->
  <div class="cover-meta">
    <div class="cover-meta-rule"></div>

    <div class="cover-meta-row">
      <span class="cover-meta-label">Document Number:</span>
      <span class="cover-meta-value">LSC-SRS-001</span>
    </div>
    <div class="cover-meta-row">
      <span class="cover-meta-label">Version:</span>
      <span class="cover-meta-value">1.0.0 &mdash; Final</span>
    </div>
    <div class="cover-meta-row">
      <span class="cover-meta-label">Date of Issue:</span>
      <span class="cover-meta-value">August 2026</span>
    </div>
    <div class="cover-meta-row">
      <span class="cover-meta-label">Prepared By:</span>
      <span class="cover-meta-value">Development Team, Lideta Sub-City Administration IT Department</span>
    </div>
    <div class="cover-meta-row">
      <span class="cover-meta-label">Reviewed By:</span>
      <span class="cover-meta-value">Information Network Security Administration</span>
    </div>
    <div class="cover-meta-row">
      <span class="cover-meta-label">Approved By:</span>
      <span class="cover-meta-value">Lideta Sub-City Administration</span>
    </div>
    <div class="cover-meta-row">
      <span class="cover-meta-label">Standard:</span>
      <span class="cover-meta-value">IEEE Std 830-1998 &nbsp;/&nbsp; APA Publication Manual, 7th Edition</span>
    </div>

    <div class="cover-meta-rule" style="margin-top:12pt;"></div>

    <div class="cover-classification-block">
      <div class="cover-classification-text">
        Confidential &nbsp;&mdash;&nbsp; For Internal Use Only
      </div>
      <div style="font-family:'Times New Roman',serif; font-size:9pt; color:#000; margin-top:4pt; line-height:1.4;">
        Unauthorized reproduction or distribution of this document is strictly prohibited.
      </div>
    </div>
  </div>

</div>

<!-- ═══════════════════════════════════════════════════════════
     TABLE OF CONTENTS
     ═══════════════════════════════════════════════════════════ -->
<div class="toc-page">
  <div class="toc-title">Table of Contents</div>

  <div class="toc-entry level1"><span class="toc-entry-title">1. &nbsp; Introduction</span><span class="toc-entry-page">3</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">1.1 &nbsp; Purpose</span><span class="toc-entry-page">3</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">1.2 &nbsp; Scope</span><span class="toc-entry-page">3</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">1.3 &nbsp; Definitions, Acronyms, and Abbreviations</span><span class="toc-entry-page">4</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">1.4 &nbsp; References</span><span class="toc-entry-page">5</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">1.5 &nbsp; Overview</span><span class="toc-entry-page">5</span></div>

  <div class="toc-entry level1"><span class="toc-entry-title">2. &nbsp; Overall Description</span><span class="toc-entry-page">6</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">2.1 &nbsp; Product Perspective</span><span class="toc-entry-page">6</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">2.2 &nbsp; Product Functions Summary</span><span class="toc-entry-page">6</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">2.3 &nbsp; User Classes and Characteristics</span><span class="toc-entry-page">7</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">2.4 &nbsp; Operating Environment</span><span class="toc-entry-page">7</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">2.5 &nbsp; Design and Implementation Constraints</span><span class="toc-entry-page">8</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">2.6 &nbsp; Assumptions and Dependencies</span><span class="toc-entry-page">8</span></div>

  <div class="toc-entry level1"><span class="toc-entry-title">3. &nbsp; System Architecture</span><span class="toc-entry-page">9</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">3.1 &nbsp; Architectural Pattern</span><span class="toc-entry-page">9</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">3.2 &nbsp; Front-End Architecture</span><span class="toc-entry-page">10</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">3.3 &nbsp; Back-End Architecture</span><span class="toc-entry-page">11</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">3.4 &nbsp; Data Flow Overview</span><span class="toc-entry-page">12</span></div>

  <div class="toc-entry level1"><span class="toc-entry-title">4. &nbsp; Roles and Access Control</span><span class="toc-entry-page">13</span></div>
  <div class="toc-entry level1"><span class="toc-entry-title">5. &nbsp; Functional Requirements</span><span class="toc-entry-page">16</span></div>
  <div class="toc-entry level1"><span class="toc-entry-title">6. &nbsp; Non-Functional Requirements</span><span class="toc-entry-page">26</span></div>
  <div class="toc-entry level1"><span class="toc-entry-title">7. &nbsp; Database Schema</span><span class="toc-entry-page">28</span></div>
  <div class="toc-entry level1"><span class="toc-entry-title">8. &nbsp; API Specification</span><span class="toc-entry-page">34</span></div>
  <div class="toc-entry level1"><span class="toc-entry-title">9. &nbsp; Real-Time Communication</span><span class="toc-entry-page">43</span></div>
  <div class="toc-entry level1"><span class="toc-entry-title">10. Security Requirements</span><span class="toc-entry-page">44</span></div>
  <div class="toc-entry level1"><span class="toc-entry-title">11. Deployment Architecture</span><span class="toc-entry-page">49</span></div>
  <div class="toc-entry level1"><span class="toc-entry-title">12. Appendices</span><span class="toc-entry-page">54</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">Appendix A &nbsp; Technology Stack Summary</span><span class="toc-entry-page">54</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">Appendix B &nbsp; Complete Route Tree</span><span class="toc-entry-page">55</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">Appendix C &nbsp; File Upload Paths</span><span class="toc-entry-page">56</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">Appendix D &nbsp; Environment Variable Reference</span><span class="toc-entry-page">56</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">Appendix E &nbsp; Admin Role Default Landing Paths</span><span class="toc-entry-page">57</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">Appendix F &nbsp; Satisfaction Survey Question Reference</span><span class="toc-entry-page">57</span></div>
  <div class="toc-entry level2"><span class="toc-entry-title">Appendix G &nbsp; Known Limitations and Future Recommendations</span><span class="toc-entry-page">58</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════
     DOCUMENT BODY
     ═══════════════════════════════════════════════════════════ -->
<div class="doc-body">
${body}
</div>

</body>
</html>`

fs.writeFileSync(HTML_OUT, htmlDoc, 'utf8')
console.log(`✓ HTML written → ${HTML_OUT}`)

// ─── Chrome headless PDF ──────────────────────────────────────────────────────
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Use a virtual display size large enough for A4
const cmd = `"${chrome}" \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --disable-setuid-sandbox \
  --window-size=1240,1754 \
  --print-to-pdf="${PDF_OUT}" \
  --print-to-pdf-no-header \
  --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=5000 \
  "file://${HTML_OUT}"`

console.log('⏳ Generating PDF via Chrome headless...')
try {
  execSync(cmd, { stdio: 'pipe', timeout: 90000 })
  const sizeKB = (fs.statSync(PDF_OUT).size / 1024).toFixed(1)
  console.log(`✓ PDF written  → ${PDF_OUT}`)
  console.log(`  File size: ${sizeKB} KB`)
} catch (err) {
  console.error('✗ Chrome PDF generation failed:', err.stderr?.toString() || err.message)
  console.log('\n  The HTML is available at:', HTML_OUT)
  console.log('  Open it in Chrome → File → Print → Save as PDF → A4, No headers/footers')
  process.exit(1)
}
