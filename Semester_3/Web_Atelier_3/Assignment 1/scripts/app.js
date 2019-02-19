function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fadeInMusic() {
  var [audio] = document.getElementsByTagName("audio");
  for (var i = 0; i < 100; i++) {
    audio.volume = 0.05*(i/100);
    await sleep(100);
  };
}


(function () {

  fadeInMusic();
})()
