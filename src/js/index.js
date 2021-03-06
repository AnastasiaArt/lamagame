import '../index.css';
import { Game } from "./game-desctop.js";
VK.init(function() {
    init();

}, function() {
    alert('Упс, что пошло не так!')
}, '5.131');
let userGlobal = null;
let globalCount = 0;

function init() {
    VK.api("users.get", {"fields": "first_name, last_name, id", "v":"5.131"}, function (data) {
        console.log(data)
        userGlobal = data.response[0];
        if (data.response) {
            getCount();
        }
        let xhr  = new XMLHttpRequest();
        xhr.open("GET", 'https://oauth.vk.com/access_token?client_id=7837700&client_secret=Z6Oi0DAhqjXM7cTBD5rY&v=5.131&grant_type=client_credentials');     // open connection
        xhr.send();
        console.log(xhr.response)
    });
}
function publish() {
    let upload = '';
    let photo='';
    let owner_id = '';
    // VK.api("photos.getWallUploadServer", {"v":"5.131"}, function (data) {
    //     console.log(data)
    //     upload = data.response;
    // });
    VK.api("apps.get", {"extended": 1,"v":"5.131"}, function (data) {
        console.log(data.response)
        photo = data.response.items[0].screenshots[0].id;
        owner_id = data.response.items[0].screenshots[0].owner_id
        console.log(photo)
        console.log(owner_id)
        // let x;
        //
        // let xhr  = new XMLHttpRequest();              // create XMLHttpRequest
        // let d = new FormData();
        // xhr.responseType = "blob";
        // xhr.onload = function() {
        //     d.append("photo", xhr.response, 'upload.png');
        //     x = new XMLHttpRequest();
        //     x.open("POST",upload.upload_url,true);
        //     x.send(d);
        // }// create formData object
        // // data.append("photo", image)
        // xhr.open("GET", "https://anastasiaart.github.io/img/scenes/loading/bg.png");     // open connection
        // xhr.send();
        // console.log(x.response)
        // if (x.response) {
        //     console.log(xhr.response)
            console.log(`photo${owner_id}_${photo}`)
            VK.api("wall.post", {
                "message": "Hello!",
                "attachments": `photo${owner_id}_${photo}`,
                "v": "5.131"
            }, function (data1) {
                console.log("Post ID:" + data1.response.post_id);
            });
    //     }
    });
}

function getUser() {
    let user = null;
    VK.api("users.get", {"fields": "first_name, last_name, id", "v":"5.73"}, function (data) {
        user = data.response[0];
        console.log(user)
    });
    return user;
}
export function addCount(value) {
    VK.api("utils.getServerTime", {"v":"5.131"}, function (data) {
        console.log(data)
        if(data.response) {
            VK.api("secure.addAppEvent", {
                "user_id": userGlobal.id,
                "activity_id": 2,
                "value": value,
                "v": "5.131"
            }, function (data) {
                console.log(data)
            });
        }
    });
}
export function getCount() {
    VK.api("apps.getScore", {"user_id": userGlobal.id, "v": "5.131"}, function (data) {
        globalCount = data.response;
        console.log(data)
    });
    return  globalCount;

}
// function wallPost(message, image, user_id) {
//     VK.api('photos.getWallUploadServer', {
//         uid: user_id
//     }, function (data) {
//         if (data.response) {
//             $.post('/upload/', {  // url на ВАШЕМ сервере, который будет загружать изображение на сервер контакта (upload_url)
//                 upload_url: data.response.upload_url,
//                 image: image,
//             }, function (json) {
//                 VK.api("photos.saveWallPhoto", {
//                     server: json.server,
//                     photo: json.photo,
//                     hash: json.hash,
//                     uid: user_id
//                 }, function (data) {
//                     VK.api('wall.post', {
//                         message: message,
//                         attachments: data.response['0'].id
//                     });
//                 });
//             }, 'json');
//         }
//     });

window.onload = () => {
    const lamaGame = new Game();
    lamaGame.run();

    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener("mousedown",  (e) => {
        lamaGame.scenes.menu.startGame()}, false);

    const closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener("mousedown",  (e) => {
        lamaGame.scenes.preStart.setCloseBtn()}, false);

    const retryBtn = document.getElementById('retry-btn');
    retryBtn.addEventListener("mousedown",  (e) => {
        lamaGame.scenes.gameOver.retry()}, false);
    const shareBtn = document.getElementById('share-btn');
    shareBtn.addEventListener("mousedown",  (e) => {
        publish()}, false);

    const toggleMuteBtn = document.getElementById('mute-btn');
    toggleMuteBtn.style.backgroundImage = lamaGame.isMute ? "url('img/btns/mute-off.png')" : "url('img/btns/mute-on.png')";
    toggleMuteBtn.addEventListener("mousedown",  (e) => {
        lamaGame.isMute = !lamaGame.isMute;
        toggleMuteBtn.style.backgroundImage = lamaGame.isMute ? "url('img/btns/mute-off.png')" : "url('img/btns/mute-on.png')";
        for (let audio in lamaGame.screen.audios) {
            if (lamaGame.isMute) {
                lamaGame.screen.audios[audio].volume = 0
            } else {
                lamaGame.screen.audios[audio].volume = 0.8
            }
        }
    }, false);
};
