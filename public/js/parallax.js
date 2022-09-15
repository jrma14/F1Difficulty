// let offsetY = -1240
// let offsetX = -1754
//1260,1311


document.addEventListener("mousemove",parallax)

function parallax(e){
    let maxX = (window.innerWidth - 3508)/2
    let maxY = (window.innerHeight - 2480)/2
    // let offsetX = (window.innerWidth - 3508)/2
    // let offsetY = (window.innerHeight - 2480)/2
    let intensityX = 2*maxX/window.innerWidth
    let intensityY = -2*maxY/window.innerHeight
    let x0 = window.innerWidth/2
    let y0 = window.innerHeight/2
    let x = e.clientX - x0
    let y = y0 - e.clientY
    let transX = x * intensityX
    let transY = y * intensityY
    if(Math.abs(transX) > Math.abs(maxX)) {
        if(transX < 0){
            transX = maxX
        } else {
            transX = -maxX
        }
    }
    if(Math.abs(transY) > Math.abs(maxY)){
        if(transY < 0){
            transY = maxY
        } else {
            transY = -maxY
        }
    }
    document.documentElement.style.setProperty('--bg-x', transX + maxX + "px")
    document.documentElement.style.setProperty('--bg-y', transY + maxY + "px")
    // console.log("max", maxX, maxY)
    console.log("trans:", transX, transY)
    console.log("curr:",transX + offsetX,transY + offsetY)
}