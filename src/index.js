import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';

import { TRIANGULATION } from './constants';

(
	function () {
		const wrapper = document.getElementsByClassName('wrapper')[0];

		let video;

		const FPS = 30;

		let model;

		let predictions;

		let ctx;
		
		const renderCanvas = () => {
			if (ctx && document.body.contains(ctx.canvas)) {
				ctx.canvas.remove();
				ctx = null;
			}

			const canvas = document.createElement('canvas');

			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			ctx = canvas.getContext('2d');
			document.body.append(canvas);
		}

		const renderVideo = () => {
			const v = document.createElement('video');
			v.muted = 1;
			v.id = "face-screen";


			wrapper.append(v);

			video = v;
		}

		const renderFaceLoading = () => {
			const d = document.createElement('div');
			d.id = "face-notfound";
			d.classList.add('not-found');

			const img = document.createElement('img');
			img.src = "/assets/images/face-recognition.png";

			d.appendChild(img);

			wrapper.appendChild(d);
		}

		const drawTriangle = (points, closePath) => {
			const region = new Path2D();
			region.moveTo(points[0][0], points[0][1]);

			for (let i = 0; i < points.length; i++) {
				const point = points[i];
				region.lineTo(point[0], point[1]);
			}

			if (closePath) {
				region.closePath();
			}

			ctx.strokeStyle = '#ff5951';
			ctx.stroke(region);
		}

		const drawMesh = (keypoints) => {
			for (let i = 0; i < 468; i++) {
				const [x, y] = keypoints[i];

				ctx.beginPath();
				ctx.arc(x, y, 1, 0, Math.PI * 3);
				ctx.fillStyle = 'aqua';
				ctx.fill();
			}
		}

		const draw = () => {
			const faceNotFoundEl = document.getElementById('face-notfound');

			if (predictions.length > 0) {
				if (ctx && ctx.canvas && ctx.canvas.classList.contains('hidden')) ctx.canvas.classList.remove('hidden');
				if (faceNotFoundEl) faceNotFoundEl.remove();

				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

				predictions.forEach(prediction => {
					const keypoints = prediction.scaledMesh;

					for (let i = 0; i < TRIANGULATION.length / 3; i++) {
						const points = [
							TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1],
							TRIANGULATION[i * 3 + 2]
						].map(index => keypoints[index]);

						//  Draw Triangle
						drawTriangle(points, true);
					}

					// Draw Mesh
					drawMesh(keypoints);
				});
			} else {
				if (ctx && ctx.canvas) ctx.canvas.classList.add('hidden');
				if (!faceNotFoundEl) renderFaceLoading();
			}
		}

		const detect = async () => {
			predictions = await model.estimateFaces({
				input: video,
				returnTensors: false,
				flipHorizontal: false,
				predictIrises: true,
			});

			draw();
		}

		const runFacemesh = async () => { // '/assets/models/model.json'
			model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);

			document.getElementById('video-loading').remove();
			setInterval(detect, FPS);
		}

		const onLoadVideo = () => {
			video.classList.add('hidden');

			renderCanvas();
			runFacemesh();
		}

		const init = () => {
			try {
				renderVideo();

				if (window.navigator && "mediaDevices" in window.navigator) {
					window.navigator.mediaDevices
						.getUserMedia({
							video: true,
							audio: false,
						}).then(stream => {
							video.srcObject = stream;
							video.play();

							video.addEventListener('loadeddata', onLoadVideo);
						});
				} else alert("This feature is not supported by your browser");
			} catch (e) {
				alert("Can't start camera, Permission Denied");
			}
		}

		// Start Recognition
		init();
	}
)();