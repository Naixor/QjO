(function () {
    "use strict"

    var learnModelURL = "/html/LearnModelPage.html";
    var showModelURL = "/html/ShowModelPage.html";
    var shareModelURL = "/html/ShareModelPage.html";
    var notCompleteModelURL = "/html/NotCompletePage.html";

    function ready(element, option) {
        WinJS.UI.processAll(element).done(
            function () {
                setTimeout(function () {
                    document.getElementById("backSound").play();
                }, 1500)
                
                document.getElementById("Home").winControl.addEventListener("click", AppBarsEventManager.appbarClick_HOME, false);
                document.getElementById("Introduce").winControl.addEventListener("click", AppBarsEventManager.appbarClick_INTRODUCE, false);
                document.getElementById("About").winControl.addEventListener("click", AppBarsEventManager.appbarClick_ABOUT, false);

                WinJS.Navigation.navigate(AppBarsEventManager.currentPage);
            }
        );
    }

    WinJS.UI.Pages.define("/html/HomePage.html", {
        ready: ready
    });

    function navigateLearnModel () {
        var loc = WinJS.Navigation.location;
        if(loc !== "" && loc !== learnModelURL) {
            WinJS.Navigation.navigate(learnModelURL);
            document.body.style.background = "url(/images/LearnModelPage/background.jpg) no-repeat";
            document.getElementById("appbar").winControl.hide();
        }
    }

    function navigateShowModel() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== showModelURL) {
            WinJS.Navigation.navigate(showModelURL);
            document.body.style.background = "url(/images/ShowModelPage/background.jpg) no-repeat";
            document.getElementById("appbar").winControl.hide();
        }
    }

    function navigateShareModel() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== shareModelURL) {
            WinJS.Navigation.navigate(shareModelURL);
            document.body.style.background = "url(/images/ShareModelPage/background.png) no-repeat";
            document.getElementById("appbar").winControl.hide();
        }
    }

    function navigateNotCom() {
        var loc = WinJS.Navigation.location;
        if (loc !== "" && loc !== notCompleteModelURL) {
            WinJS.Navigation.navigate(notCompleteModelURL);
            document.getElementById("appbar").winControl.hide();
        }
    }

    WinJS.Namespace.define("HomePageManager", {
        navigateLearnModel: navigateLearnModel,
        navigateShowModel: navigateShowModel,
        navigateNotCom: navigateNotCom,
        navigateShareModel: navigateShareModel
    });
})();