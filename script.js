const preview = document.getElementById('preview');
const textUpload = document.getElementById('textUpload');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

// Image previews
imageUpload.addEventListener('change', e => {
  imagePreview.innerHTML = '';
  [...e.target.files].forEach(f => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(f);
    imagePreview.appendChild(img);
  });
});

// Convert text to HTML
async function parseText(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.convertToHtml({arrayBuffer});
    return result.value;
  }
  if (ext === 'md') {
    const text = await file.text();
    return marked.parse(text);
  }
  return `<p>${(await file.text()).replace(/\n/g, '</p><p>')}</p>`;
}

// Preview button
document.getElementById('previewBtn').onclick = async () => {
  const file = textUpload.files[0];
  if (!file) return alert('Upload a text file first');
  const html = await parseText(file);
  preview.innerHTML = `
    <h1 class="text-3xl font-bold mb-2">${title.value}</h1>
    <p class="italic mb-6">by ${author.value}</p>
    ${html}
  `;
};

// Export PDF
document.getElementById('exportBtn').onclick = () => {
  const opt = { margin: 10, filename: `${title.value || 'ebook'}.pdf`,
                html2canvas: {scale: 2}, jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'} };
  html2pdf().set(opt).from(preview).save();
};
