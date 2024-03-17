var video = document.getElementById('videoElement');
        var canvas = document.getElementById('canvas');
        var photo = document.getElementById('photo');
        var captureButton = document.getElementById('captureButton');
        var openCamButton = document.getElementById('openCamera');
        var img_frame = document.getElementById("image-box");
        var predictButton = document.getElementById('predictButton');
        const ANIMAL_CLASS = {
            0: 'Cat',
            1: 'Chicken',
            2: 'Cow',
            3: 'Dog',
            4: 'Duck',
            5: 'Goat',
            6: 'Goose',
            7: 'Horse',
            8: 'Pig',
            9: 'Sheep'
        };
        const Transate = {
            "Cat": "Mèo",
            "Chicken": "Gà",
            "Cow": "Bò",
            "Dog": "Chó",
            "Duck": "Vịt",
            "Goat": "Dê",
            "Goose": "Ngỗng",
            "Horse": "Ngựa",
            "Pig": "Lợn",
            "Sheep": "Cừu"
        }
        
        let videoStream;

        function startCamera() {
            if(document.getElementById('photo').getAttribute("src") != null) {
                document.getElementById('photo').removeAttribute("src");
            }
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    const videoElement = document.createElement('video');
                    photo.classList.add('d-none');
                    videoElement.id = 'videoElement';
                    videoElement.style.width = "100%";
                    videoElement.style.height = "100%";
                    videoElement.width = 470;
                    videoElement.height = 360;
                    videoElement.setAttribute('autoplay', '');
                    videoElement.srcObject = stream;
                    img_frame.appendChild(videoElement);
                    videoStream = stream;
                });
                openCamButton.textContent = "Tắt Camera";
            }
        }
        function capture() {
            var video = document.getElementById('videoElement');
            var canvas = document.createElement('canvas');
            canvas.width = video.width;
            canvas.height = video.height;
            var context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, video.width, video.height);
            var photo = document.getElementById('photo');
            photo.setAttribute('src', canvas.toDataURL('image/png'));
            photo.classList.remove('d-none');
            canvas.remove();
        }
        function stopCamera() {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
            const videoElement = document.querySelector('#videoElement');
            if (videoElement) {
                videoElement.remove();
            }
            openCamButton.textContent = "Mở Camera";
        }

        captureButton.addEventListener('click', function() {
            capture();
            stopCamera();
            captureButton.style.visibility = "hidden";
        });
        

        openCamButton.addEventListener("click", function() {
            if (videoStream) {
                stopCamera();
                captureButton.style.visibility = "hidden";
            } else {
                startCamera();
                captureButton.style.visibility = "visible";
            }
        });
        
        document.getElementById('uploadButton').addEventListener('click', function() {
            document.getElementById('openImage').click();
        });

        document.getElementById('openImage').addEventListener('change', function() {
            var file = this.files[0];

            if (file && file.type.startsWith('image/')) {
                var reader = new FileReader();

                reader.onload = function(event) {
                    //const imagePreview = document.getElementById('image-box');
                    //imagePreview.innerHTML = ''; -->
                    const img = document.getElementById('photo');
                    img.setAttribute('src', event.target.result);
                    //img.src = event.target.result;
                    //img.style.Width = '100%';
                    //imagePreview.appendChild(img); -->
                };

                reader.readAsDataURL(file);
            } else {
                alert('Vui lòng chọn một tệp ảnh.');
            }
        });

        async function predict() {
            let image = document.getElementById("photo");
            let img = tf.browser.fromPixels(image);
            let normalizationOffset = tf.scalar(255 / 2);
            let tensor = img
                .resizeNearestNeighbor([256, 256])
                .toFloat()
                .sub(normalizationOffset)
                .div(normalizationOffset)
                .reverse(2)
                .expandDims();

            let predictions = await model.predict(tensor);
            predictions = predictions.dataSync();
            console.log(predictions);

            let result = Array.from(predictions)
                .map(function (p, i) {
                    return {
                        probability: p,
                        className: ANIMAL_CLASS[i]
                    };
                }).sort(function (a, b) {
                    return b.probability - a.probability;
                });
            return result;
        };

        document.getElementById('predictButton').addEventListener('click', () => {
            try {
                capture();
                stopCamera();
                captureButton.style.visibility = "hidden";
            } catch {
            }
            if(photo.getAttribute('src') === null) {
                alert("Vui lòng chọn hình ảnh.")
            }
            else {
                let result = predict();
                console.log(result);
                result.then(function(res) {
                    let best_answer = res[0];
                    console.log(res);
                    res.forEach((e) => {
                        let element = document.getElementById((e.className))
                        element.innerText = (e.probability * 100).toFixed(3)
                        if(best_answer.className === e.className && best_answer.probability <= e.probability) {
                            best_answer = e
                        }
                    })
                    document.getElementById('result').innerText = Transate[best_answer.className]
                    document.getElementById('result-box').classList.remove('d-none')
                }).catch(function(error) {
                    console.error(error);
                });
            }
        })