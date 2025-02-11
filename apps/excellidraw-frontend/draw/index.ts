export function initDraw(canvas: HTMLCanvasElement) {

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    let clicked = false;
    let startX = 0;
    let startY = 0;
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.strokeStyle = "rgba(255,255,255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener('mouseup', (e) => {
        clicked = false;
        console.log("up-X", e.clientX);
        console.log("uo-Y", e.clientY);
    });

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;

            console.log("drag-X", e.clientX);
            console.log("drag-Y", e.clientY);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeRect(startX, startY, width, height);
        }
    });
}
