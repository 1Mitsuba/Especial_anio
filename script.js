document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos principales
    const loginContainer = document.getElementById('login-container');
    const envelopeContainer = document.getElementById('envelope-container');
    const envelope = document.getElementById('envelope');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('error-msg');
    const instructions = document.querySelector('.instructions');
    const themeBtn = document.getElementById('theme-btn');
    const poemBtn = document.getElementById('poem-btn');
    const wishBtn = document.getElementById('wish-btn');
    const poemModal = document.getElementById('poem-modal');
    const wishModal = document.getElementById('wish-modal');
    const sendWishBtn = document.getElementById('send-wish-btn');
    const currentDateSpan = document.getElementById('current-date');
    const letterDateSpan = document.getElementById('letter-date');
    
    // Actualizar la fecha actual - usamos la fecha proporcionada
    const currentDate = new Date('2025-05-02T03:48:04.000Z');
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('es-ES', options);
    
    if (currentDateSpan) currentDateSpan.textContent = formattedDate;
    if (letterDateSpan) letterDateSpan.textContent = formattedDate;
    
    // La contraseña para acceder
    const correctPassword = "06/06/2024";
    
    // Temas disponibles
    const themes = ['theme-default', 'theme-blue', 'theme-green', 'theme-gold'];
    let currentTheme = 0;
    
    // Definir la fecha de inicio (06/06/2024 a las 8pm)
    const startDate = new Date('2024-06-06T20:00:00');
    
    // Iniciar contador
    updateCounter();
    
    // Creación de corazones flotantes
    createFloatingHearts();
    
    // Inicializar las características especiales
    setupAnniversaryFeatures();
    setupBoyfriendDayFeatures();
    
    // Manejar el inicio de sesión
    loginBtn.addEventListener('click', function() {
        checkPassword();
    });
    
    // También permitir presionar Enter para iniciar sesión
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    // Inicialización de modales y manejo de clics en móvil
    initModals();
    
    // Función para verificar la contraseña
    function checkPassword() {
        const password = passwordInput.value;
        
        if (password === correctPassword) {
            // Contraseña correcta, mostrar sobre
            loginContainer.classList.add('hidden');
            envelopeContainer.classList.remove('hidden');
            passwordInput.value = '';
            errorMsg.textContent = '';
            
            // Efecto de entrada con pequeña animación
            envelopeContainer.style.opacity = '0';
            envelopeContainer.style.display = 'flex';
            setTimeout(() => {
                envelopeContainer.style.opacity = '1';
                envelopeContainer.style.transition = 'opacity 0.5s ease';
            }, 10);
            
        } else {
            // Contraseña incorrecta
            errorMsg.textContent = "Contraseña incorrecta. Inténtalo de nuevo.";
            passwordInput.value = '';
            passwordInput.focus();
            
            // Efecto de temblor en el formulario
            loginCard.classList.add('shake');
            setTimeout(() => {
                loginCard.classList.remove('shake');
            }, 500);
        }
    }
    
    // Manejar el cierre de sesión
    logoutBtn.addEventListener('click', function() {
        envelopeContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        
        // Si el sobre está abierto, cerrarlo
        if (envelope.classList.contains('open')) {
            envelope.classList.remove('open');
            instructions.textContent = 'Haz clic en el sobre para abrirlo';
        }
    });
    
    // Manejar la apertura/cierre del sobre
    envelope.addEventListener('click', function() {
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            instructions.textContent = 'Haz clic nuevamente para cerrar';
            
            // Añadir un efecto visual cuando se abre
            addHeartBurst();
        } else {
            envelope.classList.remove('open');
            instructions.textContent = 'Haz clic en el sobre para abrirlo';
        }
    });
    
    // Cambiar temas
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            currentTheme = (currentTheme + 1) % themes.length;
            
            // Eliminar todos los temas anteriores
            themes.forEach(theme => {
                if (theme !== 'theme-default') {
                    document.body.classList.remove(theme);
                }
            });
            
            // Agregar el tema actual si no es el predeterminado
            if (currentTheme > 0) {
                document.body.classList.add(themes[currentTheme]);
            }
            
            showToast(`Tema cambiado`);
        });
    }
    
    // Inicializar modales
    function initModals() {
        // Manejar el modal del poema
        if (poemBtn && poemModal) {
            poemBtn.addEventListener('click', function(e) {
                e.preventDefault();
                poemModal.style.display = 'flex';
            });
            
            const closePoem = poemModal.querySelector('.close-btn');
            if (closePoem) {
                closePoem.addEventListener('click', function() {
                    poemModal.style.display = 'none';
                });
            }
            
            // Cerrar al hacer clic fuera del modal
            poemModal.addEventListener('click', function(event) {
                if (event.target === poemModal) {
                    poemModal.style.display = 'none';
                }
            });
        }
        
        // Manejar el modal de deseos
        if (wishBtn && wishModal) {
            wishBtn.addEventListener('click', function(e) {
                e.preventDefault();
                wishModal.style.display = 'flex';
            });
            
            const closeWish = wishModal.querySelector('.close-btn');
            if (closeWish) {
                closeWish.addEventListener('click', function() {
                    wishModal.style.display = 'none';
                });
            }
            
            // Cerrar al hacer clic fuera del modal
            wishModal.addEventListener('click', function(event) {
                if (event.target === wishModal) {
                    wishModal.style.display = 'none';
                }
            });
            
            // Enviar deseo
            if (sendWishBtn) {
                sendWishBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const wishText = document.getElementById('wish-text').value;
                    
                    if (wishText.trim() !== '') {
                        // Animación de deseo enviado
                        animateWish(wishText);
                        document.getElementById('wish-text').value = '';
                    } else {
                        showToast('Por favor escribe un deseo');
                    }
                });
            }
        }
    }
    
    // Animar el envío de un deseo
    function animateWish(wishText) {
        const container = document.querySelector('.wish-animation-container');
        const starCount = 5;
        
        // Limpiar animaciones previas
        container.innerHTML = '';
        
        // Mostrar texto del deseo brevemente
        const wishDisplay = document.createElement('div');
        wishDisplay.textContent = wishText;
        wishDisplay.style.textAlign = 'center';
        wishDisplay.style.marginBottom = '15px';
        wishDisplay.style.color = '#333';
        wishDisplay.style.fontSize = '14px';
        container.appendChild(wishDisplay);
        
        // Crear estrellas animadas
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.innerHTML = '★';
            star.style.setProperty('--star-x', `${(Math.random() * 200) - 100}px`);
            star.style.setProperty('--star-y', `${(Math.random() * 150) - 50}px`);
            star.style.animation = `fly-away ${1 + Math.random() * 2}s ease-out forwards ${i * 0.2}s`;
            container.appendChild(star);
        }
        
        // Mensaje de confirmación
        setTimeout(() => {
            container.innerHTML = '';
            const confirmMsg = document.createElement('div');
            confirmMsg.textContent = '¡Tu deseo ha sido enviado al universo!';
            confirmMsg.style.color = '#a239ca';
            confirmMsg.style.textAlign = 'center';
            confirmMsg.style.padding = '20px';
            confirmMsg.style.fontSize = '16px';
            container.appendChild(confirmMsg);
            
            // Cerrar después de un tiempo
            setTimeout(() => {
                wishModal.style.display = 'none';
                showToast('Deseo enviado con éxito');
            }, 2000);
        }, 3000);
    }
    
    // Efecto de notificación (función global disponible para otras características)
    window.showToast = function(message) {
        // Crear el elemento toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Mostrar y luego ocultar
        setTimeout(() => {
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 2000);
        }, 10);
    };
    
    // También mantener la versión local para compatibilidad
    function showToast(message) {
        window.showToast(message);
    }
    
    // Actualizar contador
    function updateCounter() {
        // Usamos la fecha proporcionada: 6 de junio de 2024 a las 8pm
        const now = new Date();
        
        // Calcular la diferencia en días
        const difference = Math.abs(now - startDate);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        
        // Para horas y minutos, usamos la diferencia dentro del día actual
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        // Actualizar elementos
        const daysEl = document.getElementById('days-count');
        const hoursEl = document.getElementById('hours-count');
        const minutesEl = document.getElementById('minutes-count');
        
        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours;
        if (minutesEl) minutesEl.textContent = minutes;
        
        // Actualizar cada minuto
        setTimeout(updateCounter, 60000);
    }
    
    // Añadir efecto de temblor al formulario para la animación de error
    const loginCard = document.querySelector('.login-card');
    
    // Crear corazones flotantes en el fondo
    function createFloatingHearts() {
        const container = document.querySelector('.floating-hearts');
        const heartSymbols = ['♥', '♡'];
        const heartSizes = ['small', 'medium', 'large'];
        
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = `floating-heart ${heartSizes[Math.floor(Math.random() * heartSizes.length)]}`;
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${8 + Math.random() * 7}s`;
            heart.style.animationDelay = `${Math.random() * 5}s`;
            heart.style.fontSize = `${Math.random() * 20 + 10}px`;
            heart.style.opacity = `${Math.random() * 0.3 + 0.1}`;
            container.appendChild(heart);
        }
    }
    
    // Efecto de explosión de corazones cuando se abre el sobre
    function addHeartBurst() {
        const container = document.querySelector('.envelope-wrapper');
        
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'burst-heart';
            heart.textContent = '♥';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = `${Math.random() * 20 + 10}px`;
            heart.style.color = getRandomHeartColor();
            heart.style.position = 'absolute';
            heart.style.zIndex = '20';
            heart.style.transformOrigin = 'center';
            heart.style.pointerEvents = 'none';
            
            // Ángulo y distancia aleatorios
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const duration = Math.random() * 2 + 1;
            
            // Crear animación única para cada corazón
            const animationName = `burst${Date.now()}${i}`;
            const keyframes = `
                @keyframes ${animationName} {
                    0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    100% { 
                        transform: translate(
                            calc(-50% + ${Math.cos(angle) * distance}px), 
                            calc(-50% + ${Math.sin(angle) * distance}px)
                        ) rotate(${Math.random() * 360}deg);
                        opacity: 0;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.innerHTML = keyframes;
            document.head.appendChild(style);
            
            heart.style.animation = `${animationName} ${duration}s forwards`;
            container.appendChild(heart);
            
            // Eliminar después de la animación
            setTimeout(() => {
                if (container.contains(heart)) {
                    container.removeChild(heart);
                }
                document.head.removeChild(style);
            }, duration * 1000);
        }
    }
    
    function getRandomHeartColor() {
        const colors = [
            '#ff66c4', '#ff3385', '#a239ca', '#7c26a6', '#b347d7'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Añadir CSS para efectos adicionales
    const style = document.createElement('style');
    style.innerHTML = `
        .burst-heart {
            position: absolute;
            z-index: 20;
            transform-origin: center;
            pointer-events: none;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s;
        }
    `;
    document.head.appendChild(style);
});

// Código para la celebración de aniversario
function setupAnniversaryFeatures() {
    // Referencias a elementos
    const anniversaryModal = document.getElementById('anniversary-modal');
    const anniversaryBtn = document.getElementById('anniversary-button');
    const fireworksCanvas = document.getElementById('fireworks-canvas');
    
    // Verificar si los elementos existen
    if (!anniversaryModal || !anniversaryBtn || !fireworksCanvas) {
        console.log("Elementos de aniversario no encontrados");
        return;
    }
    
    // CONFIGURACIÓN DE FECHAS
    // Para pruebas: true = siempre visible, false = solo en la fecha real
    const testMode = false;
    
    // Fecha del aniversario (formato: año, mes-1, día)
    const anniversaryDate = new Date(2025, 5, 6); 
    
    // Obtener la fecha actual
    const today = new Date();
    
    // Crear elemento de audio mediante JavaScript
    const audioElement = document.createElement('audio');
    audioElement.id = 'anniversary-song';
    audioElement.style.display = 'none';
    audioElement.loop = true;
    audioElement.volume = 1;
    audioElement.preload = 'auto';
    
    // Configurar la ruta al archivo desde la carpeta "music"
    audioElement.src = "music/juntos_juanes.m4a";
    
    // Añadir el elemento de audio al documento
    document.body.appendChild(audioElement);
    
    // Verificar si es la fecha del aniversario o si estamos en modo prueba
    const isAnniversaryTime = () => {
        if (testMode) return true; // Modo prueba - siempre se muestra
        
        // Comprueba si es el día del aniversario
        return (
            today.getFullYear() === anniversaryDate.getFullYear() &&
            today.getMonth() === anniversaryDate.getMonth() &&
            today.getDate() === anniversaryDate.getDate()
        ) || (
            // O dentro de un día después para no perder la sorpresa
            today > anniversaryDate && 
            (today - anniversaryDate) <= 1000 * 60 * 60 * 24
        );
    };

    // Configuración inicial
    if (isAnniversaryTime()) {
        // Ya no está oculto
        anniversaryBtn.classList.remove('hidden');
        
        // Mostrar automáticamente después de un retraso (solo la primera vez)
        if (!sessionStorage.getItem('anniversaryShown')) {
            setTimeout(() => {
                showAnniversaryModal();
                sessionStorage.setItem('anniversaryShown', 'true');
            }, 2000);
        }
        
        // Añadir evento al botón
        anniversaryBtn.addEventListener('click', showAnniversaryModal);
    }
    
    // Funciones para cerrar el modal
    const closeBtn = anniversaryModal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAnniversaryModal);
    }
    
    // Cerrar al hacer clic fuera del modal
    anniversaryModal.addEventListener('click', function(event) {
        if (event.target === anniversaryModal) {
            hideAnniversaryModal();
        }
    });
    
    // Manejar el botón de reproducción
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (audioElement.paused) {
                audioElement.play()
                    .then(() => {
                        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    })
                    .catch(err => {
                        console.log("Error al reproducir:", err);
                    });
            } else {
                audioElement.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }
    
    // Actualizar la barra de progreso
    const progressBar = document.querySelector('.progress');
    if (progressBar && audioElement) {
        audioElement.addEventListener('timeupdate', function() {
            if (audioElement.duration) {
                const percentage = (audioElement.currentTime / audioElement.duration) * 100;
                progressBar.style.width = percentage + '%';
                
                // Actualizar el tiempo actual si existe el elemento
                const currentTimeDisplay = document.getElementById('current-time');
                if (currentTimeDisplay) {
                    currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
                }
            }
        });
        
        // Función para formatear tiempo
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
        }
        
        // Configurar duración cuando los metadatos estén cargados
        audioElement.addEventListener('loadedmetadata', function() {
            const durationDisplay = document.getElementById('duration');
            if (durationDisplay && !isNaN(audioElement.duration)) {
                durationDisplay.textContent = formatTime(audioElement.duration);
            }
        });
        
        // Permitir clic en la barra de progreso para cambiar posición
        const progressContainer = document.querySelector('.progress-bar');
        if (progressContainer) {
            progressContainer.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                audioElement.currentTime = clickPos * audioElement.duration;
            });
        }
    }
    
    // Manejar errores de audio
    audioElement.addEventListener('error', function(e) {
        console.error("Error al cargar el audio:", e);
        console.error("Código de error:", audioElement.error ? audioElement.error.code : "desconocido");
    });
    
    // Función para mostrar el modal de aniversario
    function showAnniversaryModal() {
        anniversaryModal.style.display = 'flex';
        
        // Iniciar elementos con animación
        const elements = anniversaryModal.querySelectorAll('.anniversary-content > *');
        elements.forEach((el, index) => {
            el.classList.add('anniversary-animation');
            el.style.animationDelay = `${index * 0.2}s`;
        });
        
        // Mostrar fuegos artificiales
        fireworksCanvas.classList.remove('hidden');
        initFireworks();
        
        // Reproducir música automáticamente con un pequeño retraso
        setTimeout(() => {
            audioElement.play()
                .then(() => {
                    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                })
                .catch(err => {
                    console.log("Error al reproducir automáticamente:", err);
                });
        }, 800);
    }
    
    // Ocultar el modal y detener todo
    function hideAnniversaryModal() {
        anniversaryModal.style.display = 'none';
        
        // Pausar audio
        audioElement.pause();
        audioElement.currentTime = 0;
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // Ocultar fuegos artificiales
        fireworksCanvas.classList.add('hidden');
        stopFireworks();
    }
    
    // Sistema de fuegos artificiales
    let fireworksInterval;
    let animationFrame;
    
    function initFireworks() {
        const canvas = fireworksCanvas;
        if (!canvas || !canvas.getContext) return;
        
        const ctx = canvas.getContext('2d');
        
        // Configurar tamaño del canvas para que ocupe toda la pantalla
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // Llamar inicialmente y configurar evento de resize
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Array para guardar los fuegos artificiales
        const fireworks = [];
        
        // Crear un nuevo fuego artificial
        function createFirework() {
            const firework = {
                x: Math.random() * canvas.width,
                y: canvas.height,
                size: Math.random() * 3 + 1,
                color: getRandomColor(),
                velocityY: -Math.random() * 8 - 5,
                velocityX: Math.random() * 4 - 2,
                exploded: false,
                particles: []
            };
            
            fireworks.push(firework);
        }
        
        // Colores aleatorios para los fuegos artificiales
        function getRandomColor() {
            const colors = [
                '#ff66c4', // Rosa
                '#a239ca', // Púrpura
                '#4c00c2', // Azul oscuro
                '#74b9ff', // Azul claro
                '#7bed9f', // Verde claro
                '#ff7675', // Rosa coral
                '#ffeaa7'  // Amarillo claro
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        // Crear partículas cuando explota un fuego artificial
        function createParticles(firework) {
            const particleCount = 70;
            const angleIncrement = (Math.PI * 2) / particleCount;
            
            for (let i = 0; i < particleCount; i++) {
                const angle = angleIncrement * i;
                const speed = Math.random() * 3 + 1;
                
                firework.particles.push({
                    x: firework.x,
                    y: firework.y,
                    size: Math.random() * 2 + 1,
                    color: firework.color,
                    velocityX: Math.cos(angle) * speed,
                    velocityY: Math.sin(angle) * speed,
                    alpha: 1
                });
            }
        }
        
        // Función de animación
        function update() {
            // Limpiar canvas
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Crear un nuevo fuego artificial de forma aleatoria
            if (Math.random() < 0.03) {
                createFirework();
            }
            
            // Actualizar cada fuego artificial
            for (let i = fireworks.length - 1; i >= 0; i--) {
                const fw = fireworks[i];
                
                // Si no ha explotado, sube
                if (!fw.exploded) {
                    fw.x += fw.velocityX;
                    fw.y += fw.velocityY;
                    fw.velocityY += 0.05; // Gravedad
                    
                    ctx.fillStyle = fw.color;
                    ctx.beginPath();
                    ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Si alcanza su punto más alto, explota
                    if (fw.velocityY >= 0) {
                        fw.exploded = true;
                        createParticles(fw);
                    }
                } 
                // Si explotó, actualizar partículas
                else {
                    for (let j = fw.particles.length - 1; j >= 0; j--) {
                        const p = fw.particles[j];
                        
                        p.x += p.velocityX;
                        p.y += p.velocityY;
                        p.velocityY += 0.05; // Gravedad
                        p.alpha -= 0.01; // Desvanecimiento
                        
                        if (p.alpha <= 0) {
                            fw.particles.splice(j, 1);
                        } else {
                            ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.alpha})`;
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                    
                    // Si no quedan partículas, eliminar el fuego artificial
                    if (fw.particles.length === 0) {
                        fireworks.splice(i, 1);
                    }
                }
            }
            
            animationFrame = requestAnimationFrame(update);
        }
        
        // Convertir color hex a rgb para opacidad
        function hexToRgb(hex) {
            // Remover el #
            hex = hex.replace('#', '');
            
            // Convertir a RGB
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            
            return `${r}, ${g}, ${b}`;
        }
        
        // Iniciar animación
        update();
        
        // Crear fuegos artificiales periódicamente
        fireworksInterval = setInterval(createFirework, 800);
    }
    
    // Detener fuegos artificiales
    function stopFireworks() {
        clearInterval(fireworksInterval);
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    }
}

// Código para la celebración del Día del Novio
function setupBoyfriendDayFeatures() {
    console.log("Inicializando características del Día del Novio");
    
    // ==== ESPECIAL DÍA DEL NOVIO ====
    const boyfriendDayModal = document.getElementById('boyfriendday-modal');
    const boyfriendDayBtn = document.getElementById('boyfriendday-button');
    const boyfriendDaySong = document.getElementById('boyfriendday-song');
    // Nuevo: referencia al video
    const boyfriendDayVideo = document.getElementById('boyfriendday-video');
    
    // Verificar que los elementos existan
    if (!boyfriendDayModal) {
        console.error("Modal del Día del Novio no encontrado");
        return;
    }
    
    if (!boyfriendDayBtn) {
        console.error("Botón del Día del Novio no encontrado");
        return;
    }
    
    console.log("Elementos del Día del Novio encontrados correctamente");
    
    const closeBtn = boyfriendDayModal.querySelector('.close-btn');
    
    // Configuración de fechas
    const testModeBoyfriend = false; // Para pruebas en desarrollo
    // Fecha original: 3 de octubre de 2025
    const boyfriendDayDate = new Date(2025, 9, 3);
    const today = new Date();
    
    // Comprobar si es el día del novio o estamos en modo prueba
    const isBoyfriendDayTime = () => {
        if (testModeBoyfriend) return true; // Siempre mostrar en modo prueba
        
        return (
            today.getFullYear() === boyfriendDayDate.getFullYear() &&
            today.getMonth() === boyfriendDayDate.getMonth() &&
            today.getDate() === boyfriendDayDate.getDate()
        ) || (
            // O dentro de un día después para no perder la sorpresa
            today > boyfriendDayDate && 
            (today - boyfriendDayDate) <= 1000 * 60 * 60 * 24
        );
    };
    
    // Inicialización al cargar
    if (isBoyfriendDayTime()) {
        console.log("Es tiempo de mostrar el día del novio, activando botón");
        boyfriendDayBtn.classList.remove('hidden');
        
        // Mostrar automáticamente después de un retraso (solo la primera vez)
        if (!sessionStorage.getItem('boyfriendDayShown')) {
            setTimeout(() => {
                showBoyfriendDayModal();
                sessionStorage.setItem('boyfriendDayShown', 'true');
            }, 2000);
        }
        
        // Añadir evento al botón
        boyfriendDayBtn.addEventListener('click', function() {
            console.log("Botón del Día del Novio clickeado");
            showBoyfriendDayModal();
        });
    }
    
    // Manejar cierre del modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log("Botón de cerrar clickeado");
            hideBoyfriendDayModal();
        });
    }
    
    // Cerrar al hacer clic fuera del modal
    boyfriendDayModal.addEventListener('click', function(event) {
        if (event.target === boyfriendDayModal) {
            console.log("Click fuera del modal detectado");
            hideBoyfriendDayModal();
        }
    });
    
    // Añadir CSS específico para el modal del Día del Novio
    const boyfriendDayStyles = document.createElement('style');
    boyfriendDayStyles.innerHTML = `
        /* Estilos adicionales para el modal del día del novio */
        #boyfriendday-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            overflow: auto;
        }
        
        .boyfriendday-modal-content {
            margin: 10vh auto;
        }
    `;
    document.head.appendChild(boyfriendDayStyles);
    
    // Función para mostrar el modal
    function showBoyfriendDayModal() {
        console.log("Mostrando modal del Día del Novio");
        boyfriendDayModal.style.display = 'flex';
        
        // Añadir animaciones a los elementos
        animateModalElements();
        
        // Añadir efecto de corazones
        addBoyfriendDayHeartBurst();
        
        // Reproducir audio
        if (boyfriendDaySong) {
            boyfriendDaySong.play()
                .then(() => {
                    console.log("Reproducción de audio iniciada");
                })
                .catch(err => {
                    console.error("Error al reproducir audio:", err);
                });
        } else {
            console.warn("Elemento de audio no encontrado");
        }

        // Mostrar y reproducir el video
        if (boyfriendDayVideo) {
            boyfriendDayVideo.style.display = 'block';
            boyfriendDayVideo.currentTime = 0;
            boyfriendDayVideo.play().catch(err => {
                console.warn("No se pudo reproducir el video automáticamente:", err);
            });
        }

        // Mostrar notificación
        if (typeof window.showToast === 'function') {
            window.showToast('¡Feliz Día del Novio!');
        }
    }
    
    // Función para ocultar el modal
    function hideBoyfriendDayModal() {
        console.log("Ocultando modal del Día del Novio");
        boyfriendDayModal.style.display = 'none';
        
        // Detener audio
        if (boyfriendDaySong) {
            boyfriendDaySong.pause();
            boyfriendDaySong.currentTime = 0;
        }
        // Ocultar y pausar el video
        if (boyfriendDayVideo) {
            boyfriendDayVideo.pause();
            boyfriendDayVideo.currentTime = 0;
            boyfriendDayVideo.style.display = 'none';
        }
    }
    
    // Función para animar elementos del modal
    function animateModalElements() {
        console.log("Animando elementos del modal");
        const elements = boyfriendDayModal.querySelectorAll('.boyfriendday-content > *, .boyfriendday-title, .boyfriendday-heart-anim');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.transitionDelay = `${index * 0.2}s`;
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 50);
        });
    }
    
    // Función para crear efecto de explosión de corazones
    function addBoyfriendDayHeartBurst() {
        const container = boyfriendDayModal.querySelector('.boyfriendday-modal-content');
        if (!container) {
            console.error("Contenedor para corazones no encontrado");
            return;
        }
        
        console.log("Añadiendo explosión de corazones");
        
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'burst-heart boyfriend-heart';
            heart.textContent = '♥';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = `${Math.random() * 20 + 10}px`;
            heart.style.color = getRandomHeartColor();
            heart.style.position = 'absolute';
            heart.style.zIndex = '20';
            heart.style.transformOrigin = 'center';
            heart.style.pointerEvents = 'none';
            
            // Ángulo y distancia aleatorios
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const duration = Math.random() * 2 + 1;
            
            // Crear animación única para cada corazón
            const animationName = `boyfriendBurst${Date.now()}${i}`;
            const keyframes = `
                @keyframes ${animationName} {
                    0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    100% { 
                        transform: translate(
                            calc(-50% + ${Math.cos(angle) * distance}px), 
                            calc(-50% + ${Math.sin(angle) * distance}px)
                        ) rotate(${Math.random() * 360}deg);
                        opacity: 0;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.innerHTML = keyframes;
            document.head.appendChild(style);
            
            heart.style.animation = `${animationName} ${duration}s forwards`;
            container.appendChild(heart);
            
            // Eliminar después de la animación
            setTimeout(() => {
                if (container.contains(heart)) {
                    container.removeChild(heart);
                }
                if (document.head.contains(style)) {
                    document.head.removeChild(style);
                }
            }, duration * 1000);
        }
    }
    
    // Obtener un color aleatorio para los corazones
    function getRandomHeartColor() {
        const colors = [
            '#ff66c4', '#ff3385', '#a239ca', '#7c26a6', '#b347d7'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    console.log("Configuración del Día del Novio completada");
}