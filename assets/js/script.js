;(function($) {
    // Description:
//    Executes a function a max of once every n milliseconds
//
// Arguments:
//    Func (Function): Function to be throttled.
//
//    Delay (Integer): Function execution threshold in milliseconds.
//
// Returns:
//    Lazy_function (Function): Function with throttling applied.
    var throttle = function(func, delay) {
        var timer = null;
        return function() {
            var context = this,
                args = arguments;
            if (timer === null) {
                timer = setTimeout(function() {
                    func.apply(context, args);
                    timer = null;
                }, delay);
            }
        };
    };
// Description:
//    Executes a function when it stops being invoked for n seconds
//    Modified version of _.debounce() http://underscorejs.org
//
// Arguments:
//    Func (Function): Function to be debounced.
//
//    Delay (Integer): Function execution threshold in milliseconds.
//
//    Immediate (Bool): Whether the function should be called at the beginning
//    of the delay instead of the end. Default is false.
//
// Returns:
//    Lazy_function (Function): Function with debouncing applied.
    var debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        return function() {
            context = this;
            args = arguments;
            timestamp = new Date();
            var later = function() {
                var last = (new Date()) - timestamp;
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) result = func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) result = func.apply(context, args);
            return result;
        };
    };

    /*
    Monster Statistics by Challenge Rating

    Index: [
        Challenge Rating,
        Prof. Bonus,
        Armor Class,
        [
            Hit Points Low,
            Hit Points High
        ],
        Attack Bonus,
        [
            Damage Per Round Low,
            Damage Per Round High
        ],
        Save DC,
        Experience,
        HP Multiplier for resistances
        HP Multiplier for immunities
    ]

    i: [cr,pb,ac,hp,ab,dpr,save,exp]

     */

    var stats = {
        0: ['0:',2,13,[1,6],3,[0,1],13,10,2,2],
        1: ['1/8',2,13,[7,35],3,[2,3],13,25,2,2],
        2: ['1/4',2,13,[36,49],3,[4,5],13,50,2,2],
        3: ['1/2',2,13,[50,70],3,[6,8],13,100,2,2],
        4: ['1',2,13,[71,85],3,[9,14],13,200,2,2],
        5: ['2',2,13,[86,100],3,[15,20],13,450,2,2],
        6: ['3',2,13,[101,115],4,[21,26],13,700,2,2],
        7: ['4',2,14,[116,130],5,[27,32],14,1100,2,2],
        8: ['5',3,15,[131,145],6,[33,38],15,1800,1.5,2],
        9: ['6',3,15,[146,160],6,[39,44],15,2300,1.5,2],
        10:['7',3,15,[161,175],6,[45,50],15,2900,1.5,2],
        11:['8',3,16,[176,190],7,[51,56],16,3900,1.5,2],
        12:['9',4,16,[191,205],7,[57,62],16,5000,1.5,2],
        13:['10',4,17,[206,220],7,[63,68],16,5900,1.5,2],
        14:['11',4,17,[221,235],8,[69,74],17,7200,1.25,1.5],
        15:['12',4,17,[236,250],8,[75,80],17,8400,1.25,1.5],
        16:['13',5,18,[251,265],8,[81,86],18,10000,1.25,1.5],
        17:['14',5,18,[266,280],8,[87,92],18,11500,1.25,1.5],
        18:['15',5,18,[281,295],8,[93,98],18,13000,1.25,1.5],
        19:['16',5,18,[296,310],9,[99,104],18,15000,1.25,1.5],
        20:['17',6,19,[311,325],10,[105,110],19,18000,1,1.25],
        21:['18',6,19,[326,340],10,[111,116],19,20000,1,1.25],
        22:['19',6,19,[341,355],10,[117,122],19,22000,1,1.25],
        23:['20',6,19,[356,400],10,[123,140],19,25000,1,1.25],
        24:['21',7,19,[401,445],11,[141,158],20,33000,1,1.25],
        25:['22',7,19,[446,490],11,[159,176],20,41000,1,1.25],
        26:['23',7,19,[491,535],11,[177,194],20,50000,1,1.25],
        27:['24',7,19,[536,580],12,[195,212],21,62000,1,1.25],
        28:['25',8,19,[581,625],12,[213,230],21,75000,1,1.25],
        29:['26',8,19,[626,670],12,[231,248],21,90000,1,1.25],
        30:['27',8,19,[671,715],13,[249,266],22,105000,1,1.25],
        31:['28',8,19,[716,760],13,[267,284],22,120000,1,1.25],
        32:['29',9,19,[761,805],13,[285,302],22,135000,1,1.25],
        33:['30',9,19,[806,850],14,[303,320],23,155000,1,1.25]
    };

    var getStatsKey = function(col,stat){
        var index,
            key=0
        ;
        switch(col) {
            case 'cr':
                index = 0;
                break;
            case 'hp':
                index = 3;
                break;
            case 'dpr':
                index = 5;
                break;
            default:
            index = 3;
        }
        if(typeof stats[0][index] == "object"){
            for(var i in stats) {
                if (stat >= stats[i][index][0] && stat <= stats[i][index][1]) {
                    key = parseInt(i);
                    break;
                }
            }
        } else {
            for(var i in stats){
                if(i == 33){
                    key = parseInt(i);
                    break;
                } else if(stat >= stats[i][index] && stat <= stats[i][index]){
                    key = parseInt(i);
                    break;
                }
            }
        }
        return key;
    };

    var getVRI = function(base){
        var vuln,resist,immune,val,sumVRIs;

        vuln = $(".btn-danger input[type=radio]:checked","#VRI");
        resist = $(".btn-info input[type=radio]:checked","#VRI");
        immune = $(".btn-success input[type=radio]:checked","#VRI");
        sumVRIs = resist.length + immune.length - vuln.length;

        if(sumVRIs >= 3 ){
            // more than three net resistances or immunities
            val = (resist.length * stats[base][8] + immune.length * stats[base][9]) / (resist.length + immune.length);

        } else if (sumVRIs <= -3) {
            // more than three net vulnerabilities
            val = .5;
        }
        return val;
    };

    var calc_CR = debounce(function() {
        var values,
            type,lock,
            CR,
            acDiff,abDiff,
            defCR, offCR,
            mobStats,VRI
        ;

        type = $("#mob-type input:checked").val();
        lock = $("#lock input:checked").val();

        if(lock){
            setSliders(getStatsKey(lock,$("#"+lock).val()),lock);
        }

        values = {
            ac: parseInt($('#ac').val()),
            hp: parseInt($('#hp').val()),
            ab: parseInt($('#ab').val()),
            dpr: parseInt($('#dpr').val()),
            save: parseInt($('#save').val())
        };

        //TODO: adjust stats based on features
        defCR = getStatsKey('hp',values.hp);
        mobStats = stats[defCR];

        VRI = getVRI(defCR);
        values.adj_hp = Math.round(values.hp * VRI);

        if(values.adj_hp){
            defCR = getStatsKey('hp',values.adj_hp);
        }

        acDiff = Math.round((values.ac-mobStats[2])/2);
        defCR = defCR + acDiff;

        offCR = getStatsKey('dpr',values.dpr);
        mobStats = stats[offCR];

        if(type == 'melee'){
            abDiff = Math.round((values.ab-mobStats[4])/2);
        } else {
            abDiff = Math.round((values.save-mobStats[6])/2);
        }
        offCR = offCR + abDiff;

        CR = Math.round((defCR+offCR)/2);

        //TODO: toggle between attack bonus and save DC. Melee vs Caster effectiveness
        if(!lock){
            $('#pb').slider("setValue", stats[CR][1]).trigger("change");
            if(type=='melee'){
                $('#save').slider("setValue", stats[CR][6]).trigger("change");
            } else {
                $('#ab').slider("setValue", stats[CR][4]).trigger("change");
            }
        }
        $("#cr-val").text(stats[CR][0]);
        $("#exp-val").text(stats[CR][7]);


    },100);

    var lockSliders = function(val){
        var VRI,hp,dpr;
        if(val == 'hp'){
            $("#pb,#ac,#ab,#save,#dpr").slider("disable");
        } else if (val == 'dpr'){
            $("#pb,#ac,#ab,#save,#hp").slider("disable");
        } else {
            var type = $("#mob-type input:checked").val();
            $("#ac,#dpr,#hp").slider("enable");
            if(type == 'melee'){
                $("#ab").slider("enable");
            } else {
                $("#save").slider("enable");
            }
        }
    };

    var unlockSliders = function(){
        lockSliders();
    };

    var setSliders = function(key,val){
        if(val == 'hp'){

            dprAvg = Math.round((stats[key][5][0] + stats[key][5][1]) / 2);
            $('#pb').slider("setValue", stats[key][1]).next().text(stats[key][1]);
            $('#ac').slider("setValue", stats[key][2]).next().text(stats[key][2]);
            $('#ab').slider("setValue", stats[key][4]).next().text(stats[key][4]);
            $('#dpr').slider("setValue", dprAvg).next().text(dprAvg);
            $('#save').slider("setValue", stats[key][6]).next().text(stats[key][6]);

        } else if(val == 'dpr'){

            hpAvg = Math.round((stats[key][3][0] + stats[key][3][1]) / 2);
            $('#pb').slider("setValue", stats[key][1]).next().text(stats[key][1]);
            $('#ac').slider("setValue", stats[key][2]).next().text(stats[key][2]);
            $('#ab').slider("setValue", stats[key][4]).next().text(stats[key][4]);
            $('#hp').slider("setValue", hpAvg).next().text(hpAvg);
            $('#save').slider("setValue", stats[key][6]).next().text(stats[key][6]);
        }
    };

    $(document).ready(function() {
        $("#pb,#ac,#ab,#save,#hp,#dpr")
            .on("change",function(e){
                var $this = $(this);
                if($this.slider("isEnabled")){
                    calc_CR();
                    $this.next().text(e.value.newValue);
                } else {
                    $this.next().text($this.val());
                }
            })
            .slider({tooltip_position:'bottom'});
        $("#mob-type input").on("change",function(e){
            var lock = $("#lock input:checked").val();
            if(!lock) {
                $('#save').slider("toggle");
                $('#ab').slider("toggle");
                calc_CR();
            }
        });
        $(".btn-group input[type=radio]").on("change",function(e){
            calc_CR();
        });
        $("#lock input").on("change",function(e){
            var $this = $(this);
            if($this.is(":checked")){
                $this.parents(".checkbox").siblings().addClass("disabled").find("input").prop("disabled",true);
                lockSliders($this.val());
            } else {
                $this.parents(".checkbox").siblings().removeClass("disabled").find("input").prop("disabled",false);
                unlockSliders();
            }
            calc_CR();
        });
    });
})(jQuery);