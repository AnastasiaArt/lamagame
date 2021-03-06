import {Scene} from '../scene.js'
import {Player} from "../player.js";

export class PreStart extends Scene {
    constructor(game) {
        super(game);
        this.position = {
            x: this.game.screen.canvas.width,
            y: 0,
        };

        this.position1 = {
            x: this.game.screen.canvas.width,
            y: 0,
        };

        this.player = new Player(this.game.control, this.game.screen.canvas.height - 300,100);
        this.player.x = 0 - this.player.view.width / 2;
        this.modal = document.getElementById('modal');
        this.modalText = document.getElementById('modal-text');
    }

    init() {
        super.init();
        this.player.view.x = 500;
        this.player.view.y = 500;
        this.player.y = this.game.screen.canvas.height - this.game.screen.images.ground.height/2 - this.player.view.height;
    }

    setCloseBtn() {
            if (!this.game.isMute) {
                this.game.screen.audios.jump.play();
            }
            this.changeScene();
            this.modal.style.display = 'none';
    }

    changeScene() {
        if (!this.game.isMute) {
            this.game.screen.audios.intro.pause();
            this.game.screen.audios.main.volume = 0;
            let interval = setInterval(() => {
                if (this.game.screen.audios.main.volume < 0.8) {
                    this.game.screen.audios.main.volume += 0.009;
                } else {
                    this.game.screen.audios.main.volume = 0.8;
                    clearInterval(interval)
                }
            }, 200);
            this.game.screen.audios.main.loop = true;
            this.game.screen.audios.main.play();
        }
        this.finish(Scene.START_GAME)
    }

    update(time) {
        this.player.update(time);
    }

    // отрисовка окна для старого юзера
    showModalStart() {
        this.modal.style.display = "block";
        this.modalText.innerHTML = 'Ты снова здесь!<br> Ура!';
    }


    // отрисовка окна для нового юзера
    // showModalStart() {
    //     this.modal.style.display = "block";
    //     this.modalText.innerHTML = 'Привет, я Лама! <br> Нажимай пробел для прыжка и помни,<br>что через пять столкновений <br>я засну.<br>Тогда придётся начать путь заново!'
    //     this.game.screen.drawScaleImage('textBg',this.game.screen.canvas.width/2 - 248, this.game.screen.canvas.height/2 - 200, 0, 0, 82, 108, 500, 300);
    //     this.game.screen.drawImage(this.game.screen.canvas.width/2 + 238 - this.game.screen.images.btnClose.width - 20, this.game.screen.canvas.height/2 - 200 + 20, 'btnClose');
    //     this.game.screen.printText(this.game.screen.canvas.width/2 - 90, this.game.screen.canvas.height/2 - 200 +  this.game.screen.images.btnClose.height + 60, 'Привет, я Лама!');
    //     this.game.screen.printText(this.game.screen.canvas.width/2 - 225, this.game.screen.canvas.height/2 - 200 + this.game.screen.images.btnClose.height + 100, 'Нажимай пробел для прыжка и помни,');
    //     this.game.screen.printText(this.game.screen.canvas.width/2 - 160, this.game.screen.canvas.height/2 - 200 + this.game.screen.images.btnClose.height + 140, 'что через пять столкновений');
    //     this.game.screen.printText(this.game.screen.canvas.width/2 - 40, this.game.screen.canvas.height/2 - 200 + this.game.screen.images.btnClose.height + 180, 'я засну.');
    //     this.game.screen.printText(this.game.screen.canvas.width/2 - 210, this.game.screen.canvas.height/2 - 200 + this.game.screen.images.btnClose.height + 220, 'Тогда придётся начать путь заново!');
    // }

    renderClouds() {
        this.game.screen.drawScaleImage('sky1', this.position.x, 20, 0,0, 301, 181, 180, 100 );
        this.game.screen.drawScaleImage('sky2',this.position.x - 20, this.game.screen.images.sky1.height, 0,0, 225, 120, 150, 80);
        this.game.screen.drawScaleImage( 'sky3',this.position.x - 20 + this.game.screen.images.sky1.width, this.game.screen.images.sky1.height - 40, 0,0, 177, 100, 142, 80);
        this.position.x < 0 - this.game.screen.images.sky1.width - this.game.screen.images.sky2.width - this.game.screen.images.sky3.width - 160 ? this.position.x = this.game.screen.canvas.width : this.position.x -= 2;
    }

    // отрисовка земли и деревьев
    renderBottomGround() {
        if (this.position1.x >= 0) {
            this.position1.x -= 30;
        }
        this.game.screen.drawImage(this.position1.x, this.game.screen.canvas.height - this.game.screen.images.tree1.height, 'tree1');
        this.game.screen.drawImage(this.position1.x, this.game.screen.canvas.height - this.game.screen.images.ground.height, 'ground');
    }

    render(time) {
        this.update(time);
        this.game.screen.drawImageFullScreen(0, 0, 'bg1');
        this.game.screen.drawImageRotated('sun',this.game.screen.canvas.width / 2, this.game.screen.canvas.height , this.game.screen.changeScale('1.000', '0.800', 0.002), time/9000);
        this.renderClouds();
        this.renderBottomGround();
        if (this.position1.x < 0) {
            this.game.screen.drawSprite(this.player.view);
            if (this.player.x <= this.game.screen.canvas.width / 2 - this.player.view.width) {
                this.player.x+= 2;
            } else {
                this.modal.style.display="block";
                this.showModalStart();
            }
        }
    }
}
