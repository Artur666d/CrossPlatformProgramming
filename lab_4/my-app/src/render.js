/*
const videoSelectBtn = document.getElementById("videoSelectBtn");
const { desktopCapturer } = require("electron");

videoSelectBtn.onclick = getVideoSource;

console.log(desktopCapturer);

async function getVideoSource() {
  const inputSources = await desktopCapturer.getSources({
    types: ["window", "screen"]
  });
  console.log(desktopCapturer.getSources({types: ["window", "screen"]}))
  console.log(inputSources);
}

*/
const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');
const playSavedBtn = document.getElementById('playSavedBtn');

let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

videoSelectBtn.addEventListener('click', async () => {
    const sources = await window.electronBridge.invoke('GET_VIDEO_SOURCES');

    // 1. Элемент для затемнения фона
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.zIndex = '1000';
    document.body.appendChild(overlay);

    // 2. Модальное окно
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '20px';
    modal.style.borderRadius = '10px';
    modal.style.zIndex = '1001';
    overlay.appendChild(modal);

    // 3. Добавляем элементы списка в модальное окно
    sources.forEach(source => {
        const btn = document.createElement('button');
        btn.textContent = source.name;
        btn.style.display = 'block';
        btn.style.marginBottom = '10px';
        
        btn.addEventListener('click', () => {
            selectSource(source);
            // Удалить модальное окно после выбора
            overlay.remove();
        });

        modal.appendChild(btn);
    });

    // Закрыть модальное окно при клике вне его
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.remove();
        }
    });
});

startBtn.addEventListener('click', () => {
    if (mediaRecorder) {
        mediaRecorder.start();
        startBtn.classList.remove('is-primary');
        startBtn.classList.add('is-danger'); // зробити кнопку червоною
        startBtn.innerText = 'Recording';
        startBtn.disabled = true; // відключити кнопку
    }
});


stopBtn.addEventListener('click', () => {
    if (mediaRecorder) {
        startBtn.classList.remove('is-danger'); // видалити червоний колір
        startBtn.classList.add('is-primary');   // додати зелений колір
        startBtn.innerText = 'Start';
        mediaRecorder.stop();
        stopBtn.disabled = true; // відключити кнопку "Стоп", поки запис не завершиться
    }
});

async function selectSource(source) {
    videoSelectBtn.innerText = source.name;
    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    };

    // Создание потока
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Предварительный просмотр источника в элементе видео
    videoElement.srcObject = stream;
    videoElement.play();

    // Создание Media Recorder
    const options = { mimeType: 'video/webm; codecs=vp9' };
    mediaRecorder = new MediaRecorder(stream, options);

    // Регистрация обработчиков событий
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm; codecs=vp9'
        });
    
        const buffer = await blob.arrayBuffer();
        const savedPath = await window.electronBridge.invoke('SAVE_VIDEO', Array.from(new Uint8Array(buffer)));
        if (savedPath) {
            console.log('video saved successfully at', savedPath);
            startBtn.disabled = false; // включити кнопку
            stopBtn.disabled = false;  // включити кнопку "Стоп"
        }
    };
}

function handleDataAvailable(e) {
    console.log('video data available');
    recordedChunks.push(e.data);
}

playSavedBtn.addEventListener('click', async () => {
    const { filePaths } = await window.electronBridge.invoke('OPEN_VIDEO_FILE');
    if (filePaths && filePaths.length > 0) {
        playVideo(filePaths[0]);
    }
});

function playVideo(path) {
    videoElement.src = path;
    videoElement.play();
}