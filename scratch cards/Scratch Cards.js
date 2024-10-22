document.addEventListener('DOMContentLoaded', function() {
    const canvasList = document.querySelectorAll('.scratch-canvas');

    canvasList.forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        const prizeDiv = canvas.parentElement.querySelector('.prize');

        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let isDrawing = false;

        canvas.addEventListener('mousedown', startScratch);
        canvas.addEventListener('touchstart', startScratch);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('touchmove', scratch);
        canvas.addEventListener('mouseup', stopScratch);
        canvas.addEventListener('touchend', stopScratch);

        function startScratch(e) {
            isDrawing = true;
            scratch(e);
        }

        function scratch(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const posX = (e.clientX || e.touches[0].clientX) - rect.left;
            const posY = (e.clientY || e.touches[0].clientY) - rect.top;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(posX, posY, 20, 0, Math.PI * 2, false);
            ctx.fill();
        }

        function stopScratch() {
            isDrawing = false;
            checkCompletion();
        }

        function checkCompletion() {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let scratchedPixels = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i + 3] === 0) {
                    scratchedPixels++;
                }
            }

            const scratchedPercentage = (scratchedPixels / (canvas.width * canvas.height)) * 100;
            if (scratchedPercentage > 60) {
                revealPrize();
            }
        }

        function revealPrize() {
            canvas.classList.add('fade-out');
            setTimeout(() => {
                canvas.style.display = 'none';
                prizeDiv.style.opacity = '1';
                triggerConfetti();
            }, 500);
        }

        function triggerConfetti() {
            const confettiContainer = document.getElementById('confetti-container');
            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.animationDelay = `${Math.random() * 2}s`;
                confettiContainer.appendChild(confetti);
            }
        }
    });
});