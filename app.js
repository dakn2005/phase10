// check out https://github.com/adamhaile/surplus
var app = (function () {
    var self = this,
        pics = ['jokes.png', 'chile.png', 'arif.png'],

        playerDara = function (pname) {
            let me = this;
            me.picClickCount = ko.observable(0)
            me.imgsrc = ko.observable(pics[0]);
            me.names = ko.observable(pname);
            me.level = ko.observable('level 1');
            me.img = ko.observable();
            me.score = ko.observable();
            me.scores = ko.observableArray([]);
            me.scoreTotal = ko.pureComputed(() => this.scores().map(obj => obj.score).reduce(
                (a, n) => parseInt(a) + parseInt(n), 0
            ));

            me.score.subscribe((newval) => {
                me.scores.push({
                    level: me.level(),
                    score: newval, 
                    text: `${me.level()} - ${newval}`
                })
            });

            me.changePic = () => {
                me.picClickCount(me.picClickCount() + 1);

                if (me.picClickCount() == pics.length)
                    me.picClickCount(0);
                
                me.imgsrc(pics[me.picClickCount()])
            }
        },

        vm = function () {
            self.playerName = ko.observable('sue');
            self.players = ko.observableArray();
            self.levels = [...Array(10).keys()].map(k => k + 1).map(nk => `level ${nk}`);
            self.addPlayer = () => {
                if (!self.playerName() || self.playerName() == '')
                    alert('You must enter player name')
                else{
                    self.players.push(new playerDara(self.playerName()));
                    self.playerName('')
                }
            }
            self.removePlayer = (p) => {
                console.log(p)
                if (confirm(`Remove ${p.names()} from the game?`))
                    self.players.remove(p)
            }
        },

        anza = () => {
            ko.applyBindings(new vm(), document.getElementById('wrapper'))
        }

    return { anza: anza }

})();

app.anza();