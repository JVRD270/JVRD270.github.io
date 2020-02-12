//add sound when timer ends
//make side menu with bars

var interval;
var currentTime;
var minutes = $(".minutes");
var seconds = $(".seconds");
var go = true;
var canStart = true;
var takeBreak = false;
var secondClick = true;
var t = 25 * 60;
var transition = false;
var ratio = 0.2;
var currentIconId = "i.play";
var otherIcon = "i.pause";
var iconToggler = false;
var progressBar = new ProgressBar.Circle("#circle", {
  color: "rgb( 190, 0, 0)",
  strokeWidth: 2,
  duration: 1000, // milliseconds
  easing: "easeInOut"
});
var strokeColor1 = "rgb(190, 0, 0)";
var strokeColor2 = "rgb(100, 231, 100)";

setTimer(t);
$("input").attr("size", $("input").val().length - 1);

$("input").focusout(function(e) {
  t = parseInt(minutes.val()) * 60 + parseInt(seconds.val());
  if (t > 99 * 60 + 59) {
    t = 99 * 60 + 59;
  } else if (t < 0) {
    t = 0;
  } else if (minutes.val() == "" || seconds.val() == "") {
    t = 0;
  }
  setTimer(t);
});

function setTimer(t) {
  var min = Math.floor(t / 60);
  var secDisplay = t % 60;
  minutes.val(("0" + min.toString()).slice(-2));
  seconds.val(("0" + secDisplay.toString()).slice(-2));
}

$("#workbtn").click(function() {
  if (canStart === true) {
    canStart = false;
    $("input").attr("disabled", true);
    if (!secondClick) {
      if (takeBreak) {
        breakStop(t);
        changeH2("TAKE A BREAK");
      } else {
        backToWork(t);
        changeH2("BACK TO WORK");
      }
      secondClick = !secondClick;
    } else {
      if (takeBreak) {
        pomodoro(t * ratio);
        $("path").attr("stroke", strokeColor2);
      } else {
        pomodoro(t);
        changeH2("WORK");
        $("path").attr("stroke", strokeColor1);
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
  iconToggler = false;
  $("path").css("stroke", strokeColor1);
}

function pomodoro(t) {
  $("path").attr("stroke-linecap", "round");
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
          toggleButtonIcon();
        } else {
          toggleButtonIcon();
        }
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
  var secs = parseInt(t * ratio);
  setTimer(secs);
  canStart = true;
}

function backToWork(t) {
  progressBar.animate(0);
  var secs = parseInt(t);
  setTimer(secs);
  canStart = true;
}

function toggleButtonIcon() {
  if (iconToggler) {
    currentIconId = otherIcon;
    otherIcon = "i.play";
  } else {
    currentIconId = "i.play";
    otherIcon = "i.pause";
  }
  iconToggler = !iconToggler;
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
}

function toggleColor() {
  setTimeout(function() {
    if ($("path").css("stroke") === strokeColor1) {
      $("path").css({ stroke: strokeColor2, transition: "0.5s" });
    } else {
      $("path").css({ stroke: strokeColor1, transition: "0.5s" });
    }
    $("path").animate({}, 50, function() {
      $("path").css({ transition: "0s" });
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
        $("h2").text(str);
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
