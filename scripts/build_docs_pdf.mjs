import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

function mdToHtml(md) {
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

  html = html.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;')

  html = html.replace(/((?:\|[^\n]+\|\n)+)/g, (block) => {
    const rows = block.trim().split('\n').filter(r => r.trim())
    if (rows.length < 2) return block
    const headerRow = rows[0]
    const dataRows  = rows.slice(2)
    const ths = headerRow.split('|').slice(1, -1).map(c =>
      `<th>${c.trim()}</th>`).join('')
    const trs = dataRows.map(r => {
      const tds = r.split('|').slice(1, -1).map(c =>
        `<td>${c.trim()}</td>`).join('')
      return `<tr>${tds}</tr>`
    }).join('\n')
    return `<table>\n<thead><tr>${ths}</tr></thead>\n<tbody>${trs}</tbody>\n</table>\n`
  })

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

  html = html.replace(/^[-*_]{3,}$/gm, '<hr class="section-rule">')
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g,          '<strong>$1</strong>')
  html = html.replace(/\*([^*\n]+?)\*/g,     '<em>$1</em>')
  html = html.replace(/_([^_\n]+?)_/g,       '<em>$1</em>')
  html = html.replace(/`([^`\n]+?)`/g,       '<code>$1</code>')

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="doc-link">$1</a>')

  html = html.replace(/((?:^> .+\n?)+)/gm, (block) => {
    const content = block.replace(/^> /gm, '').trim()
    return `<blockquote><p>${content}</p></blockquote>\n`
  })

  html = html.replace(/((?:^[ \t]*[-*+] .+\n?)+)/gm, (block) => {
    const items = block.trim().split('\n').map(l => {
      const text = l.replace(/^[ \t]*[-*+] /, '')
      return `  <li><p>${text}</p></li>`
    }).join('\n')
    return `<ul>\n${items}\n</ul>\n`
  })

  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (block) => {
    const items = block.trim().split('\n').map(l => {
      const text = l.replace(/^\d+\. /, '')
      return `  <li><p>${text}</p></li>`
    }).join('\n')
    return `<ol>\n${items}\n</ol>\n`
  })

  const tagged = /^<(h[1-6]|ul|ol|table|pre|blockquote|hr|div|%%)/
  html = html.split(/\n{2,}/).map(block => {
    const trimmed = block.trim()
    if (!trimmed) return ''
    if (tagged.test(trimmed)) return trimmed
    const cleaned = trimmed.replace(/\n/g, ' ')
    return `<p>${cleaned}</p>`
  }).join('\n\n')

  codeBlocks.forEach((code, idx) => {
    html = html.replace(`%%CODEBLOCK_${idx}%%`, code)
  })

  html = html.replace(/<p>(%%CODEBLOCK_\d+%%)<\/p>/g, '$1')

  return html
}

function compileDocument({ title, docCode, runningHead, subtitle, inputMd, outputPdf }) {
  const markdown = fs.readFileSync(inputMd, 'utf8')
  const body = mdToHtml(markdown)
  const tempHtml = outputPdf.replace(/\.pdf$/, '.html')

  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${docCode} — ${title}</title>
<style>
@page {
  size: A4;
  margin: 25.4mm 25.4mm 25.4mm 31.75mm;
}

@page body-page {
  size: A4;
  margin: 25.4mm 25.4mm 25.4mm 31.75mm;
  @top-left {
    content: "RUNNING HEAD: ${runningHead}";
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
    content: "CONFIDENTIAL — LIDETA SUB-CITY ADMINISTRATION — OFFICIAL REVIEW COPY";
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
  font-family: "Times New Roman", Times, serif;
  font-size: 11pt;
  line-height: 1.8;
  color: #111;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.cover-page {
  width: 100%;
  min-height: 250mm;
  page-break-after: always;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20mm 15mm;
  font-family: "Times New Roman", Times, serif;
  background: #fff;
}

.cover-institution {
  width: 100%;
  text-align: center;
  border-bottom: 1.5pt solid #000;
  padding-bottom: 12pt;
  margin-bottom: 24pt;
}

.cover-institution-name {
  font-size: 13pt;
  font-weight: bold;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1.4;
}

.cover-institution-sub {
  font-size: 11pt;
  font-weight: normal;
  line-height: 1.5;
}

.cover-title-block {
  width: 100%;
  text-align: center;
  margin-top: 30pt;
  margin-bottom: 36pt;
}

.cover-doc-type {
  font-size: 11pt;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12pt;
}

.cover-title {
  font-size: 18pt;
  font-weight: bold;
  line-height: 1.35;
  margin-bottom: 12pt;
}

.cover-subtitle {
  font-size: 12pt;
  font-style: italic;
  margin-bottom: 0;
}

.cover-meta {
  width: 100%;
  margin-top: auto;
  padding-top: 36pt;
}

.cover-meta-row {
  display: flex;
  font-size: 11pt;
  line-height: 1.8;
}

.cover-meta-label {
  font-weight: bold;
  width: 140pt;
  flex-shrink: 0;
}

.cover-meta-value {
  flex: 1;
}

.doc-body {
  page: body-page;
  counter-reset: page 1;
}

h1 {
  font-size: 14pt;
  font-weight: bold;
  text-align: left;
  line-height: 1.6;
  margin-top: 24pt;
  margin-bottom: 8pt;
  page-break-after: avoid;
  border-bottom: 1pt solid #ccc;
  padding-bottom: 4pt;
}

h2 {
  font-size: 12.5pt;
  font-weight: bold;
  text-align: left;
  line-height: 1.5;
  margin-top: 18pt;
  margin-bottom: 6pt;
  page-break-after: avoid;
}

h3 {
  font-size: 11.5pt;
  font-weight: bold;
  font-style: italic;
  margin-top: 14pt;
  margin-bottom: 4pt;
  page-break-after: avoid;
}

p {
  font-size: 11pt;
  line-height: 1.7;
  text-align: justify;
  margin: 6pt 0;
}

ul, ol {
  font-size: 11pt;
  line-height: 1.7;
  margin: 6pt 0 6pt 24pt;
  padding: 0;
}

li { margin-bottom: 3pt; }

table {
  font-size: 10pt;
  line-height: 1.5;
  width: 100%;
  border-collapse: collapse;
  margin: 10pt 0 14pt;
  page-break-inside: avoid;
}

thead tr {
  border-top: 1.5pt solid #000;
  border-bottom: 1pt solid #000;
}

thead th {
  font-weight: bold;
  text-align: left;
  padding: 4pt 6pt;
  background: #f8f8f8;
}

tbody tr {
  border-bottom: 0.5pt solid #e0e0e0;
}

tbody tr:last-child {
  border-bottom: 1.5pt solid #000;
}

td {
  padding: 4pt 6pt;
  vertical-align: top;
}

pre {
  background: #f4f5f7;
  border: 1pt solid #ddd;
  border-radius: 4px;
  padding: 8pt 10pt;
  margin: 8pt 0;
  page-break-inside: avoid;
  overflow-x: hidden;
}

code {
  font-family: "Courier New", Courier, monospace;
  font-size: 9pt;
}

blockquote {
  border-left: 3pt solid #888;
  padding-left: 10pt;
  margin: 8pt 0;
  font-style: italic;
  color: #444;
}

hr.section-rule {
  border: none;
  border-top: 1pt solid #bbb;
  margin: 14pt 0;
}
</style>
</head>
<body>

<div class="cover-page">
  <div class="cover-institution">
    <div class="cover-institution-name">Lideta Sub-City Administration</div>
    <div class="cover-institution-sub">Information Technology &amp; Systems Department<br>Addis Ababa, Ethiopia</div>
  </div>

  <div class="cover-title-block">
    <div class="cover-doc-type">Official Engineering Document</div>
    <div class="cover-title">${title}</div>
    <div class="cover-subtitle">${subtitle}</div>
  </div>

  <div class="cover-meta">
    <div class="cover-meta-row"><span class="cover-meta-label">Document Code:</span><span class="cover-meta-value">${docCode}</span></div>
    <div class="cover-meta-row"><span class="cover-meta-label">Target Authority:</span><span class="cover-meta-value">Information Network Security Administration (INSA) / Hibir</span></div>
    <div class="cover-meta-row"><span class="cover-meta-label">Classification:</span><span class="cover-meta-value">Official / Review Release</span></div>
    <div class="cover-meta-row"><span class="cover-meta-label">Release Version:</span><span class="cover-meta-value">v1.0.0</span></div>
    <div class="cover-meta-row"><span class="cover-meta-label">Date of Issuance:</span><span class="cover-meta-value">October 2026</span></div>
  </div>
</div>

<div class="doc-body">
${body}
</div>

</body>
</html>`

  fs.writeFileSync(tempHtml, htmlDoc, 'utf8')
  console.log(`Writing HTML -> ${tempHtml}`)

  const cmd = `"${chrome}" \
    --headless=new \
    --disable-gpu \
    --no-sandbox \
    --disable-setuid-sandbox \
    --window-size=1240,1754 \
    --print-to-pdf="${outputPdf}" \
    --print-to-pdf-no-header \
    --no-pdf-header-footer \
    --run-all-compositor-stages-before-draw \
    --virtual-time-budget=5000 \
    "file://${tempHtml}"`

  console.log(`Compiling PDF -> ${outputPdf}...`)
  execSync(cmd, { stdio: 'inherit', timeout: 60000 })
  console.log(`✓ Generated ${outputPdf} (${(fs.statSync(outputPdf).size / 1024).toFixed(1)} KB)`)
  
  if (fs.existsSync(tempHtml)) {
    fs.unlinkSync(tempHtml)
  }
}

// 1. SADD
compileDocument({
  title: 'System Architecture and Design Document (SADD)',
  docCode: 'LSC-SADD-001',
  runningHead: 'LSC SYSTEM ARCHITECTURE & DESIGN — v1.0.0',
  subtitle: 'Lideta Sub-City Official Web Portal & Administrative Platform',
  inputMd: path.join(ROOT, 'docs/02_System_Architecture_and_Design/LSC-SADD-001_System_Architecture_and_Design.md'),
  outputPdf: path.join(ROOT, 'docs/02_System_Architecture_and_Design/LSC-SADD-001_System_Architecture_and_Design.pdf')
})

// 2. User Manual
compileDocument({
  title: 'Deployment and User Administration Manual',
  docCode: 'LSC-MAN-001',
  runningHead: 'LSC DEPLOYMENT & USER MANUAL — v1.0.0',
  subtitle: 'Installation, Reverse Proxy Directives, and Administrative Operation Guide',
  inputMd: path.join(ROOT, 'docs/03_Deployment_and_User_Manual/LSC-MAN-001_Deployment_and_User_Manual.md'),
  outputPdf: path.join(ROOT, 'docs/03_Deployment_and_User_Manual/LSC-MAN-001_Deployment_and_User_Manual.pdf')
})
