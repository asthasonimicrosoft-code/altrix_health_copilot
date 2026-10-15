const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const fileInput = document.getElementById('fileInput');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3000);
}
function openModal(title, message, showUpload = false) {
  modalTitle.textContent = title;
  modalText.textContent = message;
  document.getElementById('uploadZone').style.display = showUpload ? 'flex' : 'none';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
document.getElementById('uploadTop').addEventListener('click', () =>
  openModal('Add a health report', 'This front-end demo does not upload files to a server or perform medical analysis. You can choose a file to preview the interaction.', true));
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelModal').addEventListener('click', closeModal);
document.getElementById('modalConfirm').addEventListener('click', () => {
  closeModal();
  showToast('Demo action complete — no data was uploaded.');
});
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) {
    document.querySelector('.upload-zone b').textContent = fileInput.files[0].name;
    showToast('File selected locally for demo only.');
  }
});

const organData = {
  Heart: {
    tag: 'CARDIOVASCULAR', title: 'Heart health',
    description: 'Your latest sample heart-rate reading is within a typical resting range for many adults. Trends matter more than a single reading.',
    reading: '72 bpm'
  },
  Lungs: {
    tag: 'RESPIRATORY', title: 'Breathing & lungs',
    description: 'This body map is illustrative only. If you have breathing concerns, a healthcare professional can assess your symptoms and history.',
    reading: 'No live data'
  }
};
document.querySelectorAll('.organ-point').forEach(button => button.addEventListener('click', () => {
  const data = organData[button.dataset.organ];
  document.getElementById('organTag').textContent = data.tag;
  document.getElementById('organTitle').textContent = data.title;
  document.getElementById('organDescription').textContent = data.description;
  document.getElementById('organReading').textContent = data.reading;
  document.querySelectorAll('.organ-point').forEach(el => el.classList.remove('selected'));
  button.classList.add('selected');
}));
document.getElementById('organMore').addEventListener('click', () =>
  openModal('Understand a health reading', 'A single number rarely tells the whole story. Consider the measurement context, your symptoms, medications, and personal history. Ask a qualified clinician what the result means for you.'));
document.getElementById('bodyDetails').addEventListener('click', () =>
  showToast('Select the glowing points on the body map to explore the sample details.'));
document.getElementById('timelineBtn').addEventListener('click', () =>
  openModal('Your health story', 'Your full timeline would bring reports, appointments, prescriptions, and wellness trends together in date order. This prototype shows sample entries only.'));
document.getElementById('helpBtn').addEventListener('click', () =>
  openModal('How can we help?', 'Use Add a report to preview the report flow, click the body-map hotspots to explore sample information, or ask the demo assistant a question.'));
document.querySelectorAll('[data-explain="blood"]').forEach(button => button.addEventListener('click', () => {
  openModal('Sample blood test summary', 'This is a fictional example: a report summary should explain each result, show the lab reference range, note what may affect the result, and suggest questions for your clinician. No real lab values are being interpreted.');
}));
document.getElementById('explainReport').addEventListener('click', () =>
  openModal('Your report, in plain language', 'A helpful explanation should define medical terms, identify the lab-provided reference range, show which results need follow-up, and provide questions for your clinician. This demo uses fictional sample information.'));

document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const target = document.getElementById(button.dataset.target);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else showToast('This section is part of the demo workspace.');
}));

const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
function addMessage(text, type) {
  const bubble = document.createElement('div');
  bubble.className = type === 'user' ? 'user-message' : 'bot-message';
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function responseFor(question) {
  const q = question.toLowerCase();
  if (q.includes('report') || q.includes('blood') || q.includes('test')) {
    return 'I can help you understand the structure of a report, but I cannot analyze real results in this demo. Look for the result, the lab reference range, and any clinician comments. I can also help you prepare questions for your appointment.';
  }
  if (q.includes('doctor') || q.includes('appointment') || q.includes('ask')) {
    return 'You could ask: What does this result mean for me? Is follow-up needed? Could medicines or recent activity affect it? When should I repeat the test? Which symptoms should prompt me to contact your clinic?';
  }
  if (q.includes('sleep')) {
    return 'Sleep needs vary by age and individual circumstances. Try keeping a consistent sleep schedule and note how rested you feel. If sleep problems persist or affect daily life, consider discussing them with a healthcare professional.';
  }
  if (q.includes('heart') || q.includes('rate')) {
    return 'Heart rate can change with activity, stress, hydration, medicines, and other factors. The dashboard number is sample data, not a live measurement or diagnosis. If you have concerning symptoms, seek medical advice.';
  }
  if (q.includes('hello') || q.includes('hi')) {
    return 'Hi! I can help organize health information, explain general medical terms, and prepare questions for a clinician. What would you like to explore?';
  }
  return 'I can help with general health information and questions to discuss with a clinician. This demo does not diagnose conditions or review real medical records. Could you tell me whether you want help understanding a report, a health term, or preparing for an appointment?';
}
function sendChat(question) {
  const clean = question.trim();
  if (!clean) return;
  addMessage(clean, 'user');
  chatInput.value = '';
  setTimeout(() => addMessage(responseFor(clean), 'bot'), 350);
}
document.getElementById('chatForm').addEventListener('submit', e => {
  e.preventDefault();
  sendChat(chatInput.value);
});
document.querySelectorAll('.suggestion').forEach(button => button.addEventListener('click', () => sendChat(button.dataset.question)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
