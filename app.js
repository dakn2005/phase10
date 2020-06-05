// window.addEventListener("beforeunload", function (e) {
//     return "Data will be lost if you leave the page, are you sure?";
// })

// window.addEventListener("beforeunload", function (e) {
//     var confirmationMessage = 'Data will be lost if you leave the page, are you sure?';

//     (e || window.event).returnValue = confirmationMessage; //Gecko + IE
//     return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
// });

// check out https://github.com/adamhaile/surplus
var app = (function () {
    var self = this,
        pics = ['jokes.png', 'chile.png', 'arif.png', 'chile2.png', 'arif2.png', 'chile3.png', 'arif3.png'],

        playerDara = function (pname) {
            let me = this;
            me.picClickCount = ko.observable(0)
            me.imgsrc = ko.observable(pics[0]);
            me.names = ko.observable(pname.toLowerCase().charAt(0).toUpperCase() + pname.toLowerCase().slice(1));
            me.level = ko.observable('level 1');
            me.img = ko.observable();
            me.score = ko.observable();
            me.scores = ko.observableArray([]);
            me.scoreTotal = ko.pureComputed(() => this.scores().map(obj => obj.score).reduce(
                (a, n) => parseInt(a) + parseInt(n), 0
            ));

            me.addScore = () => {
                if (!!me.score() && me.score() !== '') {
                    me.scores.push({
                        level: me.level(),
                        score: me.score(),
                        text: `${me.level()} - ${me.score()}`
                    });

                    me.score('');
                }
            }
            // me.score.subscribe((newval) => {
            // });

            me.popScore = () => {
                if (confirm('remove last score?'))
                    me.scores.pop();
            }

            me.changePic = () => {
                me.picClickCount(me.picClickCount() + 1);

                if (me.picClickCount() == pics.length)
                    me.picClickCount(0);

                me.imgsrc(pics[me.picClickCount()])
            }
        },

        vm = function () {
            self.playerName = ko.observable();
            self.players = ko.observableArray();
            self.levels = [...Array(10).keys()].map(k => k + 1).map(nk => `level ${nk}`);

            self.onEnter = (d, e) => {
                if (e.keyCode === 13)
                    self.addPlayer();
                else
                    return true
            }

            self.addPlayer = () => {
                if (!self.playerName() || self.playerName() == '')
                    alert('You must enter player name')
                else {
                    self.players.push(new playerDara(self.playerName()));
                    self.playerName('')
                }
            }



            self.removePlayer = (p) => {
                if (confirm(`Remove ${p.names()} from the game?`))
                    self.players.remove(p)
            }
        },

        anza = () => {
            ko.applyBindings(new vm(), document.getElementById('wrapper'))
            // document.getElementById('btnadd').click();
            
        }

    return { anza: anza }

})();

app.anza();