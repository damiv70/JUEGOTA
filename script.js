// Se declaran las variables para la velocidad de movimiento y la gravedad.
let move_speed = 3, gravity = 0.5;

// Se obtienen referencias a elementos del DOM.
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// Se obtienen las propiedades del pájaro y el fondo.
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

// Se obtienen referencias a elementos del DOM para el puntaje y el mensaje.
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

// Se establece el estado del juego como 'Start' y se oculta la imagen del pájaro.
let game_state = 'Start';
img.style.display = 'none';

// Se agrega un evento de escucha para la tecla Enter.
document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && game_state != 'Play'){
        // Se eliminan los elementos de tubería existentes.
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        // Se muestra la imagen del pájaro, se reinician las posiciones y valores del juego.
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Puntuación : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play(); // Se llama a la función play para iniciar el juego.
    }
});

// La función play contiene la lógica principal del juego.
function play(){
    // La función move se encarga de mover las tuberías y verificar colisiones.
    function move(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if(pipe_sprite_props.right <= 0){
                // Si la tubería sale del área de juego, se elimina.
                element.remove();
            }else{
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top){
                    // Si hay una colisión entre el pájaro y una tubería, el juego termina.
                    game_state = 'End';
                    message.innerHTML = 'JUEGO TERMINADO'.fontcolor('red') + '<br>ENTER para volver a jugar';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                }else{
                    if(pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1'){
                        // Si el pájaro pasa por una tubería, se aumenta el puntaje y se reproduce un sonido.
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    // Se mueve la tubería hacia la izquierda.
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    // La función apply_gravity se encarga de aplicar la gravedad al pájaro y manejar los eventos de salto.
    function apply_gravity(){
        if(game_state != 'Play') return;
        bird_dy = bird_dy + gravity;
        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird.png';
                bird_dy = -7.6; // Se aplica un impulso hacia arriba cuando se presiona la tecla de salto.
            }
        });

        document.addEventListener('keyup', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird.png';
            }
        });

        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            // Si el pájaro toca los límites superior o inferior del área de juego, el juego termina.
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_separation = 0;
    let pipe_gap = 35;

    // La función create_pipe se encarga de crear nuevas tuberías en intervalos regulares.
    function create_pipe(){
        if(game_state != 'Play') return;

        if(pipe_separation > 115){
            pipe_separation = 0;

            let pipe_pos = Math.floor(Math.random() * 43) + 8; // Posición aleatoria para la tubería.
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_pos - 70 + 'vh'; // Se establece la posición superior de la tubería invertida.

            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);

            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_pos + pipe_gap + 'vh'; // Se establece la posición superior de la tubería inferior.
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1'; // Se marca la tubería para aumentar el puntaje cuando el pájaro la atraviesa.

            document.body.appendChild(pipe_sprite);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
/*Autómata Finito: Podríamos considerar el estado del juego como un autómata finito, donde el estado puede ser 'Start', 'Play' o 'End'.

Máquina de Turing: Aunque no se implementa directamente en el código, el juego en sí mismo puede considerarse como una máquina de Turing, donde las tuberías y el pájaro interactúan en un entorno específico.

Transición: Las tuberías en movimiento y el pájaro en respuesta a las teclas presionadas pueden considerarse como transiciones entre estados en el juego. */