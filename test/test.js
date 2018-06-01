(function(postposition) {
    if (postposition === undefined) {
        postposition = require("../dist/cox.postposition.min");
    }

    var basic = [
        "가/나/다/라/마/바/사/아/자/자/차/카/타/파/하",
        "A/B/C/D/E/F/G/H/I/J/K/O/P/Q/S/T/U/V/W/X/Y/Z",
        "2/4/5/9",
        "le/me/ne",
        "sub/hub/stub/curb",
        "pad/period/wood/hod/hood/mad/could/world",
        "help/stamp/dump/loop/hoop",
        "hit/suit/wait/limit/quit/quiet/diet",
        "great/meet/street/root/beat/seat",
        "break/seek/check/hook/mook/break/talk",
        "gag/pig/mug/dog",
        "sync/disc",
        "later/tumblr",
        "g.i.t/.ip",
        "{가}/(le)/[2]/'loop'"
    ].join("/");

    var special = [
        "ㄱ/ㄴ/ㄷ/ㅁ/ㅂ/ㅅ/ㅇ/ㅈ/ㅊ/ㅋ/ㅌ/ㅍ/ㅎ",
        "각/갂/난/닫/맘/밥/삿/샀/앙/잦/찿/캌/탙/팦/핳",
        "삯/앉/않/닭/앎/곬/넓/값/핥/값",
        "3/6/0",
        "M/N",
        "cab/lib/lab/tomb/bomb/climb/thumb/club/noob/grab/job",
        "god/good",
        "tap/cheap/snap/step/keep/sleep/ship/trip/group/soup/cup/drop",
        "it/commit/submit/fit/habit/private",
        "cat/fat/let/hot/put/cut/foot",
        "on/run/one/main/learn/turn/jane/done",
        "dream/name/come/room/team/term",
        "kick/pack/rick/book/cook/tack/lock",
        "big/bag",
        "mac/basic/magic/spec/codec/doc",
        "bang/ting/long",
        "app",
        "{각}/(cat)/[3]/'bang'"
    ].join("/");

    var ro = [
        "랄",
        "ㄹ",
        "1/7/8",
        "L/R",
        "all/cool/total/literal/call/locale/drill",
        "{랄}/(cool)/[7]/'call'"
    ].join("/");


    var errors = [];
    var checkArr = function(list, result, pp) {
        list.split("/").forEach(function(text) {
            if (postposition.check(text, pp) !== result) {
                errors.push(postposition.put(text, pp));
            }
        });
    };
    var checkParser = function(list, pp, pattern) {
        list.split("/").forEach(function(text) {
            var sentence = text + "[" + pattern + "]";
            var value = postposition.parse(sentence);
            var result = text + pp;

            if (value !== result) {
                errors.push(sentence + " : " + value);
            }
        });
    };


    checkArr(basic, false, "이");
    checkArr(special, true, "이");
    checkArr(ro, true, "이");
    checkArr(basic, false, "으로");
    checkArr(special, true, "으로");
    checkArr(ro, false, "으로");

    checkParser(basic, "가", "가|이");
    checkParser(special, "이", "가|이");
    checkParser(ro, "이", "가|이");

    console.log("> cox.postposition errors :", errors.length);

    if (errors.length) {
        typeof displayResult === "function" && displayResult(errors);
        console.log(" - " + errors.join("\n - "));
    }
})(this.postposition);
