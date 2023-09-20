const file = document.querySelector('.coverImageInput')
const label = document.querySelector('.coverImage')

if (file) {
  file.addEventListener('change', (e) => {
  const [file] = e.target.files
  const { name: filename } = file

  label.innerHTML = filename
  label.classList.add('selectedFile')
})
}
