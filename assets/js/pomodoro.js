var interval;
var currentTime;
var minutes = $(".minutes");
var seconds = $(".seconds");
var go = true;
var canStart = true;
var takeBreak = false;
var secondClick = true;
var t = 25 * 60;
var ratio = 0.2;
var timeBreak = t * ratio;
var transition = false;
var currentIconId = "i.play";
var otherIcon = "i.pause";
var iconToggler = false;
var sound;
var soundOn = true;
var myAudio = new Audio("./assets/app_alert_tone_023.mp3");
var progressBar = new ProgressBar.Circle("#circle", {
  color: "rgb( 190, 0, 0)",
  strokeWidth: 2,
  duration: 1000, // milliseconds
  easing: "easeInOut"
});
var strokeColor1 = "rgb(190, 0, 0)";
var strokeColor2 = "rgb(100, 231, 100)";

////sliders

var slider1 = $("#range1");
var slider2 = $("#range2");
var slider3 = $("#range3");
var valueSlider1;
var valueSlider2;
var valueSlider3;
var counter1;
var counter2;
var counter3;
var textValuesSliders;
var counterTextValues;
var slidertext1 = $(".frame1 h6");
var slidertext2 = $(".frame2 h6");
var slidertext3 = $(".frame3 h6");

////
$(window).resize(function() {
  var width = $(".container").css("width");
  $(".container").css("height", width);
});
setTimer(t);
setTimeBreak(timeBreak);
$("input").attr("size", $("input").val().length - 1);
////
$(".frame3 h6").text(ratio.toString());
////

$("input").focusout(function(e) {
  t = parseInt(minutes.val()) * 60 + parseInt(seconds.val());
  if (t > 59 * 60 + 59) {
    t = 59 * 60 + 59;
  } else if (t < 0) {
    t = 0;
  } else if (minutes.val() == "" || seconds.val() == "") {
    t = 0;
  }
  timeBreak = ratio * t;
  ratio = Math.ceil((10 * timeBreak) / t) / 10;
  if (timeBreak === t) {
    ratio = 1;
  }
  $(".frame3 h6").text(ratio.toString());
  setTimeBreak(t);
  setTimer(t);
});

function setTimer(t) {
  var min = Math.floor(t / 60);
  var secDisplay = t % 60;
  minutes.val(("0" + min.toString()).slice(-2));
  seconds.val(("0" + secDisplay.toString()).slice(-2));
  $(".frame1 h6").text(minutes.val() + ":" + seconds.val());
  if (timeBreak >= t) {
    timeBreak = t;
  }
}

function setTimeBreak(t) {
  var min = Math.floor(t / 60);
  var secDisplay = t % 60;
  $(".frame2 h6").text(
    ("0" + min.toString()).slice(-2) +
      ":" +
      ("0" + secDisplay.toString()).slice(-2)
  );
}

$("#workbtn").click(function() {
  if (canStart === true) {
    canStart = false;
    lockOn(1);
    $("input").attr("disabled", true);
    if (!secondClick) {
      if (takeBreak) {
        breakStop(t);
        changeH2("TAKE A BREAK");
      } else {
        backToWork(t);
        changeH2("START");
      }
      secondClick = !secondClick;
    } else {
      if (takeBreak) {
        pomodoro(Math.ceil(timeBreak));
        $("#circle svg path").attr("stroke", strokeColor2);
        $(".burger").css("stroke", "#f2f2f2");
      } else {
        pomodoro(t);
        changeH2("WORK");
        $("#circle svg path").attr("stroke", strokeColor1);
        $(".burger").css("stroke", "#f2f2f2");
      }
      secondClick = !secondClick;
    }
  } else {
    go = !go;
    toggleButtonIcon();
  }
});

$("#resetbtn").click(function() {
  reset();
});

function reset() {
  changeH2("LET'S START");
  $("input").removeAttr("disabled");
  clearInterval(interval);
  setTimer(t);
  secondClick = true;
  takeBreak = false;
  go = true;
  canStart = true;
  timePassed = 0;
  progressBar.animate(0);
  if (iconToggler == true) {
    toggleButtonIcon();
  }
  $("#circle svg path").css("stroke", strokeColor1);
  $(".burger").css("stroke", "#f2f2f2");
  lockOn(0);
  clearInterval(sound);
  clearInterval(setValue);
  clearInterval(counter);
}

function pomodoro(t) {
  $("#circle svg path").attr("stroke-linecap", "round");
  toggleButtonIcon();
  var secs = t;
  interval = setInterval(function() {
    if (go) {
      secs--;
      currentTime = secs;
      progressBar.animate((t - secs) / t);
      setTimer(secs);
      if (!secs) {
        if (!takeBreak) {
          changeH2("Time for a break<br>(Press Play to Continue)");
        } else {
          changeH2("Back to Work<br>(Press Play to Continue)");
        }
        toggleButtonIcon();
        playSound();
        clearInterval(interval);
        toggleColor();
        takeBreak = !takeBreak;
        canStart = !canStart;
      }
    }
  }, 1000);
}

function breakStop(t) {
  progressBar.animate(0);
  var secs = parseInt(Math.ceil(timeBreak));
  setTimer(secs);
  canStart = true;
  clearInterval(sound);
}

function backToWork(t) {
  progressBar.animate(0);
  var secs = parseInt(t);
  setTimer(secs);
  canStart = true;
  clearInterval(sound);
}

function toggleButtonIcon() {
  $(currentIconId).animate(
    {
      opacity: 0
    },
    300,
    function() {
      $(currentIconId).css("display", "none");
      $(otherIcon).css("display", "block");
      $(otherIcon).animate(
        {
          opacity: 1
        },
        300,
        function() {}
      );
    }
  );
  if (iconToggler) {
    currentIconId = otherIcon;
    otherIcon = "i.play";
  } else {
    currentIconId = "i.play";
    otherIcon = "i.pause";
  }
  iconToggler = !iconToggler;
}

function toggleColor() {
  setTimeout(function() {
    if ($("#circle svg path").css("stroke") === strokeColor1) {
      $("#circle svg path").css({ stroke: strokeColor2, transition: "0.5s" });
      $(".burger").css("stroke", "#f2f2f2");
    } else {
      $("#circle svg path").css({ stroke: strokeColor1, transition: "0.5s" });
      $(".burger").css("stroke", "#f2f2f2");
    }
    $("#circle svg path").animate({}, 50, function() {
      $("#circle svg path").css({ transition: "0s" });
    });
  }, 500);
}

function changeH2(str) {
  $("h2").animate(
    {
      opacity: 0
    },
    300,
    function() {
      setTimeout(function() {
        $("h2").html(str);
        $("h2").animate(
          {
            opacity: 1
          },
          300
        );
      }, 200);
    }
  );
}

function lockOn(locked) {
  if (!locked || !$("i.lock").hasClass("fa-lock")) {
    $("i.lock").animate(
      {
        opacity: 0
      },
      200,
      function() {
        if (!locked) {
          $(this).removeClass("fa-lock");
          $(this).addClass("fa-lock-open");
        } else {
          $(this).removeClass("fa-lock-open");
          $(this).addClass("fa-lock");
        }
        $(this).animate(
          {
            opacity: 1
          },
          200
        );
      }
    );
  }
}

function playSound() {
  sound = setInterval(function() {
    myAudio.play();
  }, 400);
}

//////// Code just for navbar

var menuIsOpen = false;

$(".toggleMenu").click(function(e) {
  e.stopPropagation();
  toggleNav();
});

function toggleNav() {
  menuIsOpen = !menuIsOpen;
  if (document.getElementById("sideNavigation").style.width == "250px") {
    document.getElementById("sideNavigation").style.width = "0";
  } else {
    document.getElementById("sideNavigation").style.width = "250px";
  }
}

$(document).click(function(event) {
  if (
    !$(event.target).hasClass("sidenav") &&
    !$(event.target)
      .parents()
      .hasClass("sidenav") &&
    menuIsOpen
  ) {
    toggleNav();
    console.log($(event.target));
  }
});

$(".toggleMenu").hover(
  function() {
    $(".burger").css("stroke", "#323232");
    document.querySelector(".mySVG").classList.toggle("rotated");
  },
  function() {
    $(".burger").css("stroke", "#d3d3d3");
    $("a svg").toggleClass("rotated");
    document.querySelector(".mySVG").classList.toggle("rotated");
  }
);

//////////Slider code

/////slider1

slider1.mousedown(function() {
  count = 0;
  valueSlider1 = setInterval(function() {
    t = parseInt((parseInt(slider1.val()) / 3599) * (59 * 60 + 59));
    if (timeBreak >= t) {
      timeBreak = t;
    }
    ratio = Math.ceil((10 * timeBreak) / t) / 10;
    if (timeBreak === t) {
      ratio = 1;
    }
    setTimer(t);
  }, 20);
  counter1 = setInterval(function() {
    count++;
    if (count > 300) {
      clearInterval(valueSlider1);
      clearInterval(counter1);
    }
  }, 1000);
});

slider1.focusout(function() {
  clearInterval(valueSlider1);
  clearInterval(counter1);
});

////// slider2

slider2.mousedown(function() {
  count = 0;
  valueSlider2 = setInterval(function() {
    value = $("#range2").val();
    timeBreak = parseInt((parseInt(slider2.val()) / 3599) * t);
    if (timeBreak >= t) {
      timeBreak = t;
    }
    ratio = Math.ceil((10 * timeBreak) / t) / 10;
    if (timeBreak === t) {
      ratio = 1;
    }
  }, 20);
  counter2 = setInterval(function() {
    count++;
    if (count > 300) {
      clearInterval(valueSlider2);
      clearInterval(counter2);
    }
  }, 1000);
});

slider2.focusout(function() {
  clearInterval(valueSlider2);
  clearInterval(counter2);
});

//////slider3

slider3.mousedown(function() {
  count = 0;
  valueSlider3 = setInterval(function() {
    ratio = slider3.val() / 10;
    timeBreak = Math.ceil(t * ratio);
    if (timeBreak >= t) {
      timeBreak = t;
    }
    if (timeBreak === t) {
      ratio = 1;
    }
    setTimeBreak;
  }, 20);
  counter3 = setInterval(function() {
    count++;
    if (count > 300) {
      clearInterval(valueSlider3);
      clearInterval(counter3);
    }
  }, 1000);
});

slider3.focusout(function() {
  clearInterval(valueSlider3);
  clearInterval(counter3);
});

$("input[type='range']").mousedown(function() {
  count = 0;
  textValuesSliders = setInterval(function() {
    $(".frame1 h6").text(minutes.val() + ":" + seconds.val());
    setTimeBreak(timeBreak);
    $(".frame3 h6").text(ratio.toString());
  }, 20);
  counterTextValues = setInterval(function() {
    count++;
    if (count > 300) {
      clearInterval(textValuesSliders);
      clearInterval(counterTextValues);
    }
  }, 1000);
});

$("input[type='range']").focusout(function() {
  clearInterval(textValuesSliders);
  clearInterval(counterTextValues);
});

$("input[type='checkbox']").change(function() {
  if (soundOn == true) {
    myAudio = null;
  } else {
    myAudio = new Audio("./assets/app_alert_tone_023.mp3");
  }
});
