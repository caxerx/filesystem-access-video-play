async function* loadFolderVideos(handler) {
  const fileIterator = handler.entries();

  for await (const entry of fileIterator) {
    if (entry[1].kind == "file") {
      const file = await entry[1].getFile();
      if (file.type.includes("video")) {
        yield URL.createObjectURL(file);
      }
    }
  }
}

let videoPlayingPromise;

async function startPlayerLoop() {
  const handler = await window.showDirectoryPicker();
  while (true) {
    for await (const videoUrl of loadFolderVideos(handler)) {
      const video = document.getElementById("vdo");
      video.src = videoUrl;
      video.autoplay = true;
      video.play();
      videoPlayingPromise = new Promise((resolve) => (video.onended = resolve));
      await videoPlayingPromise;
      URL.revokeObjectURL(videoUrl);
    }
  }
}
