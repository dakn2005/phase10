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
        gamelevels = [...Array(10).keys()].map(k => k + 1), //.map(nk => `level ${nk}`),

        playerDara = function (args) {
            let me = this;
            me.picClickCount = ko.observable(args.picClickCount ? args.picClickCount : 0)
            me.moveToNextLevel = ko.observable(args.moveToNextLevel ? args.moveToNextLevel : false);
            me.nextLevel = ko.observable(args.nextLevel ? args.nextLevel : '');
            me.imgsrc = ko.observable(args.imgsrc ? args.imgsrc : pics[0]);
            me.names = ko.observable(args.names.toLowerCase().charAt(0).toUpperCase() + args.names.toLowerCase().slice(1));
            me.level = ko.observable(args.level ? args.level : 1);
            me.img = ko.observable();
            me.score = ko.observable();
            me.scores = ko.observableArray(args.scores ? args.scores : []);
            me.scoreTotal = ko.pureComputed(() => me.scores().map(obj => obj.score).reduce(
                (a, n) => parseInt(a) + parseInt(n), 0
            ));

            me.onScore = (d, e) => onEnter(e, me.addScore, true);

            me.addScore = () => {
                if (!!me.score() && me.score() !== '') {
                    me.scores.push({
                        level: me.level(),
                        score: me.score(),
                        text: self.isUno() ? `${me.score()}pts` : `level ${me.level()} - ${me.score()}`
                    });

                    me.score('');

                    if (me.moveToNextLevel()) {
                        me.level(parseInt(me.level()) + 1)
                        me.moveToNextLevel(false);
                    }
                }
            }
            // me.score.subscribe((newval) => {
            // });

            me.popScore = () => {
                if (confirm('remove last score?'))
                    me.scores.pop();
            }

            me.resetScores = () => {
                if (confirm('Reset player scores?')) {
                    me.scores([]);
                    me.level(1);
                }
            }

            me.onChange = () => {
                me.moveToNextLevel(false)
            }

            me.levelUp = () => {
                me.moveToNextLevel(true);
                me.nextLevel(parseInt(me.level()) + 1)
                Snackbar.show({
                    text: `${me.names()} has moved to the next level (score updated after recording current score)`,
                    pos: 'top-center',
                    duration: 2000,
                    showAction: false,
                    customClass: 'snack-margin'
                });
            }

            me.changePic = () => {
                me.picClickCount(me.picClickCount() + 1);

                if (me.picClickCount() == pics.length)
                    me.picClickCount(0);

                me.imgsrc(pics[me.picClickCount()])
            }

            me.removePlayer = (p) => {
                if (confirm(`Remove ${p.names()} from the game?`))
                    self.players.remove(p)
            }
        },

        onEnter = (e, func, numonly) => {
            let regx = /[0-9]/g

            if (e.keyCode === 13)
                func()
            else if (!regx.test(e.key) && numonly)
                return false;
            else
                return true
        },

        vm = function () {
            self.playerName = ko.observable('');
            self.players = ko.observableArray([]);
            self.levels = gamelevels.map(k => ({
                text: `level ${k}`,
                value: k
            }));
            self.isUno = ko.observable(false);

            self.onPlayerEnter = (d, e) => onEnter(e, self.addPlayer)

            self.addPlayer = () => {
                if (!self.playerName() || self.playerName() == '')
                    alert('You must enter player name')
                else {
                    self.players.push(new playerDara({
                        names: self.playerName()
                    }));
                    self.playerName('')
                }
            }

            // self.isUno.subscribe(nv => {
            //     if (self.players().length > 0 && confirm('Changing the game will reset all scores?'))
            //         self.players().map(obj => {
            //             obj.scores([])
            //         })
            //     // }else 
            //     //     return !nv
            // })

            self.resetAllScores = () => {
                if (confirm('Reset all players\' scores?')) {
                    self.players().map(ply => {
                        ply.scores([])
                        ply.level(1)
                    })
                }
            }

            self.resetAll = () => {
                if (confirm('Reset game, remove all players?')) {
                    self.playerName('')
                    self.players([])
                }
            }

            self.shareableUrl = ko.pureComputed(() => {
                let urlstr = location.href + '?pd=' + JSON.stringify(ko.toJSON(self.players()));
                // return `whatsapp://send?text=${urlstr}`;
                return `https://api.whatsapp.com/send?text=${urlstr}`
            })

            // self.sharePlayerData = () => {
            //     navigator.permissions.query({ name: "clipboard-write" }).then(result => {
            //         if (result.state == "granted" || result.state == "prompt") {
            //             let urlstr = location.href + '?pd=' + JSON.stringify(ko.toJSON(self.players()));
            //             // self.shareUrl(`whatsapp://send?text=${urlstr}`)
            //             navigator.clipboard.writeText(urlstr).then(function () {
            //                 alert(`copied to clipboard, paste link and share`);
            //             }, function (err) {
            //                 console.error('Async: Could not copy text: ', err);
            //             });
            //         }
            //     });

            // }
        },

        loadShareData = () => {
            const queryString = window.location.search, urlParams = new URLSearchParams(queryString);
            if (urlParams.has('pd')) {
                let pd = urlParams.get('pd')
                if (pd && pd !== '') {
                    let jsnobj = JSON.parse(JSON.parse(pd));
                    jsnobj.map(obj => {
                        self.players.push(new playerDara(obj))
                    });
                }
            }

        }

    anza = () => {
        ko.applyBindings(new vm(), document.getElementById('bory'))
        // document.getElementById('btnadd').click();
        loadShareData();
    }

    return { anza: anza }

})();

app.anza();
