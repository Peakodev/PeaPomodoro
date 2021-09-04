const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const clockTime = $('.clock__time')
const clockTimeElements = [...$$('.clock__time span')]
const clockBtn = $('.clock__btn')

var started = false;
var ended = false;
var playing = false
var type = 3
var timeOutList = []
var curMin = 0;
var curSec = 0;
const app = {

    breakList: [
        {
            time: 300,
            target: $('.break-choice.short')
        },
        {
            time: 1500,
            target: $('.break-choice.pomodoro')
        },
        {
            time: 900,
            target: $('.break-choice.long')
        }
    ],

    clearAllTimeOuts: function () {
        for(let x of timeOutList) {
            clearTimeout(x)
        }
    },

    updateTime: function(time) {
        if(time == 0) {
            // Reset Time
            ended = true
            clockBtn.innerText = 'Reset'
        }
        
        curMin = Math.floor(time/60)
        curSec = time%60
        app.renderTime()
    },

    renderTime: function(m = curMin,s = curSec) {
        clockTimeElements[0].innerText = m<10 ? '0' + m : m
        clockTimeElements[2].innerText = s<10 ? '0' + s : s
    },

    handleEvents: function() {
        clockBtn.onclick = function() {
            if(started && ended==false) {

                playing = !playing
                if(playing) {

                    clockBtn.innerText = "Pause"
                    let time = curMin*60 + curSec - 1;
                    app.updateTime(time)

                    for(let i = time;i>0;i--) {
                        const setTime = setTimeout(function() {
                            app.updateTime(i-1)
                        },(time-i+1)*1000)

                        timeOutList.push(setTime)
                    }
                } else {
                    clockBtn.innerText = "START"
                    app.clearAllTimeOuts()
                }
            } else if(ended == true) {
                app.breakList[type].target.click()
            } else {
                started = true
                playing = true
                ended = false

                clockBtn.innerText = "Pause"

                let time = app.breakList[type].time
                for(let i = time;i>0;i--) {
                    const setTime = setTimeout(function() {
                        app.updateTime(i-1)
                    },(time-i+1)*1000)

                    timeOutList.push(setTime)
                }
            }
        }

        app.breakList.forEach((e,i) => {
            e.target.onclick = function() {
                if($('.break-choice.active'))
                $('.break-choice.active').classList.remove('active')

                e.target.classList.add('active')

                type = i

                app.clearAllTimeOuts()

                started = false;
                ended = false;
                playing = false;

                clockBtn.innerText = "START"

                app.updateTime(e.time)
            }
        });
    },
    // render UI
    render: function() {

    },

    start: function() {
        app.handleEvents()
        app.breakList[1].target.click()
    }
}

app.start();

function checkOverflow(e)
{
   var curOverflow = e.style.overflow;

   if ( !curOverflow || curOverflow === "visible" )
      e.style.overflow = "hidden";

   var isOverflowing = e.clientWidth < e.scrollWidth 
      || e.clientHeight < e.scrollHeight;

   e.style.overflow = curOverflow;

   return isOverflowing;
}