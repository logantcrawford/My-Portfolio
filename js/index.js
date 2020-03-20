
// Rotate Text Controller
var text_rotate = (function() {
    var TxtRotate = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };
    
    TxtRotate.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

        var that = this;
        var delta = 300 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(function() {
            that.tick();
        }, delta);
    };
    
    window.onload = function() {
        var elements = document.getElementsByClassName('txt-rotate');
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-rotate');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
                new TxtRotate(elements[i], JSON.parse(toRotate), period);
            }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #ffffff }";
        document.body.appendChild(css);
    };
})();


async function instagramPhotos () {
    // It will contain our photos' links
    const res = []
    
    try {
        const userInfoSource = await Axios.get('https://www.instagram.com/theraloss/')

        // userInfoSource.data contains the HTML from Axios
        const jsonObject = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)

        const userInfo = JSON.parse(jsonObject)
        // Retrieve only the first 10 results
        const mediaArray = userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(0, 10)
        for (let media of mediaArray) {
            const node = media.node
            
            // Process only if is an image
            if ((node.__typename && node.__typename !== 'GraphImage')) {
                continue
            }

            // Push the thumbnail src in the array
            res.push(node.thumbnail_src)
        }
    } catch (e) {
        console.error('Unable to retrieve photos. Reason: ' + e.toString())
    }
    console.log(res)
    return res
}


// UI Controller
var UI_controller = (function() {
    const API_KEY = 'rKoLtsaSoo5EMSgOylLbplSXZ'; // TODO: Don't forget to hide this
    const API_SECRET_KEY = 'DuJx4wEKYrV0555XF9YAbphxmHRoojWC3y91KpDESDTdTStXGE'; // TODO: Don't forget to hide this

    var DOM_strings = {
        tweet_1: '.',
        tweet_2: '.',
        tweet_3: '.',
        tweet_1_link: '.',
        tweet_1_link: '.',
        tweet_1_link: '.',
        date_label: '.footer__date--year',
        nav_container: 'navbar__container',
        nav_toggler: 'navbar-toggler',
        nav_icon: 'navbar__icon',
        nav_logo: 'navbar__logo',
        item_1: 'nav-item--1',
        item_2: 'nav-item--2',
        item_3: 'nav-item--3',
        item_4: 'nav-item--4',
        item_5: 'nav-item--5',
        link_1: 'nav-link--1',
        link_2: 'nav-link--2',
        link_3: 'nav-link--3',
        link_4: 'nav-link--4',
        link_5: 'nav-link--5',
    };

    return { 
        display_method: function() {
            var now, year;
            now = new Date();
            year = now.getFullYear();
            document.querySelector(DOM_strings.date_label).textContent = year;
        },
        dark_nav: function() {
            document.getElementById(DOM_strings.nav_container).className = "navbar__container navbar__container--white";
            document.getElementById(DOM_strings.nav_toggler).className = "navbar-toggler navbar-toggler--dark";
            document.getElementById(DOM_strings.nav_icon).className = "navbar__icon navbar__icon--dark";
            document.getElementById(DOM_strings.nav_logo).src = "img/young-sons-logo-black.png";
            document.getElementById(DOM_strings.item_1).className = "nav-item nav-item--dark";
            document.getElementById(DOM_strings.item_2).className = "nav-item nav-item--dark";
            document.getElementById(DOM_strings.item_3).className = "nav-item nav-item--dark";
            document.getElementById(DOM_strings.item_4).className = "nav-item nav-item--dark";
            document.getElementById(DOM_strings.item_5).className = "nav-item nav-item--dark";
            document.getElementById(DOM_strings.link_1).className = "nav-link nav-link--dark";
            document.getElementById(DOM_strings.link_2).className = "nav-link nav-link--dark";
            document.getElementById(DOM_strings.link_3).className = "nav-link nav-link--dark";
            document.getElementById(DOM_strings.link_4).className = "nav-link nav-link--dark";
            document.getElementById(DOM_strings.link_5).className = "nav-link nav-link--dark";
        },
        light_nav: function() {
            document.getElementById(DOM_strings.nav_container).className = "navbar__container";
            document.getElementById(DOM_strings.nav_toggler).className = "navbar-toggler";
            document.getElementById(DOM_strings.nav_icon).className = "navbar__icon";
            document.getElementById(DOM_strings.nav_logo).src = "img/young-sons-logo-white.png";
            document.getElementById(DOM_strings.item_1).className = "nav-item";
            document.getElementById(DOM_strings.item_2).className = "nav-item";
            document.getElementById(DOM_strings.item_3).className = "nav-item";
            document.getElementById(DOM_strings.item_4).className = "nav-item";
            document.getElementById(DOM_strings.item_5).className = "nav-item";
            document.getElementById(DOM_strings.link_1).className = "nav-link";
            document.getElementById(DOM_strings.link_2).className = "nav-link";
            document.getElementById(DOM_strings.link_3).className = "nav-link";
            document.getElementById(DOM_strings.link_4).className = "nav-link";
            document.getElementById(DOM_strings.link_5).className = "nav-link";
        },
        ctrl_nav_toggle: function() {

        },
        display_tweets: function() {

        },
        get_DOM_strings: function() {
            return DOM_strings;
        },
    };
})();

// Event Controller
var event_controller = (function() {
    return {
        scroll_event: function() { 
            return document.documentElement.scrollTop
        },
        get_toggler: function(DOM) { 
            let elements = document.getElementsByClassName(DOM.nav_toggler);
            result = elements[0].getAttribute('aria-expanded');
            if (result === 'true') {
                return true;
            } else {
                return false;
            }
        },
    };
})();


// Global App Controller
var app_controller = (function(event_ctr, UI_ctr) { 
    let DOM = UI_ctr.get_DOM_strings();
    var setup_event_listeners = function() {
        document.getElementById(DOM.nav_toggler).addEventListener('click', ctrl_nav_toggle);
        window.onscroll = function() {
            let scroll_top = event_ctr.scroll_event();
            let result = event_ctr.get_toggler(DOM);
            if (scroll_top > 400) {
                if (result) {
                    UI_ctr.dark_nav();
                } else {
                    UI_ctr.dark_nav();
                }
            } else if (scroll_top < 400) {
                if (result) {
                    UI_ctr.dark_nav();
                } else {
                    UI_ctr.light_nav();
                }
            };
        };
    };
    var ctrl_nav_toggle = function() {
        let scroll_top = event_ctr.scroll_event();
        let result = event_ctr.get_toggler(DOM);
        console.log(window.scrollY);
        if (result) {
            if (scroll_top > 400) {
                UI_ctr.dark_nav();
            } else {
                UI_ctr.light_nav();
            }
        } else {
            if (scroll_top < 400) {
                UI_ctr.dark_nav();
            

                document.getElementById(DOM.nav_icon).className = "navbar__icon navbar__icon--dark navbar__icon--clicked";
            } else {
                UI_ctr.dark_nav();

                document.getElementById(DOM.nav_icon).className = "navbar__icon navbar__icon--dark navbar__icon--clicked";
            }
        };
    };

    return {
        init: function() {
            UI_ctr.display_method();
            setup_event_listeners();
            document.getElementsByClassName("navbar__fade--on").style.display = "block";
        }
    };

})(event_controller, UI_controller);

app_controller.init();



