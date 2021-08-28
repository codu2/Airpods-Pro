const html = document.documentElement;
const canvas = document.getElementById('hero-lightpass');
const context = canvas.getContext('2d');

const frameCount = 148; //image frames count 이미지 프레임들의 총 갯수
const currentFrame = index => (
    `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`
)

canvas.width = 1158;
canvas.height = 770;

const preloadImages = () => {
    for (let i = 1; i < frameCount; i++) {
        const image = new Image();
        image.src = currentFrame(i);
    }
}
/*
Scrolling quickly results in a little lag between image frames.
That's because every new image sends off a new network request, requiring a new download.
Should try preloading the images new network requests. 
That way, each frame is already downloaded, making the transitions that much faster,
and the animation that much smoother.
화면을 빠르게 스크롤 하면 이미지 프레임 간의 약간의 지연이 생긴다. 
모든 새 이미지가 새 네트워크를 요청하므로 새로운 다운로드가 매번 필요하기 때문이다.
따라서 이미지를 사전 로드할 필요가 있다. 이렇게 하면 각 프레임이 미리 다운로드 되어 transition이 훨씬 빨라지고 animation이 훨씬 부드러워진다.
*/

const image = new Image(); //image 객체 생성
image.src = currentFrame(1);

image.onload = function () {
    context.drawImage(image, 0, 0);
}
/*
image가 load되면 context에 drawImage() 메서드 실행. 
drawImage(img, x, y, width, height) 
img : image 객체
x : 이미지 객체가 그려질 x 좌표
y : 이미지 객체가 그려질 y 좌표
width : 이미지가 그려지는 넓이 지정, 옵션
height : 이미지가 그려지는 높이 지정, 옵션
*/

window.addEventListener('scroll', () => {
    const scrollTop = html.scrollTop;
    const maxScroll = html.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;
    const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * 148));
    requestAnimationFrame(() => updateCanvas(frameIndex + 1));
})
/* 
사용자의 스크롤 위치를 알아내서 해당 스크롤 위치에 해당하는 이미지 프레임을 결정해야 한다. 
이미지를 사용자의 스크롤 진행률에 연결해야 하는데 이를 위해선
스크롤의 시작 및 종료 위치, 사용자의 스크롤 진행률, 사용자의 스크롤 진행률에 해당하는 이미지가 필요하다.
html의 scrollTop의 값을 scrollTop에 저장한다. 이는 문서의 맨 위, 즉 스크롤의 시작점 값이다.
html의 scrollHeight, 즉 스크롤 높이에서 window의 창 높이를 빼면 사용자가 스크롤 할 수 있는 높이의 최댓값이다.
스크롤 진행률인 scrollFraction은 현재 문서 상단의 값(scrollTop 값)을 사용자가 스크롤 할 수 있는 높이의 최댓값(maxScroll 값)으로 나눈다.

그런 다음 해당 위치에 맞는 이미지를 반환하려면 스크롤 진행률을 이미지 번호 순서에 맞는 인덱스 번호로 변환해야 한다. 
이미지 번호 인덱스는 1에서 147까지 있다. 스크롤 진행률에 이미지 프레임의 갯수를 곱하면 되는데,
Math.floor() 메서드를 사용하여 해당 숫자를 반올림하고, 
최대 프레임 수를 사용하여 전체 프레임 수를 초과하지 않도록 Math.min() 메서드를 사용한다.

requestAnimationFrame()을 사용하면 프레임 간의 매우 원활한 전환이 가능하여, 이미지가 깜박이지 않는다.
requestAnimationFrame()은 콜백 인수를 사용하므로 image source를 업데이트하고 새 이미지를 <canvas>에 그리는 함수를 전달한다.

이미지가 문서 최상단에서 스크롤 되기 시작할 때 스크롤 진행률은 0에서 시작하므로 1을 더해준다. 
이미지는 0001.jpg부터 시작하기 때문이다.
*/

const updateCanvas = index => {
    image.src = currentFrame(index);
    context.drawImage(image, 0, 0);
}

preloadImages();