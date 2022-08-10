
document.addEventListener('DOMContentLoaded', async () => {

  // getUserMedia
  const videoMedia = document.getElementById('video-media');

  // getDisplayMedia
  const videoCapture = document.getElementById('video-capture');

  // 取得使用者攝影機、麥克風的授權
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  async function getMedia(constraints) {
    const mediaStream =
      await navigator.mediaDevices.getUserMedia(constraints)
              .then(stream => stream)
              .catch((err) => {
                console.error(`${err.name}: ${err.message}`);
              });

    videoMedia.srcObject = mediaStream;
    videoMedia.onloadedmetadata = () => {
      videoMedia.play();
    };
    console.log(mediaStream.getTracks());
  }

  let facingMode = false; // false：後鏡頭、true：前鏡頭
  let constraints = {
    // deviceId: xxxxxx, // 可以指定要哪用個裝置，從 enumerateDevices 取得裝置 id
    audio: true,
    video: {
      // 給理想值時，瀏覽器會去找符合理想值的裝置
      width: { ideal: 1280 },
      height: { ideal: 720 },

      // 行動裝置才能使用
      // user：前鏡頭、environment：後鏡頭
      facingMode: 'environment'
    }
  };
  const btnGetUserMedia = document.getElementById('getUserMedia');
  btnGetUserMedia.addEventListener('click', async e => {
    e.preventDefault();
    await getMedia(constraints);
  }, false);

  // 翻轉鏡頭
  const btnFlip = document.getElementById('flipFacingMode');
  btnFlip.addEventListener('click', async e => {
    e.preventDefault();
    facingMode = !facingMode;
    constraints.video.facingMode = facingMode ? 'user' : 'environment';
    await getMedia(constraints);
  }, false)


  // 取得使用者的輸入源清單
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
  async function getEnumerateDevices() {
    if(!navigator.mediaDevices.enumerateDevices) {
      console.log('不支援 enumerateDevices()');
    } else {
      let devices = await navigator.mediaDevices.enumerateDevices()
        .then(devices => devices)
        .catch(err => {
          console.error(`${err.name}: ${err.message}`);
        });

      // 列出更詳細的資訊：getCapabilities()
      // https://developer.mozilla.org/en-US/docs/Web/API/InputDeviceInfo/getCapabilities
      Array.prototype.forEach.call(devices, device => {
        if(typeof device.getCapabilities !== 'undefined') {
          let moreInfo = device.getCapabilities();
          // console.log(moreInfo);
        }
      });

      return devices;
    }
  }
  const btnEnumerate = document.getElementById('getEnumerateDevices');
  btnEnumerate.addEventListener('click', async e => {
    e.preventDefault();
    const content = document.querySelector('#card-enumerate .content');
    content.innerHTML = '';
    const devices = await getEnumerateDevices();

    Array.prototype.forEach.call(devices, device => {
      console.log(`${device.kind}: ${device.label}`);
      content.insertAdjacentHTML('beforeend', `<p class="inline-block px-2 py-1 bg-main outline-none rounded text-white text-xs">${device.kind}</p>`);
      content.insertAdjacentHTML('beforeend', `<p class="mb-4 p-1">${device.label}</p>`);
    });
  }, false)


  // 取得使用者裝置支援的項目
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getSupportedConstraints
  function getSupportedConstraints() {
    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    return supportedConstraints;
  }
  const btnSupport = document.getElementById('getSupportedConstraints');
  btnSupport.addEventListener('click', e => {
    e.preventDefault();
    const content = document.querySelector('#card-support .content');
    content.innerHTML = '';
    const list = getSupportedConstraints();
    const listKey = Object.keys(list);
    Array.prototype.forEach.call(listKey, key => {
      if(list[key]) {
        content.insertAdjacentHTML('beforeend', `<p class="py-1"><span class="inline-flex justify-center items-center mr-1 w-4 h-4 bg-main rounded-full text-white text-sm">&check;</span>${key}</p>`)
      } else {
        content.insertAdjacentHTML('beforeend', `<p class="py-1"><span class="inline-flex justify-center items-center mr-1 w-4 h-4 bg-red-600 rounded-full text-white text-sm">&times;</span>${key}</p>`)
      }
    })
  }, false)

  // 取得使用者畫面並作分享
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
  async function startCapture(constraints) {
    let captureStream;
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      videoCapture.srcObject = captureStream;
      videoCapture.onloadedmetadata = () => {
        videoCapture.play();
      };
    } catch (err) {
      console.error(`Error: ${err}`);
    }
    console.log(captureStream.getTracks());
    return captureStream;
  }
  const btnShare = document.getElementById('startCapture');
  btnShare.addEventListener('click', async e => {
    e.preventDefault();
    const capture = await startCapture(constraints);
    console.log(capture);
  }, false)


})