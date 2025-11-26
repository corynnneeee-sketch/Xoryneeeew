const uploadBtn = document.getElementById('uploadBtn');
const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');

async function fetchFiles() {
  const res = await fetch('/files');
  const files = await res.json();
  fileList.innerHTML = '';
  files.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f.name;
    li.onclick = () => window.open(f.url, '_blank');
    fileList.appendChild(li);
  });
}

uploadBtn.addEventListener('click', async () => {
  const formData = new FormData();
  formData.append('text', textInput.value);
  if (fileInput.files.length > 0) {
    formData.append('file', fileInput.files[0]);
  }

  const res = await fetch('/upload', { method: 'POST', body: formData });
  const data = await res.json();
  if (data.success) {
    alert('Uploaded successfully!');
    textInput.value = '';
    fileInput.value = '';
    fetchFiles();
  }
});

// Load files on page load
fetchFiles();
